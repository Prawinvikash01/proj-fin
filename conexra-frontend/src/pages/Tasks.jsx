import { useState, useEffect } from "react";
import { 
  FaTasks, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaUser,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaCalendarAlt,
  FaFlag,
  FaSave,
  FaTimes
} from "react-icons/fa";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });

  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    assignedTo: "",
    department: "",
    priority: "medium",
    status: "pending",
    dueDate: "",
    createdDate: new Date().toISOString().split('T')[0]
  });

  // Mock employees data
  const [employees] = useState([
    { id: 1, name: "John Doe", department: "Engineering" },
    { id: 2, name: "Jane Smith", department: "Marketing" },
    { id: 3, name: "Mike Johnson", department: "HR" },
    { id: 4, name: "Sarah Wilson", department: "Sales" },
    { id: 5, name: "Tom Brown", department: "Engineering" },
    { id: 6, name: "Emily Davis", department: "Marketing" },
  ]);

  // Load mock tasks
  useEffect(() => {
    const mockTasks = [
      // {
      //   id: 1,
      //   title: "Update employee handbooks",
      //   description: "Review and update HR policies for 2026",
      //   assignedTo: "Mike Johnson",
      //   assignedToId: 3,
      //   department: "HR",
      //   priority: "high",
      //   status: "in-progress",
      //   dueDate: "2026-03-15",
      //   createdDate: "2026-03-01",
      //   completedDate: null
      // },
      // {
      //   id: 2,
      //   title: "Prepare quarterly sales report",
      //   description: "Compile Q1 sales data and create presentation",
      //   assignedTo: "Sarah Wilson",
      //   assignedToId: 4,
      //   department: "Sales",
      //   priority: "high",
      //   status: "pending",
      //   dueDate: "2026-03-20",
      //   createdDate: "2026-03-05",
      //   completedDate: null
      // },
      // {
      //   id: 3,
      //   title: "Fix login page bug",
      //   description: "Users unable to reset password - urgent fix needed",
      //   assignedTo: "John Doe",
      //   assignedToId: 1,
      //   department: "Engineering",
      //   priority: "critical",
      //   status: "completed",
      //   dueDate: "2026-03-10",
      //   createdDate: "2026-03-02",
      //   completedDate: "2026-03-09"
      // },
      // {
      //   id: 4,
      //   title: "Design new marketing campaign",
      //   description: "Create social media assets for product launch",
      //   assignedTo: "Jane Smith",
      //   assignedToId: 2,
      //   department: "Marketing",
      //   priority: "medium",
      //   status: "in-progress",
      //   dueDate: "2026-03-25",
      //   createdDate: "2026-03-03",
      //   completedDate: null
      // },
      // {
      //   id: 5,
      //   title: "Update employee attendance system",
      //   description: "Add new features to attendance tracking",
      //   assignedTo: "Tom Brown",
      //   assignedToId: 5,
      //   department: "Engineering",
      //   priority: "medium",
      //   status: "pending",
      //   dueDate: "2026-03-18",
      //   createdDate: "2026-03-04",
      //   completedDate: null
      // },
      // {
      //   id: 6,
      //   title: "Organize team building event",
      //   description: "Plan quarterly team building activity",
      //   assignedTo: "Emily Davis",
      //   assignedToId: 6,
      //   department: "Marketing",
      //   priority: "low",
      //   status: "pending",
      //   dueDate: "2026-03-30",
      //   createdDate: "2026-03-06",
      //   completedDate: null
      // },
      // {
      //   id: 7,
      //   title: "Review job applications",
      //   description: "Screen candidates for senior developer position",
      //   assignedTo: "Mike Johnson",
      //   assignedToId: 3,
      //   department: "HR",
      //   priority: "high",
      //   status: "pending",
      //   dueDate: "2026-03-12",
      //   createdDate: "2026-03-07",
      //   completedDate: null
      // },
    ];

    setTasks(mockTasks);
  }, []);

  // Apply filters and calculate stats
  useEffect(() => {
    let filtered = [...tasks];

    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredTasks(filtered);

    // Calculate stats
    const today = new Date().toISOString().split('T')[0];
    const total = tasks.length;
    const pending = tasks.filter(t => t.status === "pending").length;
    const inProgress = tasks.filter(t => t.status === "in-progress").length;
    const completed = tasks.filter(t => t.status === "completed").length;
    const overdue = tasks.filter(t => t.status !== "completed" && t.dueDate < today).length;

    setStats({ total, pending, inProgress, completed, overdue });
  }, [tasks, statusFilter, priorityFilter, searchTerm]);

  const handleAddTask = () => {
    // Validate form
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      alert("Please fill all required fields");
      return;
    }

    // Find employee details
    const employee = employees.find(e => e.name === newTask.assignedTo);

    const task = {
      id: tasks.length + 1,
      ...newTask,
      assignedToId: employee?.id,
      createdDate: new Date().toISOString().split('T')[0],
      completedDate: null
    };

    setTasks([task, ...tasks]);
    resetForm();
    setShowForm(false);
    alert("Task created successfully!");
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTask({
      title: task.title,
      description: task.description || "",
      assignedTo: task.assignedTo,
      department: task.department,
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate
    });
    setShowForm(true);
  };

  const handleUpdateTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.dueDate) {
      alert("Please fill all required fields");
      return;
    }

    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id 
        ? { 
            ...task, 
            ...newTask,
            completedDate: newTask.status === "completed" ? new Date().toISOString().split('T')[0] : null 
          }
        : task
    );

    setTasks(updatedTasks);
    resetForm();
    setShowForm(false);
    setEditingTask(null);
    alert("Task updated successfully!");
  };

  const handleDeleteTask = (id) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      setTasks(tasks.filter(task => task.id !== id));
      alert("Task deleted successfully!");
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { 
            ...task, 
            status: newStatus,
            completedDate: newStatus === "completed" ? new Date().toISOString().split('T')[0] : null 
          }
        : task
    ));
  };

  const resetForm = () => {
    setNewTask({
      title: "",
      description: "",
      assignedTo: "",
      department: "",
      priority: "medium",
      status: "pending",
      dueDate: "",
      createdDate: new Date().toISOString().split('T')[0]
    });
  };

  const getPriorityDetails = (priority) => {
    switch(priority) {
      case "critical":
        return { color: "#7f1d1d", bg: "#fee2e2", icon: <FaExclamationTriangle />, text: "Critical" };
      case "high":
        return { color: "#991b1b", bg: "#fee2e2", icon: <FaFlag />, text: "High" };
      case "medium":
        return { color: "#92400e", bg: "#fef3c7", icon: <FaFlag />, text: "Medium" };
      case "low":
        return { color: "#065f46", bg: "#d1fae5", icon: <FaFlag />, text: "Low" };
      default:
        return { color: "#1e293b", bg: "#f1f5f9", icon: <FaFlag />, text: "Medium" };
    }
  };

  const getStatusDetails = (status) => {
    switch(status) {
      case "pending":
        return { color: "#92400e", bg: "#fef3c7", text: "Pending" };
      case "in-progress":
        return { color: "#1e40af", bg: "#dbeafe", text: "In Progress" };
      case "completed":
        return { color: "#065f46", bg: "#d1fae5", text: "Completed" };
      default:
        return { color: "#475569", bg: "#f1f5f9", text: status };
    }
  };

  const isOverdue = (dueDate, status) => {
    const today = new Date().toISOString().split('T')[0];
    return status !== "completed" && dueDate < today;
  };

  return (
    <div style={pageContainer}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={pageTitle}>Task Management</h1>
        <button onClick={() => {
          resetForm();
          setEditingTask(null);
          setShowForm(true);
        }} style={addButton}>
          <FaPlus /> Create New Task
        </button>
      </div>

      {/* Stats Cards */}
      <div style={statsContainer}>
        <div style={{...statCard, background: "linear-gradient(135deg, #3b82f6, #2563eb)"}}>
          <div style={statIconWrapper}>
            <FaTasks style={statIcon} />
          </div>
          <div style={statInfo}>
            <div style={statLabel}>Total Tasks</div>
            <div style={statValue}>{stats.total}</div>
          </div>
        </div>
        <div style={{...statCard, background: "linear-gradient(135deg, #f59e0b, #d97706)"}}>
          <div style={statIconWrapper}>
            <FaClock style={statIcon} />
          </div>
          <div style={statInfo}>
            <div style={statLabel}>Pending</div>
            <div style={statValue}>{stats.pending}</div>
          </div>
        </div>
        <div style={{...statCard, background: "linear-gradient(135deg, #3b82f6, #1d4ed8)"}}>
          <div style={statIconWrapper}>
            <FaTasks style={statIcon} />
          </div>
          <div style={statInfo}>
            <div style={statLabel}>In Progress</div>
            <div style={statValue}>{stats.inProgress}</div>
          </div>
        </div>
        <div style={{...statCard, background: "linear-gradient(135deg, #10b981, #059669)"}}>
          <div style={statIconWrapper}>
            <FaCheckCircle style={statIcon} />
          </div>
          <div style={statInfo}>
            <div style={statLabel}>Completed</div>
            <div style={statValue}>{stats.completed}</div>
          </div>
        </div>
        <div style={{...statCard, background: "linear-gradient(135deg, #ef4444, #dc2626)"}}>
          <div style={statIconWrapper}>
            <FaExclamationTriangle style={statIcon} />
          </div>
          <div style={statInfo}>
            <div style={statLabel}>Overdue</div>
            <div style={statValue}>{stats.overdue}</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={filtersContainer}>
        <div style={filterGroup}>
          <FaFilter style={filterIcon} />
          <label style={filterLabel}>Status:</label>
          <div style={selectWrapperSmall}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={filterSelect}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <FaChevronDown style={selectIconSmall} />
          </div>
        </div>

        <div style={filterGroup}>
          <label style={filterLabel}>Priority:</label>
          <div style={selectWrapperSmall}>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              style={filterSelect}
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <FaChevronDown style={selectIconSmall} />
          </div>
        </div>

        <div style={searchGroup}>
          <FaSearch style={searchIcon} />
          <input
            type="text"
            placeholder="Search tasks by title, description, or assignee..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={searchInput}
          />
        </div>
      </div>

      {/* Task Creation/Edit Form Modal */}
      {showForm && (
        <div style={formOverlay}>
          <div style={formContainer}>
            <h3 style={formTitle}>
              {editingTask ? "Edit Task" : "Create New Task"}
            </h3>
            
            <div style={formGrid}>
              <div style={fullWidthFormGroup}>
                <label style={formLabel}>Task Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  style={formInput}
                  placeholder="Enter task title"
                />
              </div>

              <div style={fullWidthFormGroup}>
                <label style={formLabel}>Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  style={formTextarea}
                  rows="3"
                  placeholder="Enter task description..."
                />
              </div>

              <div style={formGroup}>
                <label style={formLabel}>Assign To *</label>
                <div style={selectWrapper}>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => {
                      const employee = employees.find(emp => emp.name === e.target.value);
                      setNewTask({
                        ...newTask, 
                        assignedTo: e.target.value,
                        department: employee?.department || ""
                      });
                    }}
                    style={formSelect}
                  >
                    <option value="">Select Employee</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.name}>{emp.name} - {emp.department}</option>
                    ))}
                  </select>
                  <FaChevronDown style={selectIcon} />
                </div>
              </div>

              <div style={formGroup}>
                <label style={formLabel}>Priority *</label>
                <div style={selectWrapper}>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    style={formSelect}
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                  <FaChevronDown style={selectIcon} />
                </div>
              </div>

              <div style={formGroup}>
                <label style={formLabel}>Due Date *</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                  style={formInput}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div style={formGroup}>
                <label style={formLabel}>Status</label>
                <div style={selectWrapper}>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                    style={formSelect}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <FaChevronDown style={selectIcon} />
                </div>
              </div>
            </div>

            <div style={formButtons}>
              <button 
                onClick={editingTask ? handleUpdateTask : handleAddTask} 
                style={submitButton}
              >
                <FaSave /> {editingTask ? "Update Task" : "Create Task"}
              </button>
              <button 
                onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
                  resetForm();
                }} 
                style={cancelButton}
              >
                <FaTimes /> Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Table */}
      <div style={tableContainer}>
        <table style={table}>
          <thead>
            <tr>
              <th style={th}>Task</th>
              <th style={th}>Assigned To</th>
              <th style={th}>Department</th>
              <th style={th}>Priority</th>
              <th style={th}>Status</th>
              <th style={th}>Due Date</th>
              <th style={th}>Created</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map(task => {
              const priority = getPriorityDetails(task.priority);
              const status = getStatusDetails(task.status);
              const overdue = isOverdue(task.dueDate, task.status);
              
              return (
                <tr key={task.id} style={overdue ? overdueRow : {}}>
                  <td style={td}>
                    <div style={taskCell}>
                      <div style={taskTitle}>{task.title}</div>
                      <div style={taskDescription}>{task.description}</div>
                    </div>
                  </td>
                  <td style={td}>
                    <div style={assigneeCell}>
                      <FaUser style={assigneeIcon} />
                      {task.assignedTo}
                    </div>
                  </td>
                  <td style={td}>{task.department}</td>
                  <td style={td}>
                    <span style={{
                      ...priorityBadge,
                      backgroundColor: priority.bg,
                      color: priority.color
                    }}>
                      {priority.icon} {priority.text}
                    </span>
                  </td>
                  <td style={td}>
                    <div style={statusCell}>
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        style={{
                          ...statusSelect,
                          backgroundColor: status.bg,
                          color: status.color,
                          border: `1px solid ${status.color}`
                        }}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </td>
                  <td style={td}>
                    <div style={{
                      ...dueDateCell,
                      color: overdue ? "#ef4444" : "inherit",
                      fontWeight: overdue ? "600" : "normal"
                    }}>
                      <FaCalendarAlt style={dueDateIcon} />
                      {new Date(task.dueDate).toLocaleDateString()}
                      {overdue && <span style={overdueBadge}>Overdue</span>}
                    </div>
                  </td>
                  <td style={td}>{new Date(task.createdDate).toLocaleDateString()}</td>
                  <td style={td}>
                    <div style={actionGroup}>
                      <button 
                        onClick={() => handleEditTask(task)}
                        style={{...actionButton, color: "#3b82f6", background: "#dbeafe"}}
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        style={{...actionButton, color: "#ef4444", background: "#fee2e2"}}
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div style={summaryContainer}>
        <p>Showing {filteredTasks.length} of {tasks.length} tasks</p>
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

const addButton = {
  background: "#3b82f6",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
};

const statsContainer = {
  display: "grid",
  gridTemplateColumns: "repeat(5, 1fr)",
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

const statIconWrapper = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "rgba(255,255,255,0.2)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const statIcon = {
  fontSize: "24px",
};

const statInfo = {
  flex: 1,
};

const statLabel = {
  fontSize: "12px",
  opacity: 0.9,
  marginBottom: "5px",
};

const statValue = {
  fontSize: "24px",
  fontWeight: "bold",
};

// Filter Styles
const filtersContainer = {
  background: "white",
  padding: "15px 20px",
  borderRadius: "8px",
  marginBottom: "20px",
  display: "flex",
  gap: "20px",
  alignItems: "center",
  flexWrap: "wrap",
  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
};

const filterGroup = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
};

const filterIcon = {
  color: "#64748b",
};

const filterLabel = {
  fontSize: "14px",
  color: "#475569",
};

const selectWrapperSmall = {
  position: "relative",
  width: "150px",
};

const filterSelect = {
  padding: "8px 30px 8px 10px",
  border: "2px solid #e2e8f0",
  borderRadius: "6px",
  fontSize: "14px",
  backgroundColor: "white",
  outline: "none",
  appearance: "none",
  width: "100%",
  cursor: "pointer",
};

const selectIconSmall = {
  position: "absolute",
  right: "8px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#64748b",
  pointerEvents: "none",
  fontSize: "12px",
};

const searchGroup = {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  position: "relative",
  flex: 1,
};

const searchIcon = {
  position: "absolute",
  left: "10px",
  color: "#94a3b8",
};

const searchInput = {
  padding: "8px 12px 8px 35px",
  border: "2px solid #e2e8f0",
  borderRadius: "6px",
  fontSize: "14px",
  width: "100%",
  outline: "none",
};

// Form Modal Styles
const formOverlay = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const formContainer = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "90vh",
  overflow: "auto",
};

const formTitle = {
  fontSize: "20px",
  color: "#0f172a",
  margin: "0 0 20px 0",
};

const formGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "15px",
  marginBottom: "20px",
};

