import { Route } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import {
  AdminDashboard,
  AdminTeachers,
  AdminTeacherDetail,
  AdminClasses,
  AdminReports,
  AdminAuditLogs,
  AdminApprovals,
  AdminComplaints,
  SchoolAdminCommandCenter,
} from '../pages/admin'
import {
  StaffDashboard,
  StaffTeachers,
  StaffApprovals,
  StaffBuses,
  StaffNotifications,
  StaffStudents,
  StaffStudentProfile,
  StaffAttendance,
  StaffBehavior,
  StaffActivities,
} from '../pages/staff'
import {
  Dashboard,
  Students,
  Attendance,
  Buses,
  Pickup,
  Dismissal,
  Academic,
  Behavior,
  Activities,
  Notifications,
} from '../pages/shared'

export function AdminAndStaffRoutes() {
  return (
    <>
      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teachers"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminTeachers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teachers/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminTeacherDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/classes"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminClasses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/audit-logs"
        element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <AdminAuditLogs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/approvals"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/complaints"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminComplaints />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/command-center"
        element={
          <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
            <SchoolAdminCommandCenter />
          </ProtectedRoute>
        }
      />

      {/* Staff */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/teachers"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffTeachers />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/approvals"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/buses"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffBuses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/students"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/students/:id"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffStudentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/attendance"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/behavior"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffBehavior />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/activities"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffActivities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/notifications"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffNotifications />
          </ProtectedRoute>
        }
      />

      {/* Shared dashboard layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'staff']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'staff']}>
            <Students />
          </ProtectedRoute>
        }
      />
      <Route
        path="/students/:id"
        element={
          <ProtectedRoute allowedRoles={['admin', 'staff']}>
            <StaffStudentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/attendance"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'staff']}>
            <Attendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/buses"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'staff', 'driver']}>
            <Buses />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pickup"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'staff']}>
            <Pickup />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dismissal"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'staff']}>
            <Dismissal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/academic"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher']}>
            <Academic />
          </ProtectedRoute>
        }
      />
      <Route
        path="/behavior"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'staff']}>
            <Behavior />
          </ProtectedRoute>
        }
      />
      <Route
        path="/activities"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'staff']}>
            <Activities />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute allowedRoles={['admin', 'teacher', 'staff']}>
            <Notifications />
          </ProtectedRoute>
        }
      />
    </>
  )
}

