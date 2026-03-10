import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Search, Filter, Download, Calendar } from 'lucide-react'
import apiClient from '../../api/client'
import { format } from 'date-fns'

export default function AdminAuditLogs() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    action_type: '',
    resource_type: '',
  })

  const { data: logs } = useQuery(
    ['audit-logs', filters],
    async () => {
      const params: any = {}
      if (filters.start_date) params.start_date = filters.start_date
      if (filters.end_date) params.end_date = filters.end_date
      if (filters.action_type) params.action_type = filters.action_type
      if (filters.resource_type) params.resource_type = filters.resource_type
      
      const response = await apiClient.get('/audit/logs', { params })
      return response.data || []
    }
  )

  const { data: stats } = useQuery('audit-stats', async () => {
    const response = await apiClient.get('/audit/stats', { params: { days: 30 } })
    return response.data
  })

  const getActionColor = (action: string) => {
    switch (action) {
      case 'login':
        return 'bg-green-100 text-green-700'
      case 'logout':
        return 'bg-gray-100 text-gray-700'
      case 'create':
        return 'bg-blue-100 text-blue-700'
      case 'update':
        return 'bg-yellow-100 text-yellow-700'
      case 'delete':
        return 'bg-red-100 text-red-700'
      case 'access_denied':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getActionText = (action: string) => {
    const actionMap: Record<string, string> = {
      login: 'تسجيل دخول',
      logout: 'تسجيل خروج',
      create: 'إنشاء',
      update: 'تحديث',
      delete: 'حذف',
      view: 'عرض',
      export: 'تصدير',
      approve: 'موافقة',
      reject: 'رفض',
      access_denied: 'رفض وصول',
      data_access: 'وصول بيانات',
      data_modification: 'تعديل بيانات',
    }
    return actionMap[action] || action
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/admin')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowRight size={24} className="text-white" />
              </button>
              <Shield className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">سجل التدقيق</h1>
                <p className="text-white/90">تتبع جميع العمليات في النظام</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <p className="text-sm text-gray-600 mb-2">إجمالي السجلات (30 يوم)</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total_logs || 0}</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <p className="text-sm text-gray-600 mb-2">تسجيلات الدخول</p>
              <p className="text-3xl font-bold text-green-600">{stats.action_counts?.login || 0}</p>
            </div>
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <p className="text-sm text-gray-600 mb-2">محاولات وصول مرفوضة</p>
              <p className="text-3xl font-bold text-red-600">{stats.action_counts?.access_denied || 0}</p>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Filter className="text-primary-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">الفلاتر</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="label">من تاريخ</label>
              <input
                type="date"
                className="input-field"
                value={filters.start_date}
                onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
              />
            </div>
            <div>
              <label className="label">إلى تاريخ</label>
              <input
                type="date"
                className="input-field"
                value={filters.end_date}
                onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
              />
            </div>
            <div>
              <label className="label">نوع العملية</label>
              <select
                className="input-field"
                value={filters.action_type}
                onChange={(e) => setFilters({ ...filters, action_type: e.target.value })}
              >
                <option value="">الكل</option>
                <option value="login">تسجيل دخول</option>
                <option value="logout">تسجيل خروج</option>
                <option value="create">إنشاء</option>
                <option value="update">تحديث</option>
                <option value="delete">حذف</option>
                <option value="access_denied">رفض وصول</option>
              </select>
            </div>
            <div>
              <label className="label">نوع المورد</label>
              <input
                type="text"
                className="input-field"
                value={filters.resource_type}
                onChange={(e) => setFilters({ ...filters, resource_type: e.target.value })}
                placeholder="مثال: student, assignment"
              />
            </div>
          </div>
        </div>

        {/* Logs List */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">سجل التدقيق</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {logs?.map((log: any) => (
              <div
                key={log.id}
                className="p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-primary-300 transition-all"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getActionColor(log.action_type.value)}`}>
                        {getActionText(log.action_type.value)}
                      </span>
                      <span className="text-sm text-gray-600">{log.resource_type}</span>
                      {log.resource_id && (
                        <span className="text-sm text-gray-500">ID: {log.resource_id}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-900 font-medium mb-1">{log.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>{log.user?.full_name || 'Unknown'}</span>
                      <span>{format(new Date(log.created_at), 'dd MMM yyyy - HH:mm')}</span>
                      {log.ip_address && <span>IP: {log.ip_address}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {(!logs || logs.length === 0) && (
              <div className="text-center py-12 text-gray-500">
                <Shield className="mx-auto mb-4 text-gray-400" size={48} />
                <p>لا توجد سجلات</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

