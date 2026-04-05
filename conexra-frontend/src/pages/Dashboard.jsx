import { FaUsers, FaUserCheck, FaCalendarAlt, FaTasks } from "react-icons/fa";
import { useState, useEffect } from "react";
import { getEmployeeStats } from "../services/reportService";

function Dashboard() {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    active: 0,
    inactive: 0,
    terminated: 0,
  });

  useEffect(() => {
    getEmployeeStats()
      .then((data) => {
        setStats({
          totalEmployees: data.total || 0,
          active: data.active || 0,
          inactive: data.inactive || 0,
          terminated: data.terminated || 0,
        });
      })
      .catch((err) => {
        console.error("Failed to load dashboard stats", err);
        setStats({ totalEmployees: 0, active: 0, inactive: 0, terminated: 0 });
      });
  }, []);


  const cards = [
    { title: "Total Employees", value: stats.totalEmployees, icon: <FaUsers />, color: "#3b82f6" },
    { title: "Active Employees", value: stats.active, icon: <FaUserCheck />, color: "#10b981" },
    { title: "Inactive Employees", value: stats.inactive, icon: <FaCalendarAlt />, color: "#f59e0b" },
    { title: "Terminated Employees", value: stats.terminated, icon: <FaTasks />, color: "#ef4444" },
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
        <div style={activityGrid}>
          <div style={activityCard}>
            <h4 style={activityCardTitle}>Recent Leave Requests</h4>
            <ul style={activityList}>
              <li style={activityItem}>John Doe - Sick Leave <span style={pendingBadge}>Pending</span></li>
              <li style={activityItem}>Jane Smith - Vacation <span style={approvedBadge}>Approved</span></li>
              <li style={activityItem}>Mike Johnson - Personal <span style={pendingBadge}>Pending</span></li>
            </ul>
          </div>
          <div style={activityCard}>
            <h4 style={activityCardTitle}>Recent Check-ins</h4>
            <ul style={activityList}>
              <li style={activityItem}>Sarah Wilson - 09:00 AM</li>
              <li style={activityItem}>Tom Brown - 09:15 AM</li>
              <li style={activityItem}>Emily Davis - 09:30 AM</li>
            </ul>
          </div>
        </div>
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

export default Dashboard;