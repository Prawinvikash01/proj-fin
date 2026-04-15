import { useState, useEffect } from "react";
import { 
  FaTasks, 
  FaCheckCircle, 
  FaClock, 
  FaExclamationTriangle,
  FaFilter,
  FaSearch,
  FaChevronDown,
  FaCalendarAlt,
  FaFlag,
  FaUser,
  FaInfoCircle
} from "react-icons/fa";
import * as taskService from "../../services/taskService";

function MyTasks() {
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
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

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const response = await taskService.getAllTasks();
        const tasksData = Array.isArray(response) ? response : response.data || [];
        setTasks(tasksData);
      } catch (err) {
        console.error("Error loading tasks:", err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let filtered = [...tasks];

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(task => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(task => task.priority === priorityFilter);
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(task => 
        task.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.category || "").toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskService.updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(task => 
        (task._id || task.id) === taskId 
          ? { 
              ...task, 
              status: newStatus,
              completedDate: newStatus === "completed" ? new Date().toISOString().split('T')[0] : null 
            }
          : task
      ));
    } catch (err) {
      console.error("Error updating task status:", err);
    }
  };

  const getPriorityDetails = (priority) => {
    switch(priority) {
      case "critical":
        return { 
          color: "#7f1d1d", 
          bg: "#fee2e2", 
          icon: <FaExclamationTriangle />, 
          text: "Critical",
          border: "#dc2626"
        };
      case "high":
        return { 
          color: "#991b1b", 
          bg: "#fee2e2", 
          icon: <FaFlag />, 
          text: "High",
          border: "#ef4444"
        };
      case "medium":
        return { 
          color: "#92400e", 
          bg: "#fef3c7", 
          icon: <FaFlag />, 
          text: "Medium",
          border: "#f59e0b"
        };
      case "low":
        return { 
          color: "#065f46", 
          bg: "#d1fae5", 
          icon: <FaFlag />, 
          text: "Low",
          border: "#10b981"
        };
      default:
        return { 
          color: "#1e293b", 
          bg: "#f1f5f9", 
          icon: <FaFlag />, 
          text: "Medium",
          border: "#64748b"
        };
    }
  };

  const getStatusOptions = () => {
    return [
      { value: "pending", label: "Pending", bg: "#fef3c7", color: "#92400e" },
      { value: "in-progress", label: "In Progress", bg: "#dbeafe", color: "#1e40af" },
      { value: "completed", label: "Completed", bg: "#d1fae5", color: "#065f46" },
    ];
  };

  const isOverdue = (dueDate, status) => {
    const today = new Date().toISOString().split('T')[0];
    return status !== "completed" && dueDate < today;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div style={styles.pageContainer}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.pageTitle}>My Tasks</h1>
        <div style={styles.statsBadge}>
          <span style={styles.statsBadgeText}>
            {stats.pending + stats.inProgress} active • {stats.completed} completed
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsContainer}>
        <div style={{...styles.statCard, borderLeft: "5px solid #f59e0b"}}>
          <div style={styles.statIconWrapper}>
            <FaClock style={{...styles.statIcon, color: "#f59e0b"}} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Pending</span>
            <span style={styles.statValue}>{stats.pending}</span>
          </div>
        </div>
        <div style={{...styles.statCard, borderLeft: "5px solid #3b82f6"}}>
          <div style={styles.statIconWrapper}>
            <FaTasks style={{...styles.statIcon, color: "#3b82f6"}} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>In Progress</span>
            <span style={styles.statValue}>{stats.inProgress}</span>
          </div>
        </div>
        <div style={{...styles.statCard, borderLeft: "5px solid #10b981"}}>
          <div style={styles.statIconWrapper}>
            <FaCheckCircle style={{...styles.statIcon, color: "#10b981"}} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Completed</span>
            <span style={styles.statValue}>{stats.completed}</span>
          </div>
        </div>
        <div style={{...styles.statCard, borderLeft: "5px solid #ef4444"}}>
          <div style={styles.statIconWrapper}>
            <FaExclamationTriangle style={{...styles.statIcon, color: "#ef4444"}} />
          </div>
          <div style={styles.statInfo}>
            <span style={styles.statLabel}>Overdue</span>
            <span style={styles.statValue}>{stats.overdue}</span>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div style={styles.filtersContainer}>
        <div style={styles.filterGroup}>
          <FaFilter style={styles.filterIcon} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            style={styles.filterSelect}
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div style={styles.searchGroup}>
          <FaSearch style={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.searchInput}
          />
        </div>
      </div>

      {/* Tasks List */}
      <div style={styles.tasksContainer}>
        {filteredTasks.length === 0 ? (
          <div style={styles.emptyState}>
            <FaTasks style={styles.emptyIcon} />
            <p>No tasks found</p>
          </div>
        ) : (
          filteredTasks.map(task => {
            const priority = getPriorityDetails(task.priority);
            const overdue = isOverdue(task.dueDate, task.status);
            const statusOptions = getStatusOptions();
            
            return (
              <div 
                key={task._id || task.id} 
                style={{
                  ...styles.taskCard,
                  borderLeft: `5px solid ${priority.border}`,
                  backgroundColor: overdue ? '#fff1f0' : 'white'
                }}
              >
                <div style={styles.taskHeader}>
                  <div style={styles.taskTitleSection}>
                    <h3 style={styles.taskTitle}>{task.title}</h3>
                    <span style={styles.taskCategory}>{task.category}</span>
                  </div>
                  <div style={styles.taskStatus}>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id || task.id, e.target.value)}
                      style={{
                        ...styles.statusSelect,
                        backgroundColor: statusOptions.find(s => s.value === task.status)?.bg || '#f1f5f9',
                        color: statusOptions.find(s => s.value === task.status)?.color || '#475569'
                      }}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <p style={styles.taskDescription}>{task.description}</p>

                <div style={styles.taskDetails}>
                  <div style={styles.taskDetailItem}>
                    <FaUser style={styles.detailIcon} />
                    <span>Assigned by: {task.assignedBy?.name || task.assignedBy || 'Admin'}</span>
                  </div>
                  <div style={styles.taskDetailItem}>
                    <FaCalendarAlt style={styles.detailIcon} />
                    <span style={{color: overdue ? '#ef4444' : 'inherit', fontWeight: overdue ? '600' : 'normal'}}>
                      Due: {formatDate(task.dueDate)}
                      {overdue && <span style={styles.overdueBadge}>Overdue</span>}
                    </span>
                  </div>
                  <div style={styles.taskDetailItem}>
                    <span style={{
                      ...styles.priorityBadge,
                      backgroundColor: priority.bg,
                      color: priority.color
                    }}>
                      {priority.icon} {priority.text}
                    </span>
                  </div>
                </div>

                {task.completedDate && (
                  <div style={styles.completedInfo}>
                    <FaCheckCircle style={{color: '#10b981', marginRight: '5px'}} />
                    Completed on {formatDate(task.completedDate)}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Summary */}
      <div style={styles.summaryContainer}>
        <p>Showing {filteredTasks.length} of {tasks.length} tasks</p>
      </div>
    </div>
  );
}

// Styles
const styles = {
  pageContainer: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  pageTitle: {
    fontSize: "28px",
    color: "#0f172a",
    margin: 0,
    fontWeight: "600",
  },
  statsBadge: {
    background: "#f1f5f9",
    padding: "8px 16px",
    borderRadius: "30px",
  },
  statsBadgeText: {
    fontSize: "14px",
    color: "#475569",
    fontWeight: "500",
  },
  statsContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "25px",
  },
  statCard: {
    background: "white",
    padding: "15px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  statIconWrapper: {
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "#f8fafc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  statIcon: {
    fontSize: "20px",
  },
  statInfo: {
    display: "flex",
    flexDirection: "column",
  },
  statLabel: {
    fontSize: "12px",
    color: "#64748b",
    marginBottom: "2px",
  },
  statValue: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#0f172a",
  },
  filtersContainer: {
    background: "white",
    padding: "15px 20px",
    borderRadius: "12px",
    marginBottom: "25px",
    display: "flex",
    gap: "15px",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  filterGroup: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  filterIcon: {
    color: "#64748b",
  },
  filterSelect: {
    padding: "8px 30px 8px 12px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    backgroundColor: "white",
    outline: "none",
    appearance: "none",
    cursor: "pointer",
    minWidth: "140px",
      color:"black",
  },
  searchGroup: {
    position: "relative",
    flex: 1,
  },
  searchIcon: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
  },
  searchInput: {
    width: "100%",
    padding: "8px 12px 8px 40px",
    border: "2px solid #e2e8f0",
    borderRadius: "8px",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
  },
  tasksContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "20px",
  },
  taskCard: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  taskHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "12px",
  },
  taskTitleSection: {
    flex: 1,
  },
  taskTitle: {
    fontSize: "16px",
    color: "#0f172a",
    margin: "0 0 5px 0",
    fontWeight: "600",
  },
  taskCategory: {
    fontSize: "12px",
    color: "#64748b",
    background: "#f1f5f9",
    padding: "2px 8px",
    borderRadius: "12px",
  },
  taskStatus: {
    minWidth: "140px",
  },
  statusSelect: {
    padding: "8px 12px",
    border: "none",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
    outline: "none",
    cursor: "pointer",
    width: "140px",
  },
  taskDescription: {
    fontSize: "14px",
    color: "#475569",
    margin: "0 0 15px 0",
    lineHeight: "1.6",
  },
  taskDetails: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    padding: "10px 0",
    borderTop: "1px solid #e2e8f0",
    borderBottom: "1px solid #e2e8f0",
  },
  taskDetailItem: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "13px",
    color: "#475569",
  },
  detailIcon: {
    color: "#94a3b8",
    fontSize: "12px",
  },
  priorityBadge: {
    padding: "4px 10px",
    borderRadius: "16px",
    fontSize: "12px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  overdueBadge: {
    background: "#fee2e2",
    color: "#ef4444",
    padding: "2px 6px",
    borderRadius: "4px",
    fontSize: "10px",
    marginLeft: "8px",
    fontWeight: "600",
  },
  completedInfo: {
    marginTop: "12px",
    fontSize: "13px",
    color: "#10b981",
    display: "flex",
    alignItems: "center",
  },
  emptyState: {
    textAlign: "center",
    padding: "60px",
    background: "white",
    borderRadius: "12px",
    color: "#94a3b8",
  },
  emptyIcon: {
    fontSize: "48px",
    marginBottom: "15px",
    color: "#cbd5e1",
  },
  summaryContainer: {
    textAlign: "right",
    color: "#64748b",
    fontSize: "14px",
    padding: "10px 0",
  },
};

export default MyTasks;