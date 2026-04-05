import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSyncAlt, FaFileInvoiceDollar } from 'react-icons/fa';
import { getPayrolls, createPayroll, deletePayroll } from '../services/payrollService';

function Payroll() {
  const [payrolls, setPayrolls] = useState([]);
  const [newPayroll, setNewPayroll] = useState({ employeeName: '', salary: '', month: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPayrolls();
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

  const onAddPayroll = async () => {
    if (!newPayroll.employeeName || !newPayroll.salary || !newPayroll.month) {
      setError('Employee name, salary, and month are required');
      return;
    }

    try {
      const created = await createPayroll({ ...newPayroll });
      setPayrolls((p) => [created, ...p]);
      setNewPayroll({ employeeName: '', salary: '', month: '' });
      setError(null);
    } catch (err) {
      setError(err?.response?.data?.error || err.message);
    }
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

      <div style={addRow}>
        <input
          value={newPayroll.employeeName}
          onChange={(e) => setNewPayroll((p) => ({ ...p, employeeName: e.target.value }))}
          placeholder="Employee"
          style={inputStyle}
        />
        <input
          value={newPayroll.month}
          onChange={(e) => setNewPayroll((p) => ({ ...p, month: e.target.value }))}
          placeholder="Month"
          style={inputStyle}
          type="month"
        />
        <input
          value={newPayroll.salary}
          onChange={(e) => setNewPayroll((p) => ({ ...p, salary: e.target.value }))}
          placeholder="Salary"
          style={inputStyle}
          type="number"
        />
        <button onClick={onAddPayroll} style={addButton}>
          <FaPlus /> Add
        </button>
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
                <th style={th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payrolls.map((item) => (
                <tr key={item._id || item.id}>
                  <td style={td}>{item.employeeName || item.employee?.name || 'Unknown'}</td>
                  <td style={td}>{item.month || 'N/A'}</td>
                  <td style={td}>${item.salary || 0}</td>
                  <td style={td}>
                    <button onClick={() => onDelete(item._id || item.id)} style={actionBtn}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {payrolls.length === 0 && <tr><td style={td} colSpan={4}>No payroll records found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const pageContainer = { width: '100%', maxWidth: '1400px', margin: '0 auto' };
const headerStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' };
const pageTitle = { fontSize: '28px', color: '#0f172a', margin: 0 };
const refreshButton = { border: 'none', background: '#3b82f6', color: 'white', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer' };
const errorStyle = { marginBottom: '16px', color: '#b91c1c', fontWeight: 600 };
const addRow = { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' };
const inputStyle = { padding: '10px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', minWidth: '160px' };
const addButton = { background: '#10b981', color: 'white', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer' };
const tableContainer = { background: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflowX: 'auto' };
const table = { width: '100%', borderCollapse: 'collapse' };
const th = { textAlign: 'left', padding: '12px', borderBottom: '2px solid #e2e8f0', background: '#f8fafc' };
const td = { padding: '12px', borderBottom: '1px solid #e2e8f0' };
const actionBtn = { border: 'none', background: '#ef4444', color: 'white', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer' };

export default Payroll;
