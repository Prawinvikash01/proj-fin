import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import { getEmployees, createEmployee, updateEmployee, deleteEmployee } from "../services/employeeService";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [editEmployee, setEditEmployee] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: "",
    role: "",
    status: "Active",
    position: "",
    phone: "",
    address: "",
    password: ""
  });

  useEffect(() => {
    setLoading(true);
    getEmployees()
      .then((data) => {
        const normalized = data.map((emp) => ({
          ...emp,
          id: emp._id || emp.id,
          name: emp.user?.name || emp.name || "",
          email: emp.user?.email || emp.email || "",
          department: emp.department || emp.user?.department || "",
          role: emp.user?.role || emp.role || "",
          status: emp.status || emp.user?.status || "active",
          position: emp.position || emp.user?.position || "",
          phone: emp.phone || emp.user?.phone || "",
          address: emp.address || emp.user?.address || "",
        }));
        setEmployees(normalized);
      })
      .catch((err) => setError(err?.response?.data?.error || err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email || !newEmployee.role) {
      setError("Name, email and role are required");
      return;
    }


    const payload = {
      name: newEmployee.name,
      email: newEmployee.email,
      password: newEmployee.password || "password123",
      role: newEmployee.role,
      position: newEmployee.position || newEmployee.role,
      department: newEmployee.department,
      phone: newEmployee.phone || "",
      address: newEmployee.address || "",
    };
    console.log("Creating employee with payload:", payload);

    createEmployee(payload)
      .then((res) => {
        const newEmp = {
          id: res.employee._id || res.employee.id,
          name: res.employee.user?.name || res.employee.name || payload.name,
          email: res.employee.user?.email || res.employee.email || payload.email,
          department: payload.department,
          role: payload.role,
          status: res.employee.user?.status || "active",
          position: payload.position,
          phone: payload.phone,
          address: payload.address,
        };
        setEmployees((prev) => [...prev, newEmp]);
        setNewEmployee({ name: "", email: "", department: "", role: "", status: "Active", position: "", phone: "", address: "", password: "" });
        setShowForm(false);
      })
      .catch((err) => setError(err?.response?.data?.error || err.message));
  };

  const handleEditClick = (emp) => {
    setEditEmployee({ ...emp });
    setShowForm(true);
  };

  const handleUpdateEmployee = () => {
    if (!editEmployee?.id) return;
    updateEmployee(editEmployee.id, {
      position: editEmployee.position,
      department: editEmployee.department,
      phone: editEmployee.phone,
      address: editEmployee.address,
      status: editEmployee.status,
    })
      .then((res) => {
        setEmployees((prev) => prev.map((e) => (e.id === editEmployee.id ? { ...e, ...editEmployee } : e)));
        setEditEmployee(null);
        setShowForm(false);
      })
      .catch((err) => setError(err?.response?.data?.error || err.message));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;

    deleteEmployee(id)
      .then(() => setEmployees((prev) => prev.filter((emp) => emp.id !== id)))
      .catch((err) => setError(err?.response?.data?.error || err.message));
  };

  const handleViewDetails = (emp) => {
    setSelectedEmployee(emp);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setSelectedEmployee(null);
    setShowDetails(false);
  };

  const filteredEmployees = employees.filter((emp) => {
    const employeeName = (emp.user?.name || emp.name || "").toString().toLowerCase();
    const employeeEmail = (emp.user?.email || emp.email || "").toString().toLowerCase();
    const employeeDept = (emp.department || emp.user?.department || "").toString().toLowerCase();
    const term = searchTerm.toLowerCase();

    return (
      employeeName.includes(term) ||
      employeeEmail.includes(term) ||
      employeeDept.includes(term)
    );
  });

  return (
    <div style={pageContainer}>
      <div style={headerStyle}>
        <h1 style={pageTitle}>Employee Management</h1>
        <button onClick={() => setShowForm(true)} style={addButton}>
          <FaPlus /> Add Employee
        </button>
      </div>

      {/* Search Bar */}
      <div style={searchContainer}>
        <FaSearch style={searchIcon} />
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInput}
        />
      </div>

      {error && (
        <div style={{ marginBottom: "16px", color: "#ef4444", fontWeight: "600" }}>
          {error}
        </div>
      )}

      {/* Add/Edit Employee Form */}
      {showForm && (
        <div style={formContainer}>
          <h3 style={formTitle}>{editEmployee ? "Edit Employee" : "Add New Employee"}</h3>
          <div style={formGrid}>
            <input
              type="text"
              placeholder="Name"
              value={editEmployee?.name || newEmployee.name}
              onChange={(e) => {
                if (editEmployee) setEditEmployee((prev) => ({ ...prev, name: e.target.value }));
                else setNewEmployee((prev) => ({ ...prev, name: e.target.value }));
              }}
              style={inputStyle}
            />
            <input
              type="email"
              placeholder="Email"
              value={editEmployee?.email || newEmployee.email}
              onChange={(e) => {
                if (editEmployee) setEditEmployee((prev) => ({ ...prev, email: e.target.value }));
                else setNewEmployee((prev) => ({ ...prev, email: e.target.value }));
              }}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Department"
              value={editEmployee?.department || newEmployee.department}
              onChange={(e) => {
                if (editEmployee) setEditEmployee((prev) => ({ ...prev, department: e.target.value }));
                else setNewEmployee((prev) => ({ ...prev, department: e.target.value }));
              }}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Role"
              value={editEmployee?.role || newEmployee.role}
              onChange={(e) => {
                if (editEmployee) setEditEmployee((prev) => ({ ...prev, role: e.target.value }));
                else setNewEmployee((prev) => ({ ...prev, role: e.target.value }));
              }}
              style={inputStyle}
              disabled={Boolean(editEmployee)}
            />
            <input
              type="text"
              placeholder="Position"
              value={editEmployee?.position || newEmployee.position || ""}
              onChange={(e) => {
                if (editEmployee) setEditEmployee((prev) => ({ ...prev, position: e.target.value }));
                else setNewEmployee((prev) => ({ ...prev, position: e.target.value }));
              }}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Phone"
              value={editEmployee?.phone || newEmployee.phone || ""}
              onChange={(e) => {
                if (editEmployee) setEditEmployee((prev) => ({ ...prev, phone: e.target.value }));
                else setNewEmployee((prev) => ({ ...prev, phone: e.target.value }));
              }}
              style={inputStyle}
            />
            <input
              type="text"
              placeholder="Address"
              value={editEmployee?.address || newEmployee.address || ""}
              onChange={(e) => {
                if (editEmployee) setEditEmployee((prev) => ({ ...prev, address: e.target.value }));
                else setNewEmployee((prev) => ({ ...prev, address: e.target.value }));
              }}
              style={inputStyle}
            />
            {!editEmployee && (
              <input
                type="password"
                placeholder="Password (default password123)"
                value={newEmployee.password || ""}
                onChange={(e) => setNewEmployee((prev) => ({ ...prev, password: e.target.value }))}
                style={inputStyle}
              />
            )}
            <select
              value={editEmployee?.status || newEmployee.status}
              onChange={(e) => {
                if (editEmployee) setEditEmployee((prev) => ({ ...prev, status: e.target.value }));
                else setNewEmployee((prev) => ({ ...prev, status: e.target.value }));
              }}
              style={inputStyle}
            >
              <option value="active">Active</option>
              <option value="on leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div style={formButtons}>
            <button onClick={editEmployee ? handleUpdateEmployee : handleAddEmployee} style={saveButton}>
              {editEmployee ? "Update" : "Save"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setEditEmployee(null);
                setNewEmployee({ name: "", email: "", department: "", role: "", status: "Active", position: "", phone: "", address: "", password: "" });
              }}
              style={cancelButton}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Employees Table */}
      <div style={tableContainer}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Name</th>
              <th style={th}>Email</th>
              <th style={th}>Department</th>
              <th style={th}>Role</th>
              <th style={th}>Status</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => {
              const id = emp._id || emp.id;
              const name = emp.user?.name || emp.name || "-";
              const email = emp.user?.email || emp.email || "-";
              const department = emp.department || emp.user?.department || "-";
              const role = emp.user?.role || emp.role || "-";
              const status = emp.status || emp.user?.status || "Active";

              return (
                <tr key={id}>
                  <td style={td}>{name}</td>
                  <td style={td}>{email}</td>
                  <td style={td}>{department}</td>
                  <td style={td}>{role}</td>
                  <td style={td}>
                    <span
                      style={{
                        ...statusBadge,
                        backgroundColor: status.toLowerCase() === "active" ? "#10b981" : status.toLowerCase() === "inactive" ? "#fb923c" : "#ef4444",
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        display: "inline-block",
                      }}
                    >
                      {status}
                    </span>
                  </td>
                  <td style={td}>
                    <button onClick={() => handleViewDetails(emp)} style={actionButton}>
                      Details
                    </button>
                    <button onClick={() => handleEditClick(emp)} style={actionButton}>
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(id)} style={actionButton}>
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showDetails && selectedEmployee && (
        <div style={detailsPanel}>
          <h3>Employee Details</h3>
          <p><strong>Name:</strong> {selectedEmployee.name || selectedEmployee.user?.name || '-'}</p>
          <p><strong>Email:</strong> {selectedEmployee.email || selectedEmployee.user?.email || '-'}</p>
          <p><strong>Role:</strong> {selectedEmployee.role || selectedEmployee.user?.role || '-'}</p>
          <p><strong>Department:</strong> {selectedEmployee.department || selectedEmployee.user?.department || '-'}</p>
          <p><strong>Position:</strong> {selectedEmployee.position || '-'}</p>
          <p><strong>Phone:</strong> {selectedEmployee.phone || '-'}</p>
          <p><strong>Address:</strong> {selectedEmployee.address || '-'}</p>
          <p><strong>Status:</strong> {selectedEmployee.status || selectedEmployee.user?.status || '-'}</p>
          <button onClick={handleCloseDetails} style={cancelButton}>Close Details</button>
        </div>
      )}

    </div>
  );
}