const formGroup = {
  display: "flex",
  flexDirection: "column",
};

const fullWidthFormGroup = {
  gridColumn: "span 2",
};

const formLabel = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#475569",
  marginBottom: "5px",
};

const formInput = {
  padding: "10px",
  border: "2px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
};

const formSelect = {
  padding: "10px 35px 10px 10px",
  border: "2px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "14px",
  backgroundColor: "white",
  outline: "none",
  appearance: "none",
  width: "100%",
};

const formTextarea = {
  padding: "10px",
  border: "2px solid #e2e8f0",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  resize: "vertical",
};

const selectWrapper = {
  position: "relative",
  width: "100%",
};

const selectIcon = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  color: "#64748b",
  pointerEvents: "none",
  fontSize: "12px",
};

const formButtons = {
  display: "flex",
  gap: "10px",
  justifyContent: "flex-end",
};

const submitButton = {
  background: "#3b82f6",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const cancelButton = {
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "12px 24px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "14px",
  fontWeight: "600",
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

// Table Styles
const tableContainer = {
  background: "white",
  borderRadius: "12px",
  overflow: "auto",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  marginBottom: "20px",
};

const table = {
  width: "100%",
  borderCollapse: "collapse",
  minWidth: "1200px",
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

const overdueRow = {
  background: "#fff1f0",
};

const taskCell = {
  maxWidth: "250px",
};

const taskTitle = {
  fontWeight: "600",
  marginBottom: "4px",
};

const taskDescription = {
  fontSize: "12px",
  color: "#64748b",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const assigneeCell = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const assigneeIcon = {
  color: "#64748b",
  fontSize: "12px",
};

const priorityBadge = {
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: "500",
  display: "inline-flex",
  alignItems: "center",
  gap: "4px",
};

const statusCell = {
  width: "130px",
};

const statusSelect = {
  padding: "6px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "600",
  border: "none",
  outline: "none",
  cursor: "pointer",
  width: "130px",
};

const dueDateCell = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const dueDateIcon = {
  color: "#64748b",
  fontSize: "12px",
};

const overdueBadge = {
  background: "#fee2e2",
  color: "#ef4444",
  padding: "2px 6px",
  borderRadius: "4px",
  fontSize: "10px",
  marginLeft: "8px",
  fontWeight: "600",
};

const actionGroup = {
  display: "flex",
  gap: "8px",
};

const actionButton = {
  border: "none",
  cursor: "pointer",
  fontSize: "14px",
  padding: "8px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const summaryContainer = {
  textAlign: "right",
  color: "#64748b",
  fontSize: "14px",
  padding: "10px 0",
};

export default Tasks;