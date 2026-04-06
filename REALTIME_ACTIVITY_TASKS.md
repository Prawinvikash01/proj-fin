# Real-Time Recent Activity & Pending Tasks Implementation

## Overview
Converted hardcoded Recent Activity and Pending Tasks sections in the Employee Dashboard to real-time data by creating new backend models, controllers, and routes, and updating the frontend services and components.

---

## Backend Changes

### 1. **New Task Model** (`backend/src/models/Task.js`)
```javascript
Schema Fields:
- employee: Reference to Employee
- assignedBy: Reference to User (who assigned the task)
- title: String (required)
- description: String
- dueDate: Date (required)
- status: 'pending' | 'in-progress' | 'completed'
- priority: 'low' | 'medium' | 'high'
- category: String
- completedAt: Date (set when task is completed)
- createdAt, updatedAt: Timestamps
```

### 2. **Task Controller** (`backend/src/controllers/taskController.js`)

#### Endpoints provided:

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/tasks/pending` | Get pending and in-progress tasks for employee |
| GET | `/tasks/all` | Get all tasks for employee |
| GET | `/tasks/stats` | Get task statistics (pending count, completed count) |
| POST | `/tasks` | Create new task (admin/HR only) |
| PUT | `/tasks/:taskId/status` | Update task status |
| DELETE | `/tasks/:taskId` | Delete task (admin only) |

**Key Methods:**
- `getPendingTasks()` - Returns only pending and in-progress tasks
- `getTaskStats()` - Returns counts of pending and completed tasks for dashboard
- `createTask()` - Admin/HR creates task for employee
- `updateTaskStatus()` - Updates task status with completion timestamp
- `deleteTask()` - Removes task from system

### 3. **Task Routes** (`backend/src/routes/taskRoutes.js`)
```
Route Order (specific → generic):
1. GET /pending
2. GET /all
3. GET /stats
4. POST / (create)
5. PUT /:taskId/status
6. DELETE /:taskId
```

### 4. **Enhanced Attendance Controller** (`backend/src/controllers/attendanceController.js`)

Added new method:
```javascript
getRecentActivity() - Returns formatted recent user activities from AuditLog
```

**How it works:**
- Fetches AuditLog entries for current user from last 10 days
- Maps technical actions to human-readable descriptions:
  - POST to `/attachment` → "Uploaded a document"
  - POST to `/leave` → "Submitted leave request"
  - POST to `/check-in` → "Checked in"
  - POST to `/check-out` → "Checked out"
  - PUT to `/profile` → "Updated profile"
  - PUT to `/task` → "Completed a task"
- Returns formatted with timestamp and description

### 5. **Updated Routes** (`backend/src/routes/attendanceRoutes.js`)
Added new route:
```
GET /activity/recent - Get recent user activities
```

Route order (specific → generic):
- POST /check-in
- POST /check-out
- GET /today/status
- GET /dashboard/stats
- GET /activity/recent
- GET / (generic)

### 6. **App Configuration** (`backend/src/app.js`)
Registered task routes:
```javascript
const taskRoutes = require('./routes/taskRoutes');
app.use('/api/tasks', taskRoutes);
```

---

## Frontend Changes

### 1. **New Task Service** (`conexra-frontend/src/services/taskService.js`)

```javascript
Methods:
- getPendingTasks() → GET /tasks/pending
- getAllTasks() → GET /tasks/all
- getTaskStats() → GET /tasks/stats
- createTask(taskData) → POST /tasks
- updateTaskStatus(taskId, status) → PUT /tasks/:taskId/status
- deleteTask(taskId) → DELETE /tasks/:taskId
```

### 2. **Enhanced Attendance Service** (`conexra-frontend/src/services/attendanceService.js`)

Added new method:
```javascript
getRecentActivity() → GET /attendance/activity/recent
```

### 3. **Updated Dashboard Component** (`conexra-frontend/src/pages/employee/Dashboard.jsx`)

#### New Imports:
```javascript
import { getRecentActivity } from "../../services/attendanceService";
import { getPendingTasks, getTaskStats } from "../../services/taskService";
```

#### New State:
```javascript
const [recentActivity, setRecentActivity] = useState([]);
const [pendingTasks, setPendingTasks] = useState([]);
```

#### Updated useEffect:
- Now calls 6 APIs in parallel:
  1. `getDashboardStats()`
  2. `getTodayStatus()`
  3. `getLeaveBalance()`
  4. `getRecentActivity()`
  5. `getPendingTasks()`
  6. `getTaskStats()`

- Updates stats with real task counts
- Populates recent activity and pending tasks arrays

#### Recent Activity Section:
- Maps `recentActivity` array to display items
- Calculates relative time (e.g., "5m ago", "2h ago", "Just now")
- Shows "No recent activity" if empty
- Shows real descriptions from backend

#### Pending Tasks Section:
- Maps `pendingTasks` array to display first 3 items
- Shows task title and formatted due date
- Color codes due dates:
  - Red for overdue tasks
  - Orange for upcoming tasks
- Shows "No pending tasks" if empty
- Checkbox onChange can trigger task completion (optional future feature)

---

## Data Flow Diagram

```
Dashboard Component
    ↓
