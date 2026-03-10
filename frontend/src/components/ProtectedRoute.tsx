import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Normalize role to string (handle enum objects)
  let userRole: string
  if (typeof user.role === 'string') {
    userRole = user.role
  } else if (user.role && typeof user.role === 'object' && 'value' in user.role) {
    userRole = (user.role as any).value
  } else {
    userRole = String(user.role)
  }

  // If specific roles are required, check user role
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect based on role
    const roleRedirects: Record<string, string> = {
      parent: '/parent',
      teacher: '/teacher',
      admin: '/admin',
      driver: '/driver',
      student: '/student',
      super_admin: '/super-admin',
      staff: '/staff', // Staff uses dedicated staff dashboard
      government_admin: '/government', // Government/Authority Admin
      authority_admin: '/government', // Authority Admin
    }
    const redirectPath = roleRedirects[userRole] || '/'
    console.log('ProtectedRoute: Redirecting', userRole, 'to', redirectPath) // Debug log
    return <Navigate to={redirectPath} replace />
  }

  return <>{children}</>
}

