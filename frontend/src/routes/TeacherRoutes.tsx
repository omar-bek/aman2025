import { Route } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
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
} from '../pages/teacher'
import { TeacherWorkloadReduction } from '../pages/shared'

export function TeacherRoutes() {
  return (
    <>
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/assignments"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherAssignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/assignments/new"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherAssignments />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/evaluations"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherEvaluations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/evaluations/new"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherEvaluationNew />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/evaluations/:id"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherEvaluationDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherStudents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students/:id"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherStudentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/messages"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherMessages />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/announcements"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherAnnouncements />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherAttendance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/exams"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherExams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/insights"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <ClassInsights />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/notes"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <StudentNotes />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/notifications"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <NotificationsSummary />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/workload-reduction"
        element={
          <ProtectedRoute allowedRoles={['teacher', 'admin']}>
            <TeacherWorkloadReduction />
          </ProtectedRoute>
        }
      />
    </>
  )
}

