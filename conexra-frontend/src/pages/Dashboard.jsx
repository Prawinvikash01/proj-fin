import { FaUsers, FaUserCheck, FaCalendarAlt, FaTasks } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getDashboardOverview } from "../services/reportService";

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    active: 0,
    inactive: 0,
    terminated: 0,
    pendingLeaves: 0,
  });
  const [recentLeaves, setRecentLeaves] = useState([]);
  const [recentCheckIns, setRecentCheckIns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardOverview()
      .then((data) => {
        setStats({
          totalEmployees: data.stats.total || 0,
          active: data.stats.active || 0,
          inactive: data.stats.inactive || 0,
          terminated: data.stats.terminated || 0,
          pendingLeaves: data.stats.pendingLeaves || 0,
        });
        setRecentLeaves(data.recentLeaves || []);
        setRecentCheckIns(data.recentCheckIns || []);
      })
      .catch((err) => {
        console.error("Failed to load dashboard stats", err);
        setStats({ totalEmployees: 0, active: 0, inactive: 0, terminated: 0, pendingLeaves: 0 });
        setRecentLeaves([]);
        setRecentCheckIns([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { title: "Total Employees", value: stats.totalEmployees, icon: <FaUsers />, color: "#3b82f6" },
    { title: "Active Employees", value: stats.active, icon: <FaUserCheck />, color: "#10b981" },
    { title: "Inactive Employees", value: stats.inactive, icon: <FaCalendarAlt />, color: "#f59e0b" },
    { title: "Terminated Employees", value: stats.terminated, icon: <FaTasks />, color: "#ef4444" },
    { title: "Pending Leaves", value: stats.pendingLeaves, icon: <FaCalendarAlt />, color: "#f97316" },
  ];

  return (
    <div style={pageContainer}>
      <h1 style={pageTitle}>Dashboard Overview</h1>

      {/* Stats Cards */}
      <div style={cardContainer}>
        {cards.map((card, index) => (
          <div key={index} style={{...cardStyle, borderTop: `4px solid ${card.color}`}}>
            <div style={cardHeader}>
              <span style={{...iconStyle, color: card.color}}>{card.icon}</span>
              <h3 style={cardTitle}>{card.title}</h3>
            </div>
            <p style={cardNumber}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div style={recentSection}>
        <h2 style={sectionTitle}>Recent Activity</h2>
        {loading ? (
          <p>Loading recent activity...</p>
        ) : (
          <div style={activityGrid}>
            <div style={activityCard}>
              <h4 style={activityCardTitle}>Recent Leave Requests</h4>
              <ul style={activityList}>
                {recentLeaves.length > 0 ? (
                  recentLeaves.map((leave) => (
                    <li key={leave.id} style={activityItem}>
                      <span>{leave.employeeName} - {leave.type}</span>
                      <span style={leave.status === 'approved' ? approvedBadge : leave.status === 'rejected' ? rejectedBadge : pendingBadge}>
                        {leave.status}
                      </span>
                    </li>
                  ))
                ) : (
                  <li style={activityItem}>No recent leave activity</li>
                )}
              </ul>
            </div>
            <div style={activityCard}>
              <h4 style={activityCardTitle}>Recent Check-ins</h4>
              <ul style={activityList}>
                {recentCheckIns.length > 0 ? (
                  recentCheckIns.map((record) => (
                    <li key={record.id} style={activityItem}>
                      <span>{record.employeeName}</span>
                      <span>{new Date(record.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </li>
                  ))
                ) : (
                  <li style={activityItem}>No recent check-ins</li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Styles
const pageContainer = {
  width: "100%",
  color:"black",
  maxWidth: "1400px",
  margin: "0 auto",
};

const pageTitle = {
  fontSize: "28px",
  marginBottom: "30px",
  color: "#0f172a",
};

const cardContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px",
  marginBottom: "40px",
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const cardHeader = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  marginBottom: "15px",
};

const iconStyle = {
  fontSize: "24px",
};

const cardTitle = {
  fontSize: "14px",
  color: "#64748b",
  margin: 0,
  fontWeight: "500",
};

const cardNumber = {
  fontSize: "32px",
  fontWeight: "bold",
  margin: "10px 0 0 0",
  color: "#0f172a",
};

const recentSection = {
  marginTop: "40px",
};

const sectionTitle = {
  fontSize: "20px",
  marginBottom: "20px",
  color: "#0f172a",
};

const activityGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
  gap: "20px",
};

const activityCard = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const activityCardTitle = {
  margin: "0 0 15px 0",
  fontSize: "16px",
  color: "#0f172a",
};

const activityList = {
  listStyle: "none",
  padding: 0,
  margin: 0,
};

const activityItem = {
  padding: "10px 0",
  borderBottom: "1px solid #e2e8f0",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const pendingBadge = {
  background: "#fef3c7",
  color: "#92400e",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "12px",
};

const approvedBadge = {
  background: "#d1fae5",
  color: "#065f46",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "12px",
};

const rejectedBadge = {
  background: "#fee2e2",
  color: "#991b1b",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "12px",
};

export default Dashboard;