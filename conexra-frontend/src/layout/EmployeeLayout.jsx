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

function EmployeeLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

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
            <div style={styles.notificationIcon}>
              <FaBell />
              <span style={styles.notificationBadge}>2</span>
            </div>
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
  },
  notificationIcon: {
    position: "relative",
    cursor: "pointer",
    fontSize: "20px",
    color: "#64748b",
  },
  notificationBadge: {
    position: "absolute",
    top: "-5px",
    right: "-5px",
    background: "#ef4444",
    color: "white",
    fontSize: "10px",
    padding: "2px 5px",
    borderRadius: "10px",
    minWidth: "16px",
    textAlign: "center",
  },
  contentWrapper: {
    padding: "30px",
    overflow: "auto",
    flex: 1,
  },
};

export default EmployeeLayout;