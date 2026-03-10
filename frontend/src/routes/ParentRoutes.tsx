import { Route } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
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
} from '../pages/parent'
import { AIGuidance } from '../pages/shared'

export function ParentRoutes() {
  return (
    <>
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/child/:id"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ChildDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/child/:id"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ChildDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/child/:id/map"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <LiveMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/child/:id/map"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <LiveMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/map"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <LiveMap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/messages"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <Messages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/profile"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/notifications"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentNotifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/activity"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentActivity />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/status"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <TodayStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/route"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <RouteTimeline />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/route/:childId"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <RouteTimeline />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/digest"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <DailyDigest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/requests"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <RequestsApprovals />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/requests/:id"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <RequestDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/requests/new"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <NewRequest />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/concerns"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ConcernsEscalations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/concerns/:id"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ConcernDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/concerns/new"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <NewConcern />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ai-guidance/:student_id"
        element={
          <ProtectedRoute allowedRoles={['parent', 'teacher', 'admin']}>
            <AIGuidance />
          </ProtectedRoute>
        }
      />
    </>
  )
}

