import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSyncAlt, FaFileInvoiceDollar, FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { getPayrolls, createPayroll, updatePayroll, deletePayroll } from '../services/payrollService';
import { getEmployees } from '../services/employeeService';

function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newPayroll, setNewPayroll] = useState({ employeeId: '', salary: '', month: '', bonuses: '', deductions: '', payslipUrl: '' });
  const [editingPayroll, setEditingPayroll] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPayrolls();
    loadEmployees();
  }, []);

  const loadPayrolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPayrolls();
      setPayrolls(data);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      console.error('Failed to load employees', err);
    }
  };

  const resetForm = () => {
    setEditingPayroll(null);
    setNewPayroll({ employeeId: '', salary: '', month: '', bonuses: '', deductions: '', payslipUrl: '' });
    setError(null);
  };

  const onSavePayroll = async () => {
    if (!newPayroll.employeeId || !newPayroll.salary || !newPayroll.month) {
      setError('Employee, salary, and month are required');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const payload = {
        employeeId: newPayroll.employeeId,
        salary: Number(newPayroll.salary),
        bonuses: Number(newPayroll.bonuses) || 0,
        deductions: Number(newPayroll.deductions) || 0,
        month: newPayroll.month,
        payslipUrl: newPayroll.payslipUrl
      };

      if (editingPayroll) {
        const updated = await updatePayroll(editingPayroll._id || editingPayroll.id, payload);
        setPayrolls((prev) => prev.map((item) => (item._id === updated._id || item.id === updated._id ? updated : item)));
        resetForm();
      } else {
        const created = await createPayroll(payload);
        setPayrolls((prev) => [created, ...prev]);
        resetForm();
      }
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    } finally {
      setSaving(false);
    }
  };

  const onEditPayroll = (item) => {
    setEditingPayroll(item);
    setNewPayroll({
      employeeId: item.employee?._id || item.employeeId || '',
      salary: item.salary || '',
      month: item.month || '',
      bonuses: item.bonuses != null ? item.bonuses.toString() : '',
      deductions: item.deductions != null ? item.deductions.toString() : '',
      payslipUrl: item.payslipUrl || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete payroll record?')) return;
    try {
      await deletePayroll(id);
      setPayrolls((p) => p.filter((item) => item._id !== id && item.id !== id));
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
  };

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <h1 style={pageTitle}>Payroll Management</h1>
        <button onClick={loadPayrolls} style={refreshButton}>
          <FaSyncAlt /> Refresh
        </button>
      </div>

      {error && <div style={errorStyle}>{error}</div>}

      <div style={panel}>
        <h2 style={panelTitle}>{editingPayroll ? 'Edit Payroll Record' : 'Add Payroll Record'}</h2>
        <div style={formRow}>
          <select
            value={newPayroll.employeeId}
            onChange={(e) => setNewPayroll((p) => ({ ...p, employeeId: e.target.value }))}
            style={inputStyle}
          >
            <option value="">Select employee</option>
            {employees.map((emp) => (
              <option key={emp._id || emp.id} value={emp._id || emp.id}>
                {emp.user?.name || emp.user?.email}
              </option>
            ))}
          </select>
          <input
            type="month"
            value={newPayroll.month}
            onChange={(e) => setNewPayroll((p) => ({ ...p, month: e.target.value }))}
            style={inputStyle}
          />
          <input
            type="number"
            value={newPayroll.salary}
            onChange={(e) => setNewPayroll((p) => ({ ...p, salary: e.target.value }))}
            placeholder="Salary"
            style={inputStyle}
          />
        </div>
        <div style={formRow}>
            <input
            type="number"
            value={newPayroll.bonuses}
            onChange={(e) => setNewPayroll((p) => ({ ...p, bonuses: e.target.value }))}
            placeholder="Bonuses"
            style={inputStyle}
          />
          <input
            type="number"
            value={newPayroll.deductions}
            onChange={(e) => setNewPayroll((p) => ({ ...p, deductions: e.target.value }))}
            placeholder="Deductions"
            style={inputStyle}
          />
          <input
            type="text"
            value={newPayroll.payslipUrl}
            onChange={(e) => setNewPayroll((p) => ({ ...p, payslipUrl: e.target.value }))}
            placeholder="Payslip URL"
            style={inputStyle}
          />
        </div>
        <div style={formActions}>
          <button onClick={onSavePayroll} style={saveButton} disabled={saving}>
            <FaSave /> {editingPayroll ? 'Update Payroll' : 'Create Payroll'}
          </button>
          {editingPayroll && (
            <button onClick={resetForm} style={cancelButton}>
              <FaTimes /> Cancel
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div>Loading payroll records...</div>
      ) : (
        <div style={tableContainer}>
          <table style={table}>
            <thead>
              <tr>
                <th style={th}>Employee</th>
                <th style={th}>Month</th>
                <th style={th}>Salary</th>
                <th style={th}>Bonuses</th>
                <th style={th}>Deductions</th>
                <th style={th}>Net Pay</th>
                <th style={th}>Payslip</th>
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((item) => {
                const employeeName = item.employee?.user?.name || item.employeeName || 'Unknown';
                const bonuses = item.bonuses || 0;
                const deductions = item.deductions || 0;
                const salary = item.salary || 0;
                const netPay = salary + bonuses - deductions;
                return (
                  <tr key={item._id || item.id}>
                    <td style={td}>{employeeName}</td>
                    <td style={td}>{item.month || 'N/A'}</td>
                    <td style={td}>${salary.toLocaleString()}</td>
                    <td style={td}>${bonuses.toLocaleString()}</td>
                    <td style={td}>${deductions.toLocaleString()}</td>
                    <td style={td}>${netPay.toLocaleString()}</td>
                    <td style={td}>
                      {item.payslipUrl ? (
                        <a href={item.payslipUrl} target="_blank" rel="noreferrer" style={{ color: '#000' }}>View</a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td style={td}>
                      <div style={actionGroup}>
                        <button onClick={() => onEditPayroll(item)} style={editButton}>
                          <FaEdit />
                        </button>
                        <button onClick={() => onDelete(item._id || item.id)} style={deleteButton}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {payrolls.length === 0 && (
                <tr>
                  <td style={td} colSpan={8}>No payroll records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const pageContainer = { width: '100%', maxWidth: '1400px', margin: '0 auto' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', color: '#000' };
const pageTitle = { fontSize: '28px', color: '#000', margin: 0 };
const refreshButton = { border: 'none', background: '#3b82f6', color: 'white', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' };
const errorStyle = { marginBottom: '16px', color: '#b91c1c', fontWeight: 600 };
const panel = { marginBottom: '24px', padding: '20px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', color: '#000' };
const panelTitle = { margin: 0, marginBottom: '16px', fontSize: '20px', color: '#000' };
const formRow = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px', marginBottom: '12px' };
const inputStyle = { padding: '12px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', width: '100%', color: 'gray' };
const formActions = { display: 'flex', gap: '12px', flexWrap: 'wrap' };
const saveButton = { background: '#10b981', color: 'white', border: 'none', padding: '12px 18px', borderRadius: '8px', cursor: 'pointer' };
const cancelButton = { background: '#64748b', color: 'white', border: 'none', padding: '12px 18px', borderRadius: '8px', cursor: 'pointer' };
const tableContainer = { background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflowX: 'auto', color: '#000' };
const table = { width: '100%', borderCollapse: 'collapse', color: '#000' };
const th = { textAlign: 'left', padding: '12px', borderBottom: '2px solid #e2e8f0', background: '#f8fafc', color: '#000' };
const td = { padding: '12px', borderBottom: '1px solid #e2e8f0', verticalAlign: 'middle', color: '#000' };
const actionGroup = { display: 'flex', gap: '10px', flexWrap: 'wrap' };
const editButton = { border: 'none', background: '#3b82f6', color: 'white', borderRadius: '6px', padding: '8px 10px', cursor: 'pointer' };
const deleteButton = { border: 'none', background: '#ef4444', color: 'white', borderRadius: '6px', padding: '8px 10px', cursor: 'pointer' };

export default Payroll;
