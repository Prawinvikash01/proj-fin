# Real-Time Attendance & Leave System Implementation

## Overview
Consolidated and synchronized the check-in/check-out functionality across Dashboard and Attendance pages with real-time data updates and proper business logic.

---

## Backend Changes

### 1. **Attendance Controller** (`backend/src/controllers/attendanceController.js`)

#### New Logic:
- **8-Hour Rule**: Employee is marked as "present" only if they worked 8+ hours
- **Late Detection**: Checks if check-in is after 9:30 AM
- **Multiple Check-ins/Outs**: Allows new check-in after checkout (for shift-based work)
- **Prevents Double Check-in**: Blocks check-in if already checked in but not checked out

#### New Endpoints:
1. **`GET /attendance/today/status`** - Real-time status for current day
   - Returns: `{ isCheckedIn, isCheckedOut, status, checkInTime, checkOutTime, hoursWorked }`

2. **`GET /attendance/dashboard/stats`** - Dashboard statistics
   - Returns: `{ presentDays, absentDays, lateDays, totalDays }` for last 30 days

#### Updated Endpoints:
- **`POST /attendance/check-in`** - Enhanced with late detection and double check-in prevention
- **`POST /attendance/check-out`** - Calculates hours worked and marks status based on 8-hour threshold

### 2. **Employee Model** (`backend/src/models/Employee.js`)
- Added `leaveBalance` object with per-employee allocation:
  - `sickLeave` (default: 12 days)
  - `vacationLeave` (default: 15 days)
  - `personalLeave` (default: 5 days)

### 3. **Attendance Routes** (`backend/src/routes/attendanceRoutes.js`)
- Route order: Specific routes before generic routes
- Prevents route matching issues

### 4. **Leave Routes** (`backend/src/routes/leaveRoutes.js`)
- Fixed route order: `/balance` before generic `GET /`
- Ensures balance endpoint is reachable

---

## Frontend Changes

### 1. **Attendance Service** (`conexra-frontend/src/services/attendanceService.js`)
Added new service methods:
```javascript
getTodayStatus()        // Get current day's check-in/out status
getDashboardStats()     // Get 30-day stats for dashboard
```

### 2. **Attendance Page** (`conexra-frontend/src/pages/employee/Attendance.jsx`)
- **Real-time Sync**: Fetches both attendance history and today's status
- **Proper Time Display**: Shows check-in/out times in HH:MM format
- **Hours Calculation**: Displays actual hours worked (e.g., "8h 45m")
- **Auto-refresh**: Updates data after every check-in/checkout action
- **Better Error Handling**: Shows backend error messages to user

### 3. **Dashboard** (`conexra-frontend/src/pages/employee/Dashboard.jsx`)
Converted from static to real-time:
- **Real-time Stats**: 
  - Present Days (last 30 days)
  - Absent Days (last 30 days)
  - Leave Balance (calculated in real-time)
- **Synchronized Check-in/Out**: Uses same backend calls as Attendance page
- **Real Leave Balance**: Fetches from backend and displays breakdown:
  - Sick Leave remaining
  - Vacation remaining
  - Personal remaining
- **Dynamic Progress Bar**: Shows leave usage percentage

### 4. **Leave Page** (`conexra-frontend/src/pages/employee/Leave.jsx`)
- Real-time leave balance from backend
- Auto-refresh after submitting leave request
- Status-based calculations

---

## Key Business Logic

### Attendance Status Determination:
```
IF check-in AND NOT check-out:
  Status = "Checked In"
  
IF check-in AND check-out:
  Hours = (checkOut - checkIn) / 3600000
  IF hours >= 8:
    Status = "Present" (or "Late" if after 9:30 AM)
  ELSE:
    Status = "Absent"
```

### Check-in/Out Rules:
✅ Can check-in if not already checked-in for the day
❌ Cannot check-in again if already checked-in (must check-out first)
✅ After checkout, can check-in again (new shift)
❌ Cannot checkout without checking in first
❌ Cannot checkout twice same day

### Leave Balance Calculation:
```
Total Available = Sick + Vacation + Personal
Used = Sum of approved leave days
Pending = Sum of pending leave days
Remaining = Total Available - Used - Pending
```

---

## Synchronization Between Pages

Both Dashboard and Attendance pages now:
1. Call the same backend endpoints
2. Display real-time data
3. Auto-refresh after actions
4. Show consistent information
5. Use identical check-in/out logic

---

## What's Fixed

| Issue | Solution |
|-------|----------|
| Hardcoded data in Dashboard | Now fetches from backend |
| Duplicate check-in/out sections | Same logic in both pages, synchronized |
| Can't check-in again after checkout | Fixed - allows new check-in for new shift |
| No time-based "present" validation | Now requires 8 hours of work |
| Leave balance static | Now real-time from database |
| Hours worked not calculated | Now calculated and displayed |
| Late detection missing | Added 9:30 AM threshold |
| No dashboard stats endpoint | Created `/dashboard/stats` endpoint |

---

## Testing Checklist

- [ ] Dashboard loads with real data
- [ ] Attendance page loads with real data
- [ ] Check-in works and updates both pages
- [ ] Check-out works after check-in
- [ ] Cannot check-in twice without checkout
- [ ] Hours worked calculated correctly
- [ ] Status marked "present" only if 8+ hours
- [ ] Status marked "late" if after 9:30 AM
- [ ] Leave balance updates in real-time
- [ ] Progress bars calculate correctly
- [ ] Error messages display properly

---

## API Endpoints Summary

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/attendance/check-in` | Check-in for the day |
| POST | `/attendance/check-out` | Check-out for the day |
| GET | `/attendance/today/status` | Get today's status |
| GET | `/attendance/dashboard/stats` | Get 30-day stats |
| GET | `/attendance` | Get all attendance records |
| GET | `/leaves/balance` | Get leave balance |
| POST | `/leaves` | Apply for leave |
| GET | `/leaves` | Get leave requests |

---
