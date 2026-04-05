import { useState, useEffect } from "react";
import { FaEdit, FaSave, FaTimes, FaClock, FaHistory, FaUserCheck, FaUserTimes, FaFilter, FaChevronDown } from "react-icons/fa";
import { getAttendance } from "../services/attendanceService";

function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    checkIn: "",
    checkOut: "",
    status: ""
  });
  const [stats, setStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    onLeave: 0
  });
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // const [employees] = useState([
  //   { id: 1, name: "John Doe", department: "Engineering" },
  //   { id: 2, name: "Jane Smith", department: "Marketing" },
  //   { id: 3, name: "Mike Johnson", department: "HR" },
  //   { id: 4, name: "Sarah Wilson", department: "Sales" },
  //   { id: 5, name: "Tom Brown", department: "Engineering" },
  //   { id: 6, name: "Emily Davis", department: "Marketing" },
  // ]);

  const departments = ["all", "Engineering", "Marketing", "HR", "Sales"];

  // Load attendance data from backend
  useEffect(() => {
    setLoading(true);
    setError(null);

    getAttendance()
      .then((data) => {
        // Map backend fields to UI fields if needed
        const mapped = data.map((item) => ({
          id: item._id || item.id,
          employeeId: item.employee?._id || item.employee || item.employeeId || "",
          employeeName: item.employee?.user?.name || item.employeeName || "Unknown",
          department: item.employee?.department || item.department || "",
          date: item.date ? item.date.split('T')[0] : selectedDate,
          checkIn: item.checkIn || "--",
          checkOut: item.checkOut || "--",
          status: item.status || "present",
          late: item.late || false,
          notes: item.notes || ""
        }));

        setAttendance(mapped);
      })
      .catch((err) => setError(err?.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, [selectedDate]);

  // Apply filters
  useEffect(() => {
    let filtered = [...attendance];

    if (departmentFilter !== "all") {
      filtered = filtered.filter(a => a.department === departmentFilter);
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(a => a.status === statusFilter);
    }

    setFilteredAttendance(filtered);
    console.log("Filtered Attendance:", filtered); // Debug log
    const present = filtered.filter(a => a.status === "present").length;
    const absent = filtered.filter(a => a.status === "absent").length;
    const late = filtered.filter(a => a.late).length;
    const onLeave = filtered.filter(a => a.status === "onLeave").length;

    setStats({ present, absent, late, onLeave });
  }, [attendance, departmentFilter, statusFilter]);

  const handleEdit = (record) => {

    setEditingId(record.id);
    setEditForm({
      checkIn: record.checkIn || "",
      checkOut: record.checkOut || "",
      status: record.status
    });
  };

  const handleSave = (id) => {
    setAttendance(attendance.map(a => 
      a.id === id ? { ...a, ...editForm } : a
    ));
    setEditingId(null);     
    alert("Attendance record updated successfully!");
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleMarkBulk = (status) => {
    if (window.confirm(`Mark all filtered employees as ${status}?`)) {
      setAttendance(attendance.map(a => ({
        ...a,
        status: status
      })));
      alert(`All employees marked as ${status}`);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "present": return "#10b981";
      case "absent": return "#ef4444";
      case "late": return "#f59e0b";
      default: return "#64748b";
    }
  };
const today = new Date();
const localDate = today.toLocaleDateString('en-CA'); // YYYY-MM-DD format
  const formatTime = (time) => {
    if (!time) return "—";
    return time;
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={pageTitle}>Attendance Management</h1>/
        <div style={dateDisplay}>
          <FaClock style={{marginRight: "8px"}} />
          {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div style={statsContainer}>
        <div style={{...statCard, background: "#3b82f6"}}>
          <FaUserCheck style={statIcon} />
          <div>
            <div style={statLabel}>Present</div>
            <div style={statValue}>{stats.present}</div>
          </div>
        </div>
        <div style={{...statCard, background: "#ef4444"}}>
          <FaUserTimes style={statIcon} />
          <div>
            <div style={statLabel}>Absent</div>
            <div style={statValue}>{stats.absent}</div>
          </div>
        </div>
        <div style={{...statCard, background: "#f59e0b"}}>
          <FaClock style={statIcon} />
          <div>
            <div style={statLabel}>Late</div>
            <div style={statValue}>{stats.late}</div>
          </div>
        </div>
        <div style={{...statCard, background: "#8b5cf6"}}>
          <FaHistory style={statIcon} />
          <div>
            <div style={statLabel}>On Leave</div>
            <div style={statValue}>{stats.onLeave}</div>
          </div>
        </div>
      </div>

      {/* Controls Section */}
      <div style={controlsContainer}>
        {/* Date Picker */}
        <div style={controlGroup}>
          <label style={controlLabel}>Select Date:</label>
          <input
  type="date"
  value={selectedDate}
  onChange={(e) => setSelectedDate(e.target.value)}
  style={dateInput}
  max={localDate}
/>
        </div>

        {/* Department Filter */}
        <div style={controlGroup}>
          <label style={controlLabel}>Department:</label>
          <div style={selectWrapper}>
            <select 
              value={departmentFilter} 
              onChange={(e) => setDepartmentFilter(e.target.value)}
              style={selectInput}
            >
              {departments.map(dept => (
                <option key={dept} value={dept} style={optionStyle}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>
            <FaChevronDown style={selectIcon} />
          </div>
        </div>

        {/* Status Filter */}
        <div style={controlGroup}>
          <label style={controlLabel}>Status:</label>
          <div style={selectWrapper}>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              style={selectInput}
            >
              <option value="all" style={optionStyle}>All Status</option>
              <option value="present" style={optionStyle}>Present</option>
              <option value="absent" style={optionStyle}>Absent</option>
              <option value="late" style={optionStyle}>Late</option>
            </select>
            <FaChevronDown style={selectIcon} />
          </div>
        </div>

        {/* Bulk Actions */}
        <div style={bulkActions}>
          <button 
            onClick={() => handleMarkBulk("present")}
            style={{...bulkButton, background: "#10b981"}}
          >
            <FaUserCheck /> Mark Present
          </button>
          <button 
            onClick={() => handleMarkBulk("absent")}
            style={{...bulkButton, background: "#ef4444"}}
          >
            <FaUserTimes /> Mark Absent
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div style={tableContainer}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Employee</th>
              <th style={th}>Department</th>
              <th style={th}>Check In</th>
              <th style={th}>Check Out</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            { filteredAttendance.map(record => (
              record.employeeName!="Unknown" &&(
                <tr key={record.id}>
                  <td style={td}>{record.employeeName}</td>
                  <td style={td}>{record.department}</td>

                  {/* Check In Field - FIXED: Now clearly visible in edit mode */}
                  <td style={td}>
                  {editingId === record.id ? (
                    <div style={editFieldWrapper}>
                      <input
                        type="time"
                        value={editForm.checkIn}
                        onChange={(e) => setEditForm({...editForm, checkIn: e.target.value})}
                        style={editTimeInput}
                        placeholder="--:--"
                      />
                    </div>
                  ) : (
                    <span style={{
                      ...timeDisplay,
                      color: record.late ? "#ef4444" : "inherit"
                    }}>
                      {formatTime(record.checkIn)}
                      {record.late && <span style={lateBadge}>Late</span>}
                    </span>
                  )}
                </td>

                {/* Check Out Field - FIXED: Now clearly visible in edit mode */}
                <td style={td}>
                  {editingId === record.id ? (
                    <div style={editFieldWrapper}>
                      <input
                        type="time"
                        value={editForm.checkOut}
                        onChange={(e) => setEditForm({...editForm, checkOut: e.target.value})}
                        style={editTimeInput}
                        placeholder="--:--"
                      />
                    </div>
                  ) : (
                    <span style={timeDisplay}>
                      {formatTime(record.checkOut)}
                    </span>
                  )}
                </td>

                {/* Status Field - FIXED: Now clearly visible in edit mode */}
                <td style={td}>
                  {editingId === record.id ? (
                    <div style={editSelectWrapper}>
                      <select
                        value={editForm.status}
                        onChange={(e) => setEditForm({...editForm, status: e.target.value})}
                        style={editStatusSelect}
                      >
                        <option value="present" style={editOptionStyle}>Present</option>
                        <option value="absent" style={editOptionStyle}>Absent</option>
                        <option value="late" style={editOptionStyle}>Late</option>
                      </select>
                      <FaChevronDown style={editSelectIcon} />
                    </div>
                  ) : (
                    <span style={{
                      ...statusBadge,
                      backgroundColor: getStatusColor(record.status),
                    }}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  )}
                </td>

                {/* Actions */}
                <td style={td}>
                  {editingId === record.id ? (
                    <div style={actionGroup}>
                      <button 
                        onClick={() => handleSave(record.id)}
                        style={{...actionButton, color: "#10b981", background: "#e6f7ef", padding: "8px", borderRadius: "6px"}}
                        title="Save"
                      >
                        <FaSave />
                      </button>
                      <button 
                        onClick={handleCancel}
                        style={{...actionButton, color: "#ef4444", background: "#fee2e2", padding: "8px", borderRadius: "6px"}}
                        title="Cancel"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => handleEdit(record)}
                      style={{...actionButton, color: "#3b82f6", background: "#dbeafe", padding: "8px", borderRadius: "6px"}}
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                  )}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={summaryContainer}>
        <p>Showing {filteredAttendance.length} of {attendance.length} employees</p>
      </div>
    </div>
  );
}

// ============ STYLES ============

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
  background: "white",
  padding: "10px 20px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  color: "#0f172a",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  fontWeight: "500",
};

const statsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const statCard = {
  padding: "20px",
  borderRadius: "12px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
  color: "white",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
};

const statIcon = {
  fontSize: "30px",
};

const statLabel = {
  fontSize: "14px",
  opacity: 0.9,
};

const statValue = {
  fontSize: "24px",
  fontWeight: "bold",
};

const controlsContainer = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  marginBottom: "30px",
  display: "flex",
  flexWrap: "wrap",
  gap: "25px",
  alignItems: "flex-end",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  border: "1px solid #e2e8f0",
};

const controlGroup = {
  display: "flex",
  flexDirection: "column",
  minWidth: "220px",
};

const controlLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#0f172a",
  marginBottom: "8px",
};

const dateInput = {
  padding: "12px 15px",
  border: "2px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "14px",
  backgroundColor: "white",
  color: "#0f172a",
  outline: "none",
  cursor: "pointer",
  width: "100%",
  boxSizing: "border-box",
};

const selectWrapper = {
  position: "relative",
  width: "100%",
};

const selectInput = {
  padding: "12px 40px 12px 15px",
  border: "2px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "14px",
  backgroundColor: "white",
  color: "#0f172a",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  width: "100%",
  boxSizing: "border-box",
  fontWeight: "500",
};

const optionStyle = {
  padding: "10px",
  backgroundColor: "white",
  color: "#0f172a",
  fontSize: "14px",
};

const selectIcon = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#64748b",
  pointerEvents: "none",
  fontSize: "14px",
};

// FIXED: Wrapper for edit mode fields
const editFieldWrapper = {
  display: "inline-block",
  width: "100px",
};

// FIXED: Edit mode time input - NOW VISIBLE
const editTimeInput = {
  padding: "10px 12px",
  border: "2px solid #3b82f6",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  backgroundColor: "white",
  color: "#0f172a",
  outline: "none",
  width: "100px",
  boxSizing: "border-box",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  cursor: "pointer",
};

// Edit mode select wrapper
const editSelectWrapper = {
  position: "relative",
  width: "120px",
};

// Edit mode status select - VISIBLE
const editStatusSelect = {
  padding: "10px 35px 10px 12px",
  border: "2px solid #3b82f6",
  borderRadius: "8px",
  fontSize: "14px",
  fontWeight: "500",
  backgroundColor: "white",
  color: "#0f172a",
  outline: "none",
  cursor: "pointer",
  appearance: "none",
  WebkitAppearance: "none",
  MozAppearance: "none",
  width: "100%",
  boxSizing: "border-box",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

// Edit mode option style
const editOptionStyle = {
  padding: "12px",
  backgroundColor: "white",
  color: "#0f172a",
  fontSize: "14px",
};

// Edit mode select icon
const editSelectIcon = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#3b82f6",
  pointerEvents: "none",
  fontSize: "12px",
};

const bulkActions = {
  display: "flex",
  gap: "12px",
  marginLeft: "auto",
};

const bulkButton = {
  padding: "12px 20px",
  border: "none",
  borderRadius: "8px",
  color: "white",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  transition: "transform 0.2s",
};

const tableContainer = {
  background: "white",
  borderRadius: "12px",
  overflow: "auto",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  marginBottom: "20px",
  border: "1px solid #e2e8f0",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1000px",
};

const th = {
  textAlign: "left",
  padding: "16px",
  background: "#f1f5f9",
  borderBottom: "2px solid #cbd5e1",
  color: "#0f172a",
  fontSize: "14px",
  fontWeight: "600",
};

const td = {
  padding: "16px",
  borderBottom: "1px solid #e2e8f0",
  fontSize: "14px",
  color: "#0f172a",
};

const timeDisplay = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontWeight: "500",
};

const lateBadge = {
  background: "#fee2e2",
  color: "#ef4444",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "11px",
  fontWeight: "600",
  marginLeft: "8px",
};

const statusBadge = {
  padding: "6px 12px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  display: "inline-block",
  color: "white",
  textAlign: "center",
  minWidth: "70px",
};

const actionGroup = {
  display: "flex",
  gap: "10px",
};

const actionButton = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: "16px",
  padding: "8px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "all 0.2s",
};

const summaryContainer = {
  textAlign: "right",
  color: "#64748b",
  fontSize: "14px",
  padding: "10px 0",
};

export default Attendance;