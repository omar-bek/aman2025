import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Toaster } from 'react-hot-toast'
import { Suspense, lazy } from 'react'

// Auth pages
import { Login, Register } from './pages/auth'

// Parent pages
import {
  ParentDashboard,
  ParentProfile,
  ParentNotifications,
  ParentActivity,
  ChildDetail,
  LiveMap,
  Messages,
  TodayStatus,
  RouteTimeline,
  DailyDigest,
  RequestsApprovals,
  RequestDetail,
  NewRequest,
  ConcernsEscalations,
  ConcernDetail,
  NewConcern,
} from './pages/parent'

// Teacher pages
import {
  TeacherDashboard,
  TeacherAssignments,
  TeacherEvaluations,
  TeacherEvaluationNew,
  TeacherEvaluationDetail,
  TeacherStudentProfile,
  TeacherStudents,
  TeacherMessages,
  TeacherAnnouncements,
  TeacherAttendance,
  TeacherExams,
  ClassInsights,
  StudentNotes,
  NotificationsSummary,
  TeacherProfile,
} from './pages/teacher'

// Admin pages
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
} from './pages/admin'

// Staff pages
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
} from './pages/staff'

// Driver pages
import {
  DriverDashboard,
  DriverRouteManagement,
  DriverIncidents,
  DriverLogin,
  VehicleChecklist,
  RouteExecution,
  StudentCheckIn,
  RouteSummary,
} from './pages/driver'

// Student pages
import {
  StudentDashboard,
  StudentProgress,
  StudentAssignments,
  SilentWellbeingCheckin,
} from './pages/student'

// Super Admin pages
import {
  SuperAdminDashboard,
  SuperAdminSchools,
  SuperAdminAnalytics,
  SuperAdminCompliance,
  SuperAdminBroadcast,
} from './pages/super-admin'

// Government pages
import { GovernmentDashboard } from './pages/government'

// Shared pages
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
  AIGuidance,
  TeacherWorkloadReduction,
  Test,
} from './pages/shared'

// Components
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ParentRoutes } from './routes/ParentRoutes'
import { TeacherRoutes } from './routes/TeacherRoutes'
import { AdminAndStaffRoutes } from './routes/AdminAndStaffRoutes'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

// Route guard to redirect users to their specific dashboards
function ParentRouteGuard({ children }: { children: React.ReactNode }) {
  // This component is not used anymore, kept for reference
  return <>{children}</>
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={null}>
            <Routes>
              <Route path="/test" element={<Test />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Grouped routes */}
              {ParentRoutes()}
              {TeacherRoutes()}
              {AdminAndStaffRoutes()}

              {/* Driver Routes (without Layout) */}
              <Route
                path="/driver/login"
                element={<DriverLogin />}
              />
              <Route
                path="/driver"
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <DriverDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/driver/checklist"
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <VehicleChecklist />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/driver/route"
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <RouteExecution />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/driver/route/manage"
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <DriverRouteManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/driver/route/stop/:stopId/checkin"
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <StudentCheckIn />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/driver/summary"
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <RouteSummary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/driver/summary/:routeId"
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <RouteSummary />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/driver/incidents"
                element={
                  <ProtectedRoute allowedRoles={['driver']}>
                    <DriverIncidents />
                  </ProtectedRoute>
                }
              />

              {/* Student Routes (without Layout) */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/progress"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentProgress />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/assignments"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentAssignments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/assignments/:id"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentAssignments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/student/wellbeing"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <SilentWellbeingCheckin />
                  </ProtectedRoute>
                }
              />

              {/* Super Admin Routes (without Layout) */}
              <Route
                path="/super-admin"
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin/schools"
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <SuperAdminSchools />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin/analytics"
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <SuperAdminAnalytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin/compliance"
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <SuperAdminCompliance />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/super-admin/broadcast"
                element={
                  <ProtectedRoute allowedRoles={['super_admin']}>
                    <SuperAdminBroadcast />
                  </ProtectedRoute>
                }
              />

              {/* Government/Authority Routes (without Layout) */}
              <Route
                path="/government"
                element={
                  <ProtectedRoute allowedRoles={['government_admin', 'authority_admin', 'super_admin']}>
                    <GovernmentDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/government/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['government_admin', 'authority_admin', 'super_admin']}>
                    <GovernmentDashboard />
                  </ProtectedRoute>
                }
              />

              {/* Staff Routes (separate from Layout) */}
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

            </Routes>
          </Suspense>
          <Toaster position="top-center" />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App

