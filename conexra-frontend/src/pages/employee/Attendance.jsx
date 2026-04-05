import { useState, useEffect } from "react";
import { 
  FaCheckCircle, 
  FaTimesCircle, 
  FaClock, 
  FaCalendarAlt,
  FaArrowLeft,
  FaArrowRight,
  FaUserCheck,
  FaUserTimes
} from "react-icons/fa";
import { getAttendance, checkIn, checkOut } from "../../services/attendanceService";

function MyAttendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState("checked-out");
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    totalDays: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getAttendance()
      .then((records) => {
        const history = records.map((item) => ({
          id: item._id || item.id,
          date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0],
          day: item.date ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }) : '',
          checkIn: item.checkIn || '-',
          checkOut: item.checkOut || '-',
          status: item.status || 'present',
          late: item.late || false,
          hours: item.hours || (item.checkIn && item.checkOut ? '8h 0m' : '-')
        }));

        setAttendanceHistory(history);

        const present = history.filter((a) => a.status === 'present').length;
        const absent = history.filter((a) => a.status === 'absent').length;
        const late = history.filter((a) => a.status === 'late').length;

        setStats({
          present,
          absent,
          late,
          totalDays: history.length,
        });
      })
      .catch((err) => {
        setError(err?.response?.data?.error || err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    checkIn()
      .then(() => {
        setAttendanceStatus("checked-in");
        alert(`Checked in successfully at ${currentTime.toLocaleTimeString()}`);
        return getAttendance();
      })
      .then((records) => {
        const history = records.map((item) => ({
          id: item._id || item.id,
          date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0],
          day: item.date ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }) : '',
          checkIn: item.checkIn || '-',
          checkOut: item.checkOut || '-',
          status: item.status || 'present',
          late: item.late || false,
          hours: item.hours || (item.checkIn && item.checkOut ? '8h 0m' : '-')
        }));
        setAttendanceHistory(history);
      })
      .catch((err) => {
        setError(err?.response?.data?.error || err.message);
      });
  };

  const handleCheckOut = () => {
    checkOut()
      .then(() => {
        setAttendanceStatus("checked-out");
        alert(`Checked out successfully at ${currentTime.toLocaleTimeString()}`);
        return getAttendance();
      })
      .then((records) => {
        const history = records.map((item) => ({
          id: item._id || item.id,
          date: item.date ? item.date.split('T')[0] : new Date().toISOString().split('T')[0],
          day: item.date ? new Date(item.date).toLocaleDateString('en-US', { weekday: 'short' }) : '',
          checkIn: item.checkIn || '-',
          checkOut: item.checkOut || '-',
          status: item.status || 'present',
          late: item.late || false,
          hours: item.hours || (item.checkIn && item.checkOut ? '8h 0m' : '-')
        }));
        setAttendanceHistory(history);
      })
      .catch((err) => {
        setError(err?.response?.data?.error || err.message);
      });
  };

  const changeMonth = (increment) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(selectedMonth.getMonth() + increment);
    setSelectedMonth(newMonth);
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "present": return "#10b981";
      case "absent": return "#ef4444";
      case "late": return "#f59e0b";
      default: return "#64748b";
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "present":
        return { background: "#d1fae5", color: "#065f46", text: "Present" };
      case "absent":
        return { background: "#fee2e2", color: "#991b1b", text: "Absent" };
      case "late":
        return { background: "#fef3c7", color: "#92400e", text: "Late" };
      default:
        return { background: "#f1f5f9", color: "#475569", text: status };
    }
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>My Attendance</h1>
        <div style={styles.clockCard}>
          <FaClock style={styles.clockIcon} />
          <div>
            <div style={styles.clockTime}>{currentTime.toLocaleTimeString()}</div>
            <div style={styles.clockDate}>
              {currentTime.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Check-in/out Card */}
      <div style={styles.checkInCard}>
        <div style={styles.checkInHeader}>
          <h2 style={styles.checkInTitle}>Today's Attendance</h2>
          <div style={styles.statusBadge}>
            Status: 
            <span style={{
              ...styles.statusIndicator,
              backgroundColor: attendanceStatus === "checked-in" ? "#10b981" : "#ef4444",
              color: "white",
              marginLeft: "10px"
            }}>
              {attendanceStatus === "checked-in" ? "Checked In" : "Checked Out"}
            </span>
          </div>
        </div>
        
        <div style={styles.buttonGroup}>
          <button 
            onClick={handleCheckIn}
            style={{
              ...styles.checkButton,
              ...styles.checkInButton,
              opacity: attendanceStatus === "checked-in" ? 0.5 : 1,
              cursor: attendanceStatus === "checked-in" ? "not-allowed" : "pointer"
            }}
            disabled={attendanceStatus === "checked-in"}
          >
            <FaCheckCircle /> Check In
          </button>
          <button 
            onClick={handleCheckOut}
            style={{
              ...styles.checkButton,
              ...styles.checkOutButton,
              opacity: attendanceStatus === "checked-out" ? 0.5 : 1,
              cursor: attendanceStatus === "checked-out" ? "not-allowed" : "pointer"
            }}
            disabled={attendanceStatus === "checked-out"}
          >
            <FaTimesCircle /> Check Out
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <div style={{...styles.statIconWrapper, background: "#dbeafe"}}>
            <FaUserCheck style={{...styles.statIcon, color: "#3b82f6"}} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Present</span>
            <span style={styles.statValue}>{stats.present}</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIconWrapper, background: "#fee2e2"}}>
            <FaUserTimes style={{...styles.statIcon, color: "#ef4444"}} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Absent</span>
            <span style={styles.statValue}>{stats.absent}</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIconWrapper, background: "#fef3c7"}}>
            <FaClock style={{...styles.statIcon, color: "#f59e0b"}} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Late</span>
            <span style={styles.statValue}>{stats.late}</span>
          </div>
        </div>
        <div style={styles.statCard}>
          <div style={{...styles.statIconWrapper, background: "#e0e7ff"}}>
            <FaCalendarAlt style={{...styles.statIcon, color: "#6366f1"}} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Total Days</span>
            <span style={styles.statValue}>{stats.totalDays}</span>
          </div>
        </div>
      </div>

                  {/* Month Selector - FIXED WITH VISIBLE ARROWS */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "20px",
        marginBottom: "20px",
        background: "white",
        padding: "10px",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
      }}>
        <button 
          onClick={() => changeMonth(-1)} 
          style={{
            width: "44px",
            height: "44px",
            border: "2px solid #3b82f6",
            borderRadius: "10px",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            color: "#3b82f6",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(59,130,246,0.2)",
          }}
        >
          ←
        </button>
        <h3 style={{
          fontSize: "18px",
          color: "#0f172a",
          margin: 0,
          fontWeight: "600",
          minWidth: "200px",
          textAlign: "center",
        }}>
          {formatMonth(selectedMonth)}
        </h3>
        <button 
          onClick={() => changeMonth(1)} 
          style={{
            width: "44px",
            height: "44px",
            border: "2px solid #3b82f6",
            borderRadius: "10px",
            background: "white",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "20px",
            color: "#3b82f6",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(59,130,246,0.2)",
          }}
        >
          →
        </button>
      </div>

      {/* Attendance History Table */}
      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Day</th>
              <th style={styles.th}>Check In</th>
              <th style={styles.th}>Check Out</th>
              <th style={styles.th}>Hours</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendanceHistory.map(record => {
              const status = getStatusBadge(record.status);
              return (
                <tr key={record.id} style={record.date === new Date().toISOString().split('T')[0] ? styles.todayRow : {}}>
                  <td style={styles.td}>
                    {new Date(record.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td style={styles.td}>{record.day}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.checkTime,
                      color: record.late ? "#ef4444" : "inherit"
                    }}>
                      {record.checkIn}
                      {record.late && <span style={styles.lateBadge}>Late</span>}
                    </span>
                  </td>
                  <td style={styles.td}>{record.checkOut}</td>
                  <td style={styles.td}>{record.hours}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      backgroundColor: status.background,
                      color: status.color
                    }}>
                      {status.text}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={styles.summaryContainer}>
        <p>Showing {attendanceHistory.length} attendance records</p>
      </div>
    </div>
  );
}

