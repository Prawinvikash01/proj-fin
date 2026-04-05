import { useState, useEffect } from 'react';
import { FaChartLine, FaCalendarAlt } from 'react-icons/fa';
import { getEmployeeStats, getLeaveReport, getAttendanceReport, getPayrollReport } from '../services/reportService';

function Reports() {
  const [employeeStats, setEmployeeStats] = useState(null);
  const [leaveReport, setLeaveReport] = useState([]);
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [payrollReport, setPayrollReport] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([getEmployeeStats(), getLeaveReport(), getAttendanceReport(), getPayrollReport()])
      .then(([stats, leaves, attendance, payrolls]) => {
        setEmployeeStats(stats);
        setLeaveReport(leaves);
        setAttendanceReport(attendance);
        setPayrollReport(payrolls);
      })
      .catch((err) => setError(err?.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: '24px' }}>Loading reports...</div>;

  return (
    <div style={container}>
      <h1 style={pageTitle}>Reports Dashboard</h1>
      {error && <div style={errorText}>{error}</div>}

      {employeeStats && (
        <div style={cardsRow}>
          <div style={card}><h4>Total Employees</h4><strong>{employeeStats.total}</strong></div>
          <div style={card}><h4>Active</h4><strong>{employeeStats.active}</strong></div>
          <div style={card}><h4>Inactive</h4><strong>{employeeStats.inactive}</strong></div>
          <div style={card}><h4>Terminated</h4><strong>{employeeStats.terminated}</strong></div>
        </div>
      )}

      <div style={block}>
        <h2><FaCalendarAlt /> Leave Report</h2>
        <div>Total leave requests: {leaveReport.length}</div>
      </div>

      <div style={block}>
        <h2><FaCalendarAlt /> Attendance Report</h2>
        <div>Total records: {attendanceReport.length}</div>
      </div>

      <div style={block}>
        <h2><FaChartLine /> Payroll Report</h2>
        <div>Total payroll entries: {payrollReport.length}</div>
      </div>
    </div>
  );
}

const container = { width: '100%', maxWidth: '1400px', margin: '0 auto' };
const pageTitle = { fontSize: '28px', color: '#0f172a', marginBottom: '20px' };
const cardsRow = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' };
const card = { background: 'white', borderRadius: '10px', padding: '18px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)' };
const block = { background: 'white', borderRadius: '10px', padding: '18px', marginBottom: '14px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)' };
const errorText = { color: '#b91c1c', marginBottom: '12px' };

export default Reports;
