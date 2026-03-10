import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Bell, Home, Users, Bus, Calendar, BookOpen, Activity, User, LogOut } from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout, isParent, isTeacher, isAdmin, isStaff, isDriver } = useAuth()

  const menuItems = [
    { path: '/', icon: Home, label: 'الرئيسية', roles: ['parent', 'teacher', 'admin', 'staff', 'driver'] },
    { path: '/students', icon: Users, label: 'الطلاب', roles: ['parent', 'teacher', 'admin', 'staff'] },
    { path: '/buses', icon: Bus, label: 'الحافلات', roles: ['parent', 'admin', 'driver'] },
    { path: '/attendance', icon: Calendar, label: 'الحضور', roles: ['parent', 'teacher', 'admin', 'staff'] },
    { path: '/pickup', icon: Users, label: 'الاستلام', roles: ['parent', 'admin', 'staff'] },
    { path: '/dismissal', icon: Calendar, label: 'المغادرة', roles: ['parent', 'teacher', 'admin', 'staff'] },
    { path: '/academic', icon: BookOpen, label: 'الأكاديمي', roles: ['parent', 'teacher', 'admin'] },
    { path: '/behavior', icon: Activity, label: 'السلوك', roles: ['parent', 'teacher', 'admin', 'staff'] },
    { path: '/activities', icon: Activity, label: 'الأنشطة', roles: ['parent', 'teacher', 'admin', 'staff'] },
    { path: '/notifications', icon: Bell, label: 'الإشعارات', roles: ['parent', 'teacher', 'admin', 'staff', 'driver'] },
  ]

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.some(role => {
      if (role === 'parent') return isParent
      if (role === 'teacher') return isTeacher
      if (role === 'admin') return isAdmin
      if (role === 'staff') return isStaff
      if (role === 'driver') return isDriver
      return false
    })
  )

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-primary-600">أمانتاك</h1>
          <p className="text-sm text-gray-600 mt-1">نظام إدارة المدرسة</p>
        </div>
        
        <nav className="mt-6">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-primary-50 hover:text-primary-600 transition-colors ${
                  isActive ? 'bg-primary-50 text-primary-600 border-r-4 border-primary-600' : ''
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-64 p-4 border-t bg-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User size={20} className="text-primary-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link
              to="/profile"
              className="flex-1 btn btn-secondary text-sm py-2"
            >
              الملف الشخصي
            </Link>
            <button
              onClick={logout}
              className="flex-1 btn btn-danger text-sm py-2 flex items-center justify-center gap-2"
            >
              <LogOut size={16} />
              خروج
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}

export default Layout
