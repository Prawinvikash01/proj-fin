import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  FaHome, 
  FaClock, 
  FaCalendarAlt, 
  FaTasks, 
  FaUser,
  FaFolderOpen,
  FaSignOutAlt,
  FaBell
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { getNotifications } from '../services/notificationService';

function EmployeeLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const loadNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (err) {
        console.error('Failed to load notifications', err);
      }
    };

    loadNotifications();
    const intervalId = setInterval(loadNotifications, 10000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleNotifications = () => {
    setNotificationOpen((open) => !open);
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  const menuItems = [
    { path: "/employee/dashboard", name: "Dashboard", icon: <FaHome /> },
    { path: "/employee/attendance", name: "My Attendance", icon: <FaClock /> },
    { path: "/employee/leave", name: "My Leave", icon: <FaCalendarAlt /> },
    { path: "/employee/tasks", name: "My Tasks", icon: <FaTasks /> },
    { path: "/employee/documents", name: "Documents", icon: <FaFolderOpen /> },
    { path: "/employee/profile", name: "My Profile", icon: <FaUser /> },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <h2 style={styles.logo}>Conexra</h2>
          <p style={styles.employeeBadge}>Employee Portal</p>
        </div>

        {/* User Info */}
        {user && (
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {user.name?.charAt(0) || "E"}
            </div>
            <div style={styles.userDetails}>
              <div style={styles.userName}>{user.name}</div>
              <div style={styles.userRole}>Employee</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.link,
                backgroundColor: location.pathname === item.path ? "#1e293b" : "transparent",
              }}
            >
              <span style={styles.iconStyle}>{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout Button */}
        <button onClick={handleLogout} style={styles.logoutButton}>
          <FaSignOutAlt style={styles.logoutIcon} />
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.mainContent}>
        {/* Top Header */}
        <div style={styles.header}>
          <div style={styles.pageTitle}>
            {menuItems.find(item => item.path === location.pathname)?.name || "Dashboard"}
          </div>
          <div style={styles.headerRight}>
            <button style={styles.notificationButton} title="View notifications" onClick={toggleNotifications}>
              <div style={styles.notificationIcon}>
                <FaBell />
                {unreadCount > 0 && <span style={styles.notificationBadge}>{unreadCount}</span>}
              </div>
              <div style={styles.notificationText}>
                <div style={styles.notificationLabel}>Notifications</div>
                <div style={styles.notificationStatus}>{unreadCount > 0 ? `${unreadCount} unread` : 'No new notifications'}</div>
              </div>
            </button>
            {notificationOpen && (
              <div style={styles.notificationDropdown}>
                {notifications.length === 0 ? (
                  <div style={styles.notificationItemEmpty}>No notifications available.</div>
                ) : (
                  notifications.slice(0, 5).map((item) => (
                    <div key={item._id || item.id} style={{ ...styles.notificationItem, opacity: item.read ? 0.65 : 1 }}>
                      <div style={styles.notificationMessage}>{item.message}</div>
                      <div style={styles.notificationMeta}>{new Date(item.createdAt || Date.now()).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Page Content */}
        <div style={styles.contentWrapper}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    height: "100vh",
    width: "100vw",
    overflow: "hidden",
    fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  },
  sidebar: {
    width: "280px",
    background: "#0f172a",
    color: "white",
    height: "100vh",
    position: "fixed",
    left: 0,
    top: 0,
    display: "flex",
    flexDirection: "column",
  },
  logoContainer: {
    padding: "24px 20px",
    borderBottom: "1px solid #1e293b",
  },
  logo: {
    margin: "0 0 4px 0",
    fontSize: "24px",
    color: "white",
    fontWeight: "600",
  },
  employeeBadge: {
    fontSize: "12px",
    color: "#94a3b8",
    margin: 0,
  },
  userInfo: {
    padding: "20px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid #1e293b",
  },
  userAvatar: {
    width: "48px",
    height: "48px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: "600",
    color: "white",
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: "16px",
    fontWeight: "600",
    color: "white",
    marginBottom: "4px",
  },
  userRole: {
    fontSize: "12px",
    color: "#94a3b8",
  },
  nav: {
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    flex: 1,
  },
  link: {
    color: "#94a3b8",
    textDecoration: "none",
    padding: "12px 16px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    transition: "all 0.2s ease",
    fontSize: "14px",
    fontWeight: "500",
  },
  iconStyle: {
    fontSize: "18px",
    display: "flex",
    alignItems: "center",
  },
  logoutButton: {
    margin: "20px",
    padding: "12px 16px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500",
    transition: "opacity 0.2s",
  },
  logoutIcon: {
    fontSize: "18px",
  },
  mainContent: {
    flex: 1,
    marginLeft: "280px",
    background: "#f1f5f9",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
  },
  header: {
    background: "white",
    padding: "20px 30px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e2e8f0",
  },
  pageTitle: {
    fontSize: "20px",
    fontWeight: "600",
    color: "#0f172a",
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    position: "relative",
  },
  notificationButton: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    border: "1px solid #e2e8f0",
    background: "#f8fafc",
    borderRadius: "999px",
    padding: "10px 16px",
    cursor: "pointer",
    color: "#0f172a",
    transition: "background 0.2s ease, transform 0.2s ease",
  },
  notificationIcon: {
    position: "relative",
    width: "34px",
    height: "34px",
    display: "grid",
    placeItems: "center",
    borderRadius: "50%",
    background: "#e2e8f0",
    color: "#2563eb",
    fontSize: "16px",
  },
  notificationBadge: {
    position: "absolute",
    top: "-6px",
    right: "-6px",
    background: "#ef4444",
    color: "white",
    fontSize: "10px",
    padding: "3px 6px",
    borderRadius: "12px",
    minWidth: "18px",
    display: "inline-flex",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationText: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    lineHeight: 1.2,
  },
  notificationLabel: {
    fontSize: "14px",
    fontWeight: 600,
    color: "#0f172a",
  },
  notificationStatus: {
    fontSize: "12px",
    color: "#475569",
  },
  notificationDropdown: {
    position: "absolute",
    top: "60px",
    right: "0",
    minWidth: "280px",
    maxWidth: "320px",
    background: "white",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15, 23, 42, 0.08)",
    borderRadius: "12px",
    padding: "14px 16px",
    color: "#334155",
    fontSize: "14px",
    zIndex: 20,
  },
  notificationItem: {
    padding: "10px 0",
    borderBottom: "1px solid #e2e8f0",
  },
  notificationItemEmpty: {
    padding: "12px 0",
    color: "#64748b",
  },
  notificationMessage: {
    fontSize: "14px",
    lineHeight: 1.4,
    marginBottom: "6px",
  },
  notificationMeta: {
    fontSize: "12px",
    color: "#64748b",
  },
  contentWrapper: {
    padding: "30px",
    overflow: "auto",
    flex: 1,
  },
};

export default EmployeeLayout;