[useEffect - On Mount]
    ↓
[Parallel API Calls]
    ├→ getDashboardStats()
    ├→ getTodayStatus()
    ├→ getLeaveBalance()
    ├→ getRecentActivity()
    ├→ getPendingTasks()
    └→ getTaskStats()
        ↓
    [Backend Endpoints]
    ├→ /attendance/dashboard/stats → attendance.db
    ├→ /attendance/today/status → attendance.db
    ├→ /leaves/balance → employee + leave.db
    ├→ /attendance/activity/recent → auditLog.db
    ├→ /tasks/pending → task.db
    └→ /tasks/stats → task.db
        ↓
    [Response to Frontend]
        ↓
    [Update Component State]
    ├→ stats.pendingTasks
    ├→ stats.completedTasks
    ├→ recentActivity[]
    └→ pendingTasks[]
        ↓
    [Re-render Component]
    ├→ Activity List
    └→ Tasks List
```

---

## Database Integration

### Recent Activity (from AuditLog):
```
When user performs action:
1. Check-in → AuditLog entry created
2. Middleware captures action
3. getRecentActivity() retrieves last 10 days
4. Frontend displays as "Checked in" with timestamp
```

### Pending Tasks (from Task collection):
```
When task assigned to employee:
1. Admin creates task via API
2. Task stored with employee reference
3. getPendingTasks() filters by employee + status
4. Frontend displays with due date
5. Employee can mark complete (optional)
```

---

## Testing Checklist

- [ ] Dashboard loads without errors
- [ ] Recent Activity displays real data from AuditLog
- [ ] Time calculations show correct relative times
- [ ] Empty state shows "No recent activity"
- [ ] Pending Tasks displays tasks from database
- [ ] Task due dates display correctly formatted
- [ ] Overdue tasks show in red
- [ ] Upcoming tasks show in orange
- [ ] Empty state shows "No pending tasks"
- [ ] Task stats update in header (pending/completed counts)
- [ ] Can click "View All Tasks" to navigate to tasks page
- [ ] All error messages display properly
- [ ] API calls work with authentication

---

## API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/attendance/activity/recent` | Employee | Get recent user activities |
| GET | `/tasks/pending` | Employee | Get pending tasks |
| GET | `/tasks/all` | Employee | Get all tasks |
| GET | `/tasks/stats` | Employee | Get task statistics |
| POST | `/tasks` | Admin/HR | Create new task |
| PUT | `/tasks/:taskId/status` | Employee/Admin/HR | Update task status |
| DELETE | `/tasks/:taskId` | Admin | Delete task |

---

## File Structure

```
backend/
├── models/
│   └── Task.js (NEW)
├── controllers/
│   ├── attendanceController.js (UPDATED - added getRecentActivity)
│   └── taskController.js (NEW)
├── routes/
│   ├── attendanceRoutes.js (UPDATED)
│   ├── taskRoutes.js (NEW)
│   └── (others)
├── app.js (UPDATED - added task routes)

frontend/
├── services/
│   ├── attendanceService.js (UPDATED)
│   └── taskService.js (NEW)
└── pages/employee/
    └── Dashboard.jsx (UPDATED)
```

---

## Key Features

✅ **Real-Time Activity Tracking** - Activities from AuditLog database  
✅ **Task Management** - Full task CRUD operations  
✅ **Dashboard Stats** - Live pending/completed task counts  
✅ **Time Formatting** - Relative time display (e.g., "5m ago")  
✅ **Due Date Tracking** - Color-coded overdue/upcoming tasks  
✅ **Responsive** - Works on all screen sizes  
✅ **Error Handling** - Graceful fallbacks for empty data  

---
