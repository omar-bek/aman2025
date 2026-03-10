import { useQuery } from 'react-query'
import { useAuthStore } from '../../store/authStore'
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  FileText,
  Eye,
  Search,
  Filter,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/client'

export default function AdminApprovals() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data: approvals, isLoading } = useQuery(
    'admin-approvals',
    async () => {
      try {
        const response = await apiClient.get('/admin/approvals')
        return response.data
      } catch (error) {
        // Mock data
        return [
          {
            id: 1,
            type: 'dismissal',
            title: 'طلب خروج مبكر',
            student: 'أحمد محمد علي',
            grade: 'الصف الثالث',
            class: 'أ',
            requestedBy: 'والدة الطالب',
            requestedAt: '2024-01-15T08:00:00',
            status: 'pending',
            reason: 'موعد طبي',
          },
          {
            id: 2,
            type: 'absence',
            title: 'طلب غياب',
            student: 'فاطمة خالد',
            grade: 'الصف الخامس',
            class: 'ب',
            requestedBy: 'والد الطالب',
            requestedAt: '2024-01-15T07:30:00',
            status: 'pending',
            reason: 'سفر عائلي',
          },
        ]
      }
    }
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">إدارة الموافقات</h1>
              <p className="text-white/90">مرحباً، {user?.full_name}</p>
            </div>
            <button
              onClick={() => navigate('/admin')}
              className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
            >
              العودة للوحة التحكم
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">الموافقات المعلقة</h2>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="بحث..."
                  className="pr-10 pl-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select className="px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                <option value="all">جميع الحالات</option>
                <option value="pending">في الانتظار</option>
                <option value="approved">موافق عليه</option>
                <option value="rejected">مرفوض</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {(approvals || []).map((approval: any) => (
              <div
                key={approval.id}
                className="border-2 border-gray-200 rounded-xl p-6 hover:border-primary-400 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <FileText className="w-5 h-5 text-primary-600" />
                      <h3 className="text-lg font-bold text-gray-900">{approval.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          approval.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700'
                            : approval.status === 'approved'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {approval.status === 'pending'
                          ? 'في الانتظار'
                          : approval.status === 'approved'
                          ? 'موافق عليه'
                          : 'مرفوض'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>
                        <span className="text-gray-500">الطالب:</span>
                        <span className="mr-2 font-medium">{approval.student}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">الصف:</span>
                        <span className="mr-2 font-medium">
                          {approval.grade} - {approval.class}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">السبب:</span>
                        <span className="mr-2 font-medium">{approval.reason}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">طلب بواسطة:</span>
                        <span className="mr-2 font-medium">{approval.requestedBy}</span>
                      </div>
                    </div>
                  </div>
                  {approval.status === 'pending' && (
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        موافقة
                      </button>
                      <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2">
                        <XCircle className="w-4 h-4" />
                        رفض
                      </button>
                      <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        عرض
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