// Styles
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
  width: "100%",
};

const pageTitle = {
  fontSize: "28px",
  color: "#0f172a",
  margin: 0,
};

const addButton = {
  background: "#3b82f6",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  fontSize: "14px",
  whiteSpace: "nowrap",
};

const searchContainer = {
  position: "relative",
  marginBottom: "20px",
  width: "100%",
};

const searchIcon = {
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#94a3b8",
};

const searchInput = {
  width: "100%",
  padding: "12px 12px 12px 40px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "14px",
  boxSizing: "border-box",
};

const formContainer = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  marginBottom: "25px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  width: "100%",
  boxSizing: "border-box",
};

const formTitle = {
  margin: "0 0 20px 0",
  fontSize: "18px",
  color: "#0f172a",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "15px",
  marginBottom: "20px",
};

const inputStyle = {
  padding: "12px",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "14px",
  width: "100%",
  boxSizing: "border-box",
};

const formButtons = {
  display: "flex",
  gap: "10px",
  justifyContent: "flex-end",
};

const saveButton = {
  background: "#10b981",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
};

const cancelButton = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
};

const tableContainer = {
  background: "white",
  borderRadius: "12px",
  color:'black',
  overflow: "auto",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  width: "100%",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "800px",
};

const th = {
  textAlign: "left",
  padding: "16px",
  background: "#f8fafc",
  borderBottom: "2px solid #e2e8f0",
  color: "#475569",
  fontSize: "14px",
  fontWeight: "600",
};

const td = {
  padding: "16px",
  borderBottom: "1px solid #e2e8f0",
  fontSize: "14px",
};

const statusBadge = {
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "500",
  display: "inline-block",
};

const actionButton = {
  background: "none",
  border: "none",
  cursor: "pointer",
  marginRight: "12px",
  color: "#64748b",
  fontSize: "16px",
};

export default Employees;