// Styles
const styles = {
  pageContainer: {
    width: "100%",
    background: "",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  pageTitle: {
    fontSize: "28px",
    color: "#0f172a",
    margin: 0,
    fontWeight: "600",
  },
  clockCard: {
    background: "white",
    padding: "12px 20px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  clockIcon: {
    fontSize: "24px",
    color: "#3b82f6",
  },
  clockTime: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
  },
  clockDate: {
    fontSize: "12px",
    color: "#64748b",
  },
  checkInCard: {
    background: "white",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "30px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  checkInHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  },
  checkInTitle: {
    fontSize: "18px",
    margin: 0,
    color: "#0f172a",
    fontWeight: "600",
  },
  statusBadge: {
    fontSize: "14px",
    color: "#475569",
    display: "flex",
    alignItems: "center",
  },
  statusIndicator: {
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
  },
  buttonGroup: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
  },
  checkButton: {
    padding: "15px",
    border: "none",
    borderRadius: "10px",
    fontSize: "16px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  checkInButton: {
    background: "#10b981",
    color: "white",
  },
  checkOutButton: {
    background: "#ef4444",
    color: "white",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },
  statCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  statIconWrapper: {
    width: "50px",
    height: "50px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statIcon: {
    fontSize: "24px",
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "4px",
  },
  statValue: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#0f172a",
  },
  monthSelector: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "20px",
  },
  monthNavButton: {
  width: "40px",
  height: "40px",
  border: "2px solid #3b82f6", // Changed from #e2e8f0 to blue
  borderRadius: "8px",
  background: "white",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "16px",
  color: "#3b82f6", // Blue color for the button itself
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  transition: "all 0.2s ease",
},
  monthTitle: {
    fontSize: "18px",
    color: "#0f172a",
    margin: 0,
    fontWeight: "600",
    minWidth: "200px",
    textAlign: "center",
  },
  tableContainer: {
    background: "white",
    borderRadius: "12px",
    overflow: "auto",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "800px",
  },
  th: {
    textAlign: "left",
    padding: "16px",
    background: "#f8fafc",
    borderBottom: "2px solid #e2e8f0",
    color: "#475569",
    fontSize: "14px",
    fontWeight: "600",
  },
  td: {
    padding: "16px",
    borderBottom: "1px solid #e2e8f0",
    fontSize: "14px",
    color: "#0f172a",
  },
  todayRow: {
    background: "#f0f9ff",
  },
  checkTime: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  lateBadge: {
    background: "#fee2e2",
    color: "#ef4444",
    padding: "2px 8px",
    borderRadius: "12px",
    fontSize: "11px",
    fontWeight: "600",
  },
  summaryContainer: {
    textAlign: "right",
    color: "#64748b",
    fontSize: "14px",
    padding: "10px 0",
  },
};

export default MyAttendance;