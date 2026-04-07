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
        {leaveReport.length > 0 && (
          <div style={reportTableContainer}>
            <table style={reportTable}>
              <thead>
                <tr>
                  <th style={reportTh}>Employee</th>
                  <th style={reportTh}>Type</th>
                  <th style={reportTh}>Status</th>
                  <th style={reportTh}>From</th>
                  <th style={reportTh}>To</th>
                </tr>
              </thead>
              <tbody>
                {leaveReport.slice(0, 5).map((item) => (
                  <tr key={item._id || item.id}>
                    <td style={reportTd}>{item.employee?.user?.name || 'Unknown'}</td>
                    <td style={reportTd}>{item.type || 'N/A'}</td>
                    <td style={reportTd}>{item.status || 'N/A'}</td>
                    <td style={reportTd}>{new Date(item.startDate).toLocaleDateString()}</td>
                    <td style={reportTd}>{new Date(item.endDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={block}>
        <h2><FaCalendarAlt /> Attendance Report</h2>
        <div>Total records: {attendanceReport.length}</div>
        {attendanceReport.length > 0 && (
          <div style={reportTableContainer}>
            <table style={reportTable}>
              <thead>
                <tr>
                  <th style={reportTh}>Employee</th>
                  <th style={reportTh}>Date</th>
                  <th style={reportTh}>Status</th>
                  <th style={reportTh}>Check In</th>
                  <th style={reportTh}>Check Out</th>
                </tr>
              </thead>
              <tbody>
                {attendanceReport.slice(0, 5).map((item) => (
                  <tr key={item._id || item.id}>
                    <td style={reportTd}>{item.employee?.user?.name || 'Unknown'}</td>
                    <td style={reportTd}>{new Date(item.date).toLocaleDateString()}</td>
                    <td style={reportTd}>{item.status || 'N/A'}</td>
                    <td style={reportTd}>{item.checkIn ? new Date(item.checkIn).toLocaleTimeString() : 'N/A'}</td>
                    <td style={reportTd}>{item.checkOut ? new Date(item.checkOut).toLocaleTimeString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={block}>
        <h2><FaChartLine /> Payroll Report</h2>
        <div>Total payroll entries: {payrollReport.length}</div>
        {payrollReport.length > 0 && (
          <div style={reportTableContainer}>
            <table style={reportTable}>
              <thead>
                <tr>
                  <th style={reportTh}>Employee</th>
                  <th style={reportTh}>Month</th>
                  <th style={reportTh}>Salary</th>
                  <th style={reportTh}>Bonuses</th>
                  <th style={reportTh}>Deductions</th>
                </tr>
              </thead>
              <tbody>
                {payrollReport.slice(0, 5).map((item) => (
                  <tr key={item._id || item.id}>
                    <td style={reportTd}>{item.employee?.user?.name || item.employeeName || 'Unknown'}</td>
                    <td style={reportTd}>{item.month || 'N/A'}</td>
                    <td style={reportTd}>${item.salary || 0}</td>
                    <td style={reportTd}>${item.bonuses || 0}</td>
                    <td style={reportTd}>${item.deductions || 0}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

const container = { width: '100%', maxWidth: '1400px', margin: '0 auto' };
const pageTitle = { fontSize: '28px', color: '#0f172a', marginBottom: '20px' };
const cardsRow = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' };
const card = { background: 'white', borderRadius: '10px', padding: '18px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)' };
const block = { background: 'white', borderRadius: '10px', padding: '18px', marginBottom: '14px', boxShadow: '0 4px 10px rgba(0, 0, 0, 0.08)' };
const reportTableContainer = { overflowX: 'auto', marginTop: '12px' };
const reportTable = { width: '100%', borderCollapse: 'collapse', minWidth: '720px' };
const reportTh = { textAlign: 'left', padding: '10px', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' };
const reportTd = { padding: '10px', borderBottom: '1px solid #e2e8f0' };
const errorText = { color: '#b91c1c', marginBottom: '12px' };

export default Reports;
