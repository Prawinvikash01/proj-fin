import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFilter,
  FaUser,
  FaInfoCircle,
  FaChevronDown,
  FaSearch,
} from "react-icons/fa";
import { getLeaves, updateLeaveStatus } from "../services/leaveService";

function Leave() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    getLeaves()
      .then((data) => {
        setLeaveRequests(data);
      })
      .catch((err) => {
        setError(err?.response?.data?.error || err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let filtered = [...leaveRequests];

    if (statusFilter !== "all") filtered = filtered.filter((req) => req.status === statusFilter);
    if (searchTerm) {
      filtered = filtered.filter((req) =>

        (req.employee?.user?.employeeName || req.employeeName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.employee?.department || req.department || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (req.reason || "").toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredRequests(filtered);

    const pending = leaveRequests.filter((r) => r.status === "pending").length;
    const approved = leaveRequests.filter((r) => r.status === "approved").length;
    const rejected = leaveRequests.filter((r) => r.status === "rejected").length;

    setStats({ pending, approved, rejected, total: leaveRequests.length });
  }, [leaveRequests, statusFilter, searchTerm]);

  const handleStatusChange = (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this request?`)) return;

    updateLeaveStatus(id, newStatus)
      .then(() => {
        setLeaveRequests((prev) => prev.map((req) => ((req._id || req.id) === id ? { ...req, status: newStatus } : req)));
      })
      .catch((err) => setError(err?.response?.data?.error || err.message));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return { background: "#fef3c7", color: "#92400e", text: "Pending" };
      case "approved":
        return { background: "#d1fae5", color: "#065f46", text: "Approved" };
      case "rejected":
        return { background: "#fee2e2", color: "#991b1b", text: "Rejected" };
      default:
        return { background: "#e2e8f0", color: "#475569", text: status };
    }
  };

  const getLeaveTypeIcon = (type) => {
    switch (type) {
      case "sick":
        return "🤒";
      case "vacation":
        return "🏖️";
      case "personal":
        return "📋";
      default:
        return "📅";
    }
  };

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <h1 style={pageTitle}>Leave Management</h1>
        <div style={dateDisplay}>
          <FaCalendarAlt style={{ marginRight: "8px" }} />
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>

      {error && <div style={{ marginBottom: "16px", color: "#ef4444", fontWeight: "600" }}>{error}</div>}
      {loading && <div style={{ marginBottom: "16px" }}>Loading leave requests...</div>}

      <div style={statsContainer}>
        <div style={{ ...statCard, borderLeft: "5px solid #f59e0b" }}>
          <div style={statIconWrapper}>
            <FaClock style={{ ...statIcon, color: "#f59e0b" }} />
          </div>
          <div style={statInfo}>
            <div style={statLabel}>Pending</div>
            <div style={statValue}>{stats.pending}</div>
          </div>
        </div>
        <div style={{ ...statCard, borderLeft: "5px solid #10b981" }}>
          <div style={statIconWrapper}>
            <FaCheckCircle style={{ ...statIcon, color: "#10b981" }} />
          </div>
          <div style={statInfo}>
            <div style={statLabel}>Approved</div>
            <div style={statValue}>{stats.approved}</div>
          </div>
        </div>
        <div style={{ ...statCard, borderLeft: "5px solid #ef4444" }}>
          <div style={statIconWrapper}>
            <FaTimesCircle style={{ ...statIcon, color: "#ef4444" }} />
          </div>
          <div style={statInfo}>
            <div style={statLabel}>Rejected</div>
            <div style={statValue}>{stats.rejected}</div>
          </div>
        </div>
        <div style={{ ...statCard, borderLeft: "5px solid #3b82f6" }}>
          <div style={statIconWrapper}>
            <FaCalendarAlt style={{ ...statIcon, color: "#3b82f6" }} />
          </div>
          <div style={statInfo}>
            <div style={statLabel}>Total</div>
            <div style={statValue}>{stats.total}</div>
          </div>
        </div>
      </div>

      <div style={filterRow}>
        <div style={filterGroup}>
          <FaFilter style={{ marginRight: "8px" }} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={filterSelect}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div style={filterGroup}>
          <FaSearch style={{ marginRight: "8px" }} />
          <input
            type="text"
            placeholder="Search by employee, department, reason"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInput}
          />
        </div>
      </div>

      <div style={tableContainer}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Employee</th>
              <th style={th}>Department</th>
              <th style={th}>Type</th>
              <th style={th}>Date</th>
              <th style={th}>Days</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => {
              const employeeName = req.employee?.name || req.employeeName || "Unknown";
              const department = req.employee?.department || req.department || "-";
              const status = req.status || "pending";
              const badge = getStatusBadge(status);
              return (
                <tr key={req._id || req.id}>
                  <td style={td}>{employeeName}</td>
                  <td style={td}>{department}</td>
                  <td style={td}>{getLeaveTypeIcon(req.leaveType)}</td>
                  <td style={td}>{req.startDate} ➜ {req.endDate}</td>
                  <td style={td}>{req.days}</td>
                  <td style={td}>
                    <span style={{ background: badge.background, color: badge.color, ...statusBadge }}>{badge.text}</span>
                  </td>
                  <td style={td}>
                    {status === "pending" && (
                      <>
                        <button onClick={() => handleStatusChange(req._id || req.id, "approved")} style={actionButton}>Approve</button>
                        <button onClick={() => handleStatusChange(req._id || req.id, "rejected")} style={actionButton}>Reject</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const pageContainer = {
  width: "100%",
  maxWidth: "1400px",
  margin: "0 auto",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "30px",
};

const pageTitle = {
  fontSize: "28px",
  color: "#0f172a",
  margin: 0,
};

const dateDisplay = {
  color: "#64748b",
  fontSize: "14px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const statsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const statCard = {
  padding: "20px",
  background: "white",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const statIconWrapper = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  background: "#f3f4f6",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const statIcon = {
  fontSize: "22px",
};

const statInfo = {
  display: "flex",
  flexDirection: "column",
};

const statLabel = {
  fontSize: "12px",
  color: "#64748b",
};

const statValue = {
  fontSize: "24px",
  fontWeight: "700",
  color: "#0f172a",
};

const filterRow = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "16px",
  marginBottom: "18px",
};

const filterGroup = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const filterSelect = {
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
};

const searchInput = {
  padding: "8px 10px",
  borderRadius: "8px",
  border: "1px solid #e2e8f0",
  minWidth: "240px",
};

const tableContainer = {
  background: "white",
  borderRadius: "12px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  overflowX: "auto",
  padding: "16px",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
};

const th = {
  textAlign: "left",
  padding: "10px",
  borderBottom: "2px solid #e5e7eb",
  fontSize: "14px",
  color: "#475569",
};

const td = {
  padding: "10px",
  borderBottom: "1px solid #e5e7eb",
  color: "#334155",
};

const statusBadge = {
  padding: "4px 8px",
  borderRadius: "999px",
  fontWeight: "600",
  fontSize: "12px",
};

const actionButton = {
  marginRight: "8px",
  padding: "6px 10px",
  borderRadius: "8px",
  border: "none",
  background: "#3b82f6",
  color: "white",
  cursor: "pointer",
};

export default Leave;
