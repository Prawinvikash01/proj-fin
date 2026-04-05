import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import MainLayout from "./layout/MainLayout";
import EmployeeLayout from "./layout/EmployeeLayout";

// Admin Pages
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Attendance from "./pages/Attendance";
import Leave from "./pages/Leave";
import Tasks from "./pages/Tasks";
import Payroll from "./pages/Payroll";
import Documents from "./pages/Documents";
import Notifications from "./pages/Notifications";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// Employee Pages
import EmployeeDashboard from "./pages/employee/Dashboard";
import MyAttendance from "./pages/employee/Attendance";
import MyLeave from "./pages/employee/Leave";
import MyTasks from "./pages/employee/Tasks";
import MyProfile from "./pages/employee/Profile";

import Login from "./pages/Login";

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role === 'admin' ? '' : 'employee/'}dashboard`} replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes - using MainLayout */}
        <Route element={<MainLayout />}>
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employees" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Employees />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/attendance" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Attendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/leave" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Leave />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/tasks" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Tasks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/payroll" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Payroll />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/documents" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Documents />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/notifications" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Notifications />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Reports />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute allowedRole="admin">
                <Settings />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Employee Routes - using EmployeeLayout */}
        <Route element={<EmployeeLayout />}>
          <Route 
            path="/employee/dashboard" 
            element={
              <ProtectedRoute allowedRole="employee">
                <EmployeeDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/attendance" 
            element={
              <ProtectedRoute allowedRole="employee">
                <MyAttendance />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/leave" 
            element={
              <ProtectedRoute allowedRole="employee">
                <MyLeave />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/tasks" 
            element={
              <ProtectedRoute allowedRole="employee">
                <MyTasks />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/employee/profile" 
            element={
              <ProtectedRoute allowedRole="employee">
                <MyProfile />
              </ProtectedRoute>
            } 
          />
        </Route>

        {/* Catch all - redirect to appropriate dashboard */}
        <Route 
          path="*" 
          element={
            <Navigate to="/" replace />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;