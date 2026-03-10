import { useAuth } from '../context/AuthContext'
import { User } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الملف الشخصي</h1>
        <p className="text-gray-600 mt-2">معلومات المستخدم</p>
      </div>

      <div className="card max-w-2xl">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="text-primary-600" size={40} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
            <p className="text-gray-600 capitalize">{user?.role}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البريد الإلكتروني</label>
            <p className="text-gray-900">{user?.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">رقم الهاتف</label>
            <p className="text-gray-900">{user?.phone || 'غير محدد'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
