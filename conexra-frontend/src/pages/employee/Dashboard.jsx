import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUser, 
  FaClock, 
  FaCalendarAlt, 
  FaTasks, 
  FaCheckCircle,
  FaArrowRight,
  FaBell,
  FaUserCheck,
  FaUserTimes
} from "react-icons/fa";

function EmployeeDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceStatus, setAttendanceStatus] = useState("checked-out");
  const [stats, setStats] = useState({
    presentDays: 18,
    absentDays: 2,
    leaveBalance: 12,
    pendingTasks: 3,
    completedTasks: 8
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCheckIn = () => {
    setAttendanceStatus("checked-in");
    alert(`Checked in successfully at ${currentTime.toLocaleTimeString()}`);
  };

  const handleCheckOut = () => {
    setAttendanceStatus("checked-out");
    alert(`Checked out successfully at ${currentTime.toLocaleTimeString()}`);
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  // All styles defined as JavaScript objects
  const styles = {
    pageContainer: {
      width: "100%",
      // color:"black",
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "20px 0",
    },
    welcomeHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
    },
    welcomeTitle: {
      fontSize: "28px",
      color: "#0f172a",
      margin: "0 0 8px 0",
      fontWeight: "600",
    },
    welcomeSubtitle: {
      fontSize: "14px",
      color: "#64748b",
      margin: 0,
    },
    headerRight: {
      display: "flex",
      alignItems: "center",
      gap: "20px",
    },
    notificationBadge: {
      position: "relative",
      cursor: "pointer",
    },
    notificationIcon: {
      fontSize: "24px",
      color: "#64748b",
    },
    notificationCount: {
      position: "absolute",
      top: "-5px",
      right: "-5px",
      background: "#ef4444",
      color: "white",
      fontSize: "11px",
      padding: "2px 5px",
      borderRadius: "10px",
      minWidth: "18px",
      textAlign: "center",
    },
    statsGrid: {
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
    statIconContainer: {
      width: "50px",
      height: "50px",
      borderRadius: "12px",
      background: "#f1f5f9",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    statIcon: {
      fontSize: "24px",
      color: "#3b82f6",
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
    contentGrid: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "20px",
      marginBottom: "20px",
    },
    leftColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    rightColumn: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    attendanceCard: {
      background: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    cardTitle: {
      fontSize: "18px",
      color: "#0f172a",
      margin: "0 0 20px 0",
      fontWeight: "600",
    },
    clockDisplay: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginBottom: "15px",
      padding: "15px",
      background: "#f8fafc",
      borderRadius: "8px",
    },
    clockIcon: {
      fontSize: "20px",
      color: "#3b82f6",
    },
    clockTime: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#0f172a",
    },
    attendanceStatus: {
      fontSize: "14px",
      color: "#475569",
      marginBottom: "20px",
      display: "flex",
      alignItems: "center",
    },
    statusBadge: {
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      color: "white",
      marginLeft: "10px",
    },
    attendanceButtons: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: "10px",
    },
    attendanceButton: {
      padding: "12px",
      border: "none",
      borderRadius: "8px",
      fontSize: "14px",
      fontWeight: "600",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      cursor: "pointer",
    },
    checkInButton: {
      background: "#10b981",
      color: "white",
    },
    checkOutButton: {
      background: "#ef4444",
      color: "white",
    },
    quickActionsCard: {
      background: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    quickActionsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "10px",
    },
    quickActionButton: {
      padding: "15px",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      background: "#f8fafc",
      cursor: "pointer",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: "8px",
    },
    quickActionIcon: {
      fontSize: "20px",
      color: "#3b82f6",
    },
    quickActionArrow: {
      fontSize: "12px",
      color: "#94a3b8",
    },
    activityCard: {
      background: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    activityList: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      marginBottom: "20px",
    },
    activityItem: {
      display: "flex",
      gap: "12px",
    },
    activityDot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      background: "#3b82f6",
      marginTop: "6px",
    },
    activityContent: {
      flex: 1,
    },
    activityText: {
      fontSize: "14px",
      color: "#0f172a",
      margin: "0 0 4px 0",
    },
    activityTime: {
      fontSize: "12px",
      color: "#94a3b8",
    },
    tasksCard: {
      background: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    },
    tasksList: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
      marginBottom: "20px",
    },
    taskItem: {
      display: "flex",
      gap: "12px",
      alignItems: "flex-start",
    },
    taskCheckbox: {
      width: "18px",
      height: "18px",
      marginTop: "2px",
      cursor: "pointer",
    },
    taskContent: {
      flex: 1,
    },
    taskTitle: {
      fontSize: "14px",
      color: "#0f172a",
      margin: "0 0 4px 0",
      fontWeight: "500",
    },
    taskDue: {
      fontSize: "12px",
      color: "#ef4444",
    },
    viewAllButton: {
      width: "100%",
      padding: "10px",
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      background: "white",
      color: "#3b82f6",
      fontSize: "14px",
      fontWeight: "500",
      cursor: "pointer",
    },
    leaveProgressCard: {
      background: "white",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      marginTop: "20px",
    },
    leaveProgressHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "15px",
    },
    leaveTotal: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#10b981",
    },
    progressBarContainer: {
      width: "100%",
      height: "8px",
      background: "#e2e8f0",
      borderRadius: "4px",
      marginBottom: "15px",
      overflow: "hidden",
    },
    progressBarFill: {
      width: "60%",
      height: "100%",
      background: "linear-gradient(90deg, #3b82f6 0%, #10b981 100%)",
      borderRadius: "4px",
    },
    leaveDetails: {
      display: "flex",
      gap: "20px",
      fontSize: "13px",
      color: "#64748b",
    },
  };

  return (
    <div style={styles.pageContainer}>
      {/* Welcome Header */}
      <div style={styles.welcomeHeader}>
        <div>
          <h1 style={styles.welcomeTitle}>Welcome back, {user.name}! 👋</h1>
          <p style={styles.welcomeSubtitle}>{formatDate(currentTime)}</p>
        </div>
        <div style={styles.headerRight}>
          <div style={styles.notificationBadge}>
            <FaBell style={styles.notificationIcon} />
            <span style={styles.notificationCount}>3</span>
          </div>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <FaUserCheck style={styles.statIcon} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Present Days</span>
            <span style={styles.statValue}>{stats.presentDays}</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <FaUserTimes style={styles.statIcon} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Absent Days</span>
            <span style={styles.statValue}>{stats.absentDays}</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <FaCalendarAlt style={styles.statIcon} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Leave Balance</span>
            <span style={styles.statValue}>{stats.leaveBalance}</span>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIconContainer}>
            <FaTasks style={styles.statIcon} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Pending Tasks</span>
            <span style={styles.statValue}>{stats.pendingTasks}</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div style={styles.contentGrid}>
        {/* Left Column */}
        <div style={styles.leftColumn}>
          {/* Attendance Card */}
          <div style={styles.attendanceCard}>
            <h2 style={styles.cardTitle}>Today's Attendance</h2>
            <div style={styles.clockDisplay}>
              <FaClock style={styles.clockIcon} />
              <span style={styles.clockTime}>{currentTime.toLocaleTimeString()}</span>
            </div>
            <div style={styles.attendanceStatus}>
              Status: 
              <span style={{
                ...styles.statusBadge,
                backgroundColor: attendanceStatus === "checked-in" ? "#10b981" : "#ef4444"
              }}>
                {attendanceStatus === "checked-in" ? "Checked In" : "Checked Out"}
              </span>
            </div>
            <div style={styles.attendanceButtons}>
              <button 
                onClick={handleCheckIn}
                style={{
                  ...styles.attendanceButton,
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
                  ...styles.attendanceButton,
                  ...styles.checkOutButton,
                  opacity: attendanceStatus === "checked-out" ? 0.5 : 1,
                  cursor: attendanceStatus === "checked-out" ? "not-allowed" : "pointer"
                }}
                disabled={attendanceStatus === "checked-out"}
              >
                <FaClock /> Check Out
              </button>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div style={styles.quickActionsCard}>
            <h2 style={styles.cardTitle}>Quick Actions</h2>
            <div style={styles.quickActionsGrid}>
              <button 
                style={styles.quickActionButton}
                onClick={() => navigate("/employee/attendance")}
              >
                <FaClock style={styles.quickActionIcon} />
                <span>View Attendance</span>
                <FaArrowRight style={styles.quickActionArrow} />
              </button>
              <button 
                style={styles.quickActionButton}
                onClick={() => navigate("/employee/leave")}
              >
                <FaCalendarAlt style={styles.quickActionIcon} />
                <span>Request Leave</span>
                <FaArrowRight style={styles.quickActionArrow} />
              </button>
              <button 
                style={styles.quickActionButton}
                onClick={() => navigate("/employee/tasks")}
              >
                <FaTasks style={styles.quickActionIcon} />
                <span>My Tasks</span>
                <FaArrowRight style={styles.quickActionArrow} />
              </button>
              <button 
                style={styles.quickActionButton}
                onClick={() => navigate("/employee/profile")}
              >
                <FaUser style={styles.quickActionIcon} />
                <span>My Profile</span>
                <FaArrowRight style={styles.quickActionArrow} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div style={styles.rightColumn}>
          {/* Recent Activity Card */}
          <div style={styles.activityCard}>
            <h2 style={styles.cardTitle}>Recent Activity</h2>
            <div style={styles.activityList}>
              <div style={styles.activityItem}>
                <div style={styles.activityDot}></div>
                <div style={styles.activityContent}>
                  <p style={styles.activityText}>Checked in at 09:00 AM</p>
                  <span style={styles.activityTime}>Today</span>
                </div>
              </div>
              <div style={styles.activityItem}>
                <div style={styles.activityDot}></div>
                <div style={styles.activityContent}>
                  <p style={styles.activityText}>Submitted leave request</p>
                  <span style={styles.activityTime}>Yesterday</span>
                </div>
              </div>
              <div style={styles.activityItem}>
                <div style={styles.activityDot}></div>
                <div style={styles.activityContent}>
                  <p style={styles.activityText}>Completed task: Update profile</p>
                  <span style={styles.activityTime}>2 days ago</span>
                </div>
              </div>
            </div>
            <button style={styles.viewAllButton}>View All Activity</button>
          </div>

          {/* Pending Tasks Card */}
          <div style={styles.tasksCard}>
            <h2 style={styles.cardTitle}>Pending Tasks</h2>
            <div style={styles.tasksList}>
              <div style={styles.taskItem}>
                <input type="checkbox" style={styles.taskCheckbox} />
                <div style={styles.taskContent}>
                  <p style={styles.taskTitle}>Update employee handbook</p>
                  <span style={styles.taskDue}>Due: Mar 15, 2026</span>
                </div>
              </div>
              <div style={styles.taskItem}>
                <input type="checkbox" style={styles.taskCheckbox} />
                <div style={styles.taskContent}>
                  <p style={styles.taskTitle}>Submit monthly report</p>
                  <span style={styles.taskDue}>Due: Mar 18, 2026</span>
                </div>
              </div>
              <div style={styles.taskItem}>
                <input type="checkbox" style={styles.taskCheckbox} />
                <div style={styles.taskContent}>
                  <p style={styles.taskTitle}>Complete training module</p>
                  <span style={styles.taskDue}>Due: Mar 20, 2026</span>
                </div>
              </div>
            </div>
            <button 
              style={styles.viewAllButton}
              onClick={() => navigate("/employee/tasks")}
            >
              View All Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Leave Balance Progress */}
      <div style={styles.leaveProgressCard}>
        <div style={styles.leaveProgressHeader}>
          <h2 style={styles.cardTitle}>Leave Balance</h2>
          <span style={styles.leaveTotal}>12 days remaining</span>
        </div>
        <div style={styles.progressBarContainer}>
          <div style={styles.progressBarFill}></div>
        </div>
        <div style={styles.leaveDetails}>
          <span>Sick Leave: 8 days</span>
          <span>Vacation: 4 days</span>
          <span>Personal: 0 days</span>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;