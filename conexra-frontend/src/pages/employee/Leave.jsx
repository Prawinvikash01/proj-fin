import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaPlus,
  FaTimes,
  FaCheckCircle,
  FaClock,
  FaInfoCircle,
  FaUser,
  FaChevronDown,
} from "react-icons/fa";
import { getLeaves, applyLeave, getLeaveBalance } from "../../services/leaveService";

// Add global styles for animations
const globalStyles = `
  @keyframes modalSlideIn {
    from {
      opacity: 0;
      transform: translateY(-20px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .balance-item:hover {
    transform: translateY(-2px);
  }
  
  .request-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
  }
  
  .add-button:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  .submit-button:hover {
    transform: translateY(-1px);
  }
  
  .cancel-button:hover {
    background-color: #e5e7eb;
  }
  
  .close-button:hover {
    background-color: #f3f4f6;
    color: #374151;
  }
  
  input:focus, select:focus, textarea:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }
`;

function MyLeave() {
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [leaveBalance, setLeaveBalance] = useState({
    sick: 0,
    vacation: 0,
    personal: 0,
    used: 0,
    pending: 0,
  });
  const [newRequest, setNewRequest] = useState({
    leaveType: "sick",
    startDate: "",
    endDate: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([getLeaves(), getLeaveBalance()])
      .then(([leavesData, balanceData]) => {
        const mapped = leavesData.map((item) => ({
          id: item._id || item.id,
          leaveType: item.type || item.leaveType || "Unknown",
          startDate: item.startDate?.split("T")[0] || "",
          endDate: item.endDate?.split("T")[0] || "",
          days: item.days || 0,
          reason: item.reason || "",
          status: item.status || "pending",
          appliedOn: item.createdAt ? item.createdAt.split("T")[0] : item.appliedOn || "",
          comments: item.comments || "",
        }));

        setLeaveRequests(mapped);
        setFilteredRequests(mapped);
        setLeaveBalance({
          sick: balanceData.sick || 0,
          vacation: balanceData.vacation || 0,
          personal: balanceData.personal || 0,
          used: balanceData.used || 0,
          pending: balanceData.pending || 0,
        });
      })
      .catch((err) => setError(err?.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredRequests(leaveRequests);
    } else {
      setFilteredRequests(leaveRequests.filter((req) => req.status === statusFilter));
    }
  }, [statusFilter, leaveRequests]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRequest((prev) => ({ ...prev, [name]: value }));
  };

  const calculateDays = () => {
    if (!newRequest.startDate || !newRequest.endDate) return 0;
    const start = new Date(newRequest.startDate);
    const end = new Date(newRequest.endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmitRequest = (e) => {
    e.preventDefault();

    if (!newRequest.startDate || !newRequest.endDate || !newRequest.reason) {
      alert("Please fill all fields");
      return;
    }

    const days = calculateDays();
    const totalAvailable = leaveBalance.sick + leaveBalance.vacation + leaveBalance.personal - leaveBalance.used;

    if (days > totalAvailable) {
      alert(`Insufficient leave balance! You have only ${totalAvailable} days remaining.`);
      return;
    }

    applyLeave({
      type: newRequest.leaveType,
      startDate: newRequest.startDate,
      endDate: newRequest.endDate,
      reason: newRequest.reason,
    })
      .then((res) => {
        const newReq = {
          id: res.leave._id || res.leave.id || leaveRequests.length + 1,
          leaveType: res.leave.type,
          startDate: res.leave.startDate?.split("T")[0] || newRequest.startDate,
          endDate: res.leave.endDate?.split("T")[0] || newRequest.endDate,
          days,
          reason: res.leave.reason,
          status: res.leave.status || "pending",
          appliedOn: new Date().toISOString().split("T")[0],
          comments: "",
        };

        setLeaveRequests((prev) => [newReq, ...prev]);
        
        // Refresh leave balance
        getLeaveBalance()
          .then((balanceData) => {
            setLeaveBalance({
              sick: balanceData.sick || 0,
              vacation: balanceData.vacation || 0,
              personal: balanceData.personal || 0,
              used: balanceData.used || 0,
              pending: balanceData.pending || 0,
            });
          })
          .catch((err) => console.error("Failed to refresh balance:", err));

        setNewRequest({ leaveType: "sick", startDate: "", endDate: "", reason: "" });
        setShowForm(false);
        alert("Leave request submitted successfully!");
      })
      .catch((err) => setError(err?.response?.data?.error || err.message));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return { background: "#fef3c7", color: "#92400e", text: "Pending", icon: <FaClock /> };
      case "approved":
        return { background: "#d1fae5", color: "#065f46", text: "Approved", icon: <FaCheckCircle /> };
      case "rejected":
        return { background: "#fee2e2", color: "#991b1b", text: "Rejected", icon: <FaTimes /> };
      default:
        return { background: "#e2e8f0", color: "#475569", text: status, icon: <FaInfoCircle /> };
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

  const remainingBalance = leaveBalance.sick + leaveBalance.vacation + leaveBalance.personal - leaveBalance.used;

  return (
    <div style={styles.pageContainer}>
      <style>{globalStyles}</style>
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>My Leave</h1>
        <button onClick={() => setShowForm(true)} style={styles.addButton}>
          <FaPlus /> Request Leave
        </button>
      </div>

      {error && <div style={{ marginBottom: "16px", color: "#ef4444", fontWeight: "600" }}>{error}</div>}
      {loading && <div style={{ marginBottom: "16px" }}>Loading leave requests...</div>}

      <div style={styles.balanceCard}>
        <h2 style={styles.balanceTitle}>Leave Balance</h2>
        <div style={styles.balanceGrid}>
          <div style={styles.balanceItem} className="balance-item">
            <span style={styles.balanceLabel}>Sick Leave</span>
            <span style={styles.balanceValue}>{leaveBalance.sick} days</span>
          </div>
          <div style={styles.balanceItem} className="balance-item">
            <span style={styles.balanceLabel}>Vacation</span>
            <span style={styles.balanceValue}>{leaveBalance.vacation} days</span>
          </div>
          <div style={styles.balanceItem} className="balance-item">
            <span style={styles.balanceLabel}>Personal</span>
            <span style={styles.balanceValue}>{leaveBalance.personal} days</span>
          </div>
          <div style={styles.balanceItem} className="balance-item">
            <span style={styles.balanceLabel}>Used</span>
            <span style={{ ...styles.balanceValue, color: "#ef4444" }}>{leaveBalance.used} days</span>
          </div>
          <div style={styles.balanceItem} className="balance-item">
            <span style={styles.balanceLabel}>Pending</span>
            <span style={{ ...styles.balanceValue, color: "#f59e0b" }}>{leaveBalance.pending} days</span>
          </div>
          <div style={styles.balanceTotal}>
            <span style={styles.balanceLabel}>Remaining</span>
            <span style={{ ...styles.balanceValue, color: "#10b981", fontSize: "20px" }}>{remainingBalance} days</span>
          </div>
        </div>
        <div style={styles.progressBarContainer}>
          <div
            style={{
              ...styles.progressBarFill,
              width: `${((leaveBalance.used + leaveBalance.pending) / (leaveBalance.sick + leaveBalance.vacation + leaveBalance.personal)) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {showForm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>New Leave Request</h3>
              <button onClick={() => setShowForm(false)} style={styles.closeButton}>
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Leave Type</label>
                <div style={styles.selectWrapper}>
                  <select name="leaveType" value={newRequest.leaveType} onChange={handleInputChange} style={styles.formSelect}>
                    <option value="sick">Sick Leave</option>
                    <option value="vacation">Vacation</option>
                    <option value="personal">Personal Leave</option>
                  </select>
                  <FaChevronDown style={styles.selectIcon} />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Start Date</label>
                <input type="date" name="startDate" value={newRequest.startDate} onChange={handleInputChange} style={styles.formInput} />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>End Date</label>
                <input type="date" name="endDate" value={newRequest.endDate} onChange={handleInputChange} style={styles.formInput} />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.formLabel}>Reason</label>
                <textarea name="reason" value={newRequest.reason} onChange={handleInputChange} style={styles.formTextarea} />
              </div>

              <div style={styles.formActions}>
                <button type="submit" style={styles.submitButton}>
                  Apply
                </button>
                <button type="button" onClick={() => setShowForm(false)} style={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div style={styles.filterSortBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Filter</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={styles.filterSelect}>
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div style={styles.requestList}>
        {filteredRequests.map((req) => {
          const badge = getStatusBadge(req.status);
          return (
            <div key={req.id} style={styles.requestCard}>
              <div style={styles.requestItem}>
                <div>{getLeaveTypeIcon(req.leaveType)} {req.leaveType}</div>
                <div style={styles.requestStatus}>
                  <span style={{ background: badge.background, color: badge.color, ...styles.statusBadge }}>{badge.icon} {badge.text}</span>
                </div>
              </div>
              <p style={styles.requestText}>
  {new Date(req.startDate).toLocaleDateString()} →{" "}
  {new Date(req.endDate).toLocaleDateString()} ·{" "}
  {req.days || (
    Math.ceil(
      (new Date(req.endDate) - new Date(req.startDate)) /
      (1000 * 60 * 60 * 24)
    ) + 1
  )}{" "}
  days
</p>
              <p style={styles.requestText}>Reason: {req.reason}</p>
              <p style={styles.requestText}>Applied on: {req.appliedOn}</p>
              {req.comments && <p style={styles.requestText}>Comments: {req.comments}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    backgroundColor: "#f8fafc",
    minHeight: "100vh",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    padding: "20px",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    borderRadius: "16px",
    color: "white",
    boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)",
  },
  pageTitle: {
    fontSize: "32px",
    fontWeight: "700",
    margin: 0,
    textShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  addButton: {
    background: "rgba(255,255,255,0.2)",
    color: "white",
    border: "2px solid rgba(255,255,255,0.3)",
    padding: "12px 24px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "600",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
  },
  balanceCard: {
    background: "white",
    borderRadius: "20px",
    padding: "30px",
    marginBottom: "30px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
    border: "1px solid #e2e8f0",
  },
  balanceTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: "25px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  balanceGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "20px",
    marginBottom: "25px",
  },
  balanceItem: {
    background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    border: "1px solid #cbd5e1",
    transition: "transform 0.2s ease",
  },
  balanceTotal: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    padding: "20px",
    borderRadius: "12px",
    textAlign: "center",
    gridColumn: "span 2",
    border: "none",
  },
  balanceLabel: {
    display: "block",
    fontSize: "14px",
    color: "#64748b",
    marginBottom: "8px",
    fontWeight: "500",
  },
  balanceValue: {
    display: "block",
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
  },
  progressBarContainer: {
    width: "100%",
    height: "8px",
    background: "#e2e8f0",
    borderRadius: "4px",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    background: "linear-gradient(90deg, #f59e0b 0%, #ef4444 100%)",
    borderRadius: "4px",
    transition: "width 0.3s ease",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(5px)",
  },
  modalContent: {
    background: "white",
    borderRadius: "20px",
    padding: "0",
    width: "90%",
    maxWidth: "500px",
    maxHeight: "90vh",
    overflow: "auto",
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
    animation: "modalSlideIn 0.3s ease-out",
  },
  modalHeader: {
    padding: "25px 30px",
    borderBottom: "1px solid #e2e8f0",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#1e293b",
    margin: 0,
  },
  closeButton: {
    background: "none",
    border: "none",
    fontSize: "20px",
    color: "#64748b",
    cursor: "pointer",
    padding: "5px",
    borderRadius: "50%",
    transition: "all 0.2s ease",
  },
  form: {
    padding: "30px",
  },
  formGroup: {
    marginBottom: "20px",
  },
  formLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    marginBottom: "8px",
  },
  formInput: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  },
  formTextarea: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "16px",
    minHeight: "80px",
    resize: "vertical",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  },
  selectWrapper: {
    position: "relative",
  },
  formSelect: {
    width: "100%",
    padding: "12px 16px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "16px",
    background: "white",
    cursor: "pointer",
    appearance: "none",
    transition: "border-color 0.2s ease",
    boxSizing: "border-box",
  },
  selectIcon: {
    position: "absolute",
    right: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#64748b",
    pointerEvents: "none",
  },
  formActions: {
    display: "flex",
    gap: "12px",
    justifyContent: "flex-end",
    marginTop: "30px",
  },
  submitButton: {
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "transform 0.2s ease",
  },
  cancelButton: {
    background: "#f3f4f6",
    color: "#374151",
    border: "1px solid #d1d5db",
    padding: "12px 24px",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  filterSortBar: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  filterLabel: {
    fontSize: "16px",
    fontWeight: "600",
    color: "#374151",
  },
  filterSelect: {
    padding: "8px 12px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    fontSize: "14px",
    background: "white",
    cursor: "pointer",
  },
  requestList: {
    display: "grid",
    gap: "16px",
  },
  requestCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    border: "1px solid #e2e8f0",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  requestItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px",
  },
  requestStatus: {
    display: "flex",
    alignItems: "center",
  },
  statusBadge: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  requestText: {
    margin: "4px 0",
    color: "#64748b",
    fontSize: "14px",
  },
  "@keyframes modalSlideIn": {
    from: {
      opacity: 0,
      transform: "translateY(-20px) scale(0.95)",
    },
    to: {
      opacity: 1,
      transform: "translateY(0) scale(1)",
    },
  },
};

export default MyLeave;
