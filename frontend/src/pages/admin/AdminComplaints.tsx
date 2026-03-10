import { useQuery } from 'react-query'
import { useAuthStore } from '../../store/authStore'
import {
  AlertCircle,
  User,
  FileText,
  Eye,
  Search,
  Filter,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../../api/client'

export default function AdminComplaints() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const { data: complaints, isLoading } = useQuery(
    'admin-complaints',
    async () => {
      try {
        const response = await apiClient.get('/admin/complaints')
        return response.data
      } catch (error) {
        // Mock data
        return [
          {
            id: 1,
            title: 'شكوى بخصوص سلوك طالب',
            description: 'مشكلة سلوكية في الفصل الدراسي',
            reportedBy: 'أ. فاطمة علي',
            reportedAt: '2024-01-15T09:15:00',
            status: 'open',
            severity: 'high',
            student: 'أحمد محمد',
            grade: 'الصف الثالث',
          },
          {
            id: 2,
            title: 'شكوى بخصوص تأخير الحافلة',
            description: 'تأخرت الحافلة عن الوصول',
            reportedBy: 'والدة الطالب',
            reportedAt: '2024-01-15T08:30:00',
            status: 'in-progress',
            severity: 'medium',
            student: 'سارة أحمد',
            grade: 'الصف الثاني',
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
              <h1 className="text-3xl font-bold text-white mb-2">إدارة الشكاوى</h1>
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
            <h2 className="text-xl font-bold text-gray-900">الشكاوى</h2>
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
                <option value="open">مفتوح</option>
                <option value="in-progress">قيد المعالجة</option>
                <option value="resolved">تم الحل</option>
              </select>
            </div>
          </div>

          <div className="space-y-4">
            {(complaints || []).map((complaint: any) => (
              <div
                key={complaint.id}
                className={`border-2 rounded-xl p-6 transition-all ${
                  complaint.severity === 'high'
                    ? 'border-red-300 bg-red-50'
                    : complaint.severity === 'medium'
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <AlertCircle
                        className={`w-5 h-5 ${
                          complaint.severity === 'high'
                            ? 'text-red-600'
                            : complaint.severity === 'medium'
                            ? 'text-yellow-600'
                            : 'text-gray-600'
                        }`}
                      />
                      <h3 className="text-lg font-bold text-gray-900">{complaint.title}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          complaint.status === 'open'
                            ? 'bg-blue-100 text-blue-700'
                            : complaint.status === 'in-progress'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {complaint.status === 'open'
                          ? 'مفتوح'
                          : complaint.status === 'in-progress'
                          ? 'قيد المعالجة'
                          : 'تم الحل'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-4">{complaint.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                      <div>
                        <span className="text-gray-500">الطالب:</span>
                        <span className="mr-2 font-medium">{complaint.student}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">الصف:</span>
                        <span className="mr-2 font-medium">{complaint.grade}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">تم الإبلاغ بواسطة:</span>
                        <span className="mr-2 font-medium">{complaint.reportedBy}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">التاريخ:</span>
                        <span className="mr-2 font-medium">
                          {new Date(complaint.reportedAt).toLocaleDateString('ar-AE')}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      عرض
                    </button>
                    {complaint.status !== 'resolved' && (
                      <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        حل
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}


