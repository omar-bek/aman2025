import { useNavigate, useLocation } from 'react-router-dom'
import { Shield, Map, FileText, CheckCircle, AlertCircle, User } from 'lucide-react'

export default function ParentBottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path: string) => {
    if (path === '/parent') {
      return location.pathname === '/parent' || location.pathname === '/parent/dashboard'
    }
    if (path === '/parent/profile') {
      return location.pathname === '/parent/profile' || location.pathname.startsWith('/parent/profile')
    }
    return location.pathname.startsWith(path)
  }

  const navItems = [
    { path: '/parent', label: 'الرئيسية', labelEn: 'Dashboard', icon: Shield },
    { path: '/parent/route', label: 'المسار', labelEn: 'Route', icon: Map },
    { path: '/parent/digest', label: 'الملخص', labelEn: 'Digest', icon: FileText },
    { path: '/parent/requests', label: 'الطلبات', labelEn: 'Requests', icon: CheckCircle },
    { path: '/parent/concerns', label: 'المخاوف', labelEn: 'Concerns', icon: AlertCircle },
    { path: '/parent/profile', label: 'الملف الشخصي', labelEn: 'Profile', icon: User },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t-2 border-gray-200 shadow-elevated px-2 py-3 z-50">
      <div className="grid grid-cols-6 gap-1">
        {navItems.map((item) => {
          const active = isActive(item.path)
          const Icon = item.icon
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                active ? 'text-teal-600' : 'text-gray-500 hover:text-teal-600'
              }`}
              aria-label={item.labelEn}
            >
              {active ? (
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-card hover:shadow-elevated transition-all">
                  <Icon size={18} className="text-white" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-teal-50 transition-colors">
                  <Icon size={18} />
                </div>
              )}
              <span className={`text-[10px] leading-tight ${active ? 'font-bold' : ''}`}>{item.label}</span>
              {active && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-teal-600 rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
