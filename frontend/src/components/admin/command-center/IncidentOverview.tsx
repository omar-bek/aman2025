import { useState } from 'react'
import { useQuery } from 'react-query'
import {
  AlertTriangle,
  Clock,
  User,
  FileText,
  Eye,
  Lock,
  Filter,
  Search,
  Calendar,
  ChevronLeft,
} from 'lucide-react'
import apiClient from '../../../api/client'
import StatusIndicator from './StatusIndicator'

type IncidentStatus = 'open' | 'in-progress' | 'resolved' | 'closed'
type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'

export default function IncidentOverview() {
  const [selectedStatus, setSelectedStatus] = useState<IncidentStatus | 'all'>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<IncidentSeverity | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: incidents, isLoading } = useQuery(
    'command-center-incidents',
    async () => {
      try {
        const response = await apiClient.get('/admin/command-center/incidents')
        return response.data
      } catch (error) {
        // Mock data
        return [
          {
            id: 1,
            title: 'تأخير في وصول حافلة',
            titleEn: 'Bus Arrival Delay',
            description: 'تأخرت حافلة رقم 12 عن الوصول بـ 15 دقيقة',
            severity: 'medium' as IncidentSeverity,
            status: 'in-progress' as IncidentStatus,
            reportedBy: 'أ. فاطمة علي',
            reportedAt: '2024-01-15T08:30:00',
            assignedTo: 'أ. أحمد محمد',
            grade: 'الصف الثالث',
            class: 'أ',
            canEdit: true,
            isClosed: false,
            auditTrail: [
              { action: 'تم الإنشاء', user: 'أ. فاطمة علي', timestamp: '2024-01-15T08:30:00' },
              { action: 'تم التخصيص', user: 'أ. أحمد محمد', timestamp: '2024-01-15T08:35:00' },
            ],
          },
          {
            id: 2,
            title: 'سلوك غير لائق',
            titleEn: 'Inappropriate Behavior',
            description: 'مشكلة سلوكية في الفصل الدراسي',
            severity: 'high' as IncidentSeverity,
            status: 'open' as IncidentStatus,
            reportedBy: 'أ. خالد حسن',
            reportedAt: '2024-01-15T09:15:00',
            assignedTo: null,
            grade: 'الصف الخامس',
            class: 'ب',
            canEdit: true,
            isClosed: false,
            auditTrail: [
              { action: 'تم الإنشاء', user: 'أ. خالد حسن', timestamp: '2024-01-15T09:15:00' },
            ],
          },
          {
            id: 3,
            title: 'غياب غير مبرر',
            titleEn: 'Unexcused Absence',
            description: 'طالب متغيب بدون إشعار',
            severity: 'low' as IncidentSeverity,
            status: 'resolved' as IncidentStatus,
            reportedBy: 'أ. سارة أحمد',
            reportedAt: '2024-01-15T07:45:00',
            assignedTo: 'أ. محمد علي',
            grade: 'الصف الثاني',
            class: 'ج',
            canEdit: false,
            isClosed: true,
            auditTrail: [
              { action: 'تم الإنشاء', user: 'أ. سارة أحمد', timestamp: '2024-01-15T07:45:00' },
              { action: 'تم التخصيص', user: 'أ. محمد علي', timestamp: '2024-01-15T08:00:00' },
              { action: 'تم الحل', user: 'أ. محمد علي', timestamp: '2024-01-15T10:30:00' },
              { action: 'تم الإغلاق', user: 'أ. أحمد محمد', timestamp: '2024-01-15T11:00:00' },
            ],
          },
        ]
      }
    }
  )

  const severityConfig = {
    critical: { label: 'حرج', color: 'action', bg: 'bg-red-50' },
    high: { label: 'عالي', color: 'warning', bg: 'bg-amber-50' },
    medium: { label: 'متوسط', color: 'info', bg: 'bg-blue-50' },
    low: { label: 'منخفض', color: 'safe', bg: 'bg-emerald-50' },
  }

  const statusConfig = {
    open: { label: 'مفتوح', color: 'info' },
    'in-progress': { label: 'قيد المعالجة', color: 'warning' },
    resolved: { label: 'تم الحل', color: 'safe' },
    closed: { label: 'مغلق', color: 'safe' },
  }

  const incidentsList = Array.isArray(incidents) ? incidents : []

  const filteredIncidents = incidentsList.filter((incident: any) => {
    if (selectedStatus !== 'all' && incident.status !== selectedStatus) return false
    if (selectedSeverity !== 'all' && incident.severity !== selectedSeverity) return false
    if (
      searchQuery &&
      !incident.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !incident.titleEn.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    return true
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters & Search */}
      <div className="bg-white rounded-card-lg p-4 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pr-10 pl-4 py-2 bg-sand-50 border border-gray-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as any)}
            className="px-4 py-2 bg-sand-50 border border-gray-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">جميع الحالات</option>
            <option value="open">مفتوح</option>
            <option value="in-progress">قيد المعالجة</option>
            <option value="resolved">تم الحل</option>
            <option value="closed">مغلق</option>
          </select>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as any)}
            className="px-4 py-2 bg-sand-50 border border-gray-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">جميع المستويات</option>
            <option value="critical">حرج</option>
            <option value="high">عالي</option>
            <option value="medium">متوسط</option>
            <option value="low">منخفض</option>
          </select>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {filteredIncidents.length > 0 ? (
          filteredIncidents.map((incident: any) => {
            const severity = severityConfig[incident.severity as keyof typeof severityConfig]
            const status = statusConfig[incident.status as keyof typeof statusConfig]

            return (
              <div
                key={incident.id}
                className={`
                  bg-white rounded-card-lg p-6 shadow-card border-2
                  ${incident.isClosed ? 'border-gray-200 opacity-75' : 'border-gray-200'}
                  ${incident.severity === 'critical' ? 'ring-2 ring-red-200' : ''}
                `}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle
                        className={`w-5 h-5 ${incident.severity === 'critical'
                          ? 'text-red-600'
                          : incident.severity === 'high'
                            ? 'text-amber-600'
                            : 'text-gray-600'
                          }`}
                      />
                      <h3 className="text-lg font-bold text-gray-900">{incident.title}</h3>
                      <span className="text-sm text-gray-500">({incident.titleEn})</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{incident.description}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      <StatusIndicator
                        status={severity.color as any}
                        label={severity.label}
                        showIcon
                      />
                      <StatusIndicator status={status.color as any} label={status.label} showIcon />
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <User className="w-3 h-3" />
                        <span>{incident.grade} - {incident.class}</span>
                      </div>
                    </div>
                  </div>
                  {incident.isClosed && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span>مغلق</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">تم الإبلاغ بواسطة:</span>
                      <span className="mr-2 font-medium text-gray-900">
                        {incident.reportedBy}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500">التاريخ والوقت:</span>
                      <span className="mr-2 font-medium text-gray-900">
                        {new Date(incident.reportedAt).toLocaleString('ar-AE')}
                      </span>
                    </div>
                    {incident.assignedTo && (
                      <div>
                        <span className="text-gray-500">مخصص لـ:</span>
                        <span className="mr-2 font-medium text-gray-900">
                          {incident.assignedTo}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Audit Trail */}
                  {Array.isArray(incident.auditTrail) && incident.auditTrail.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">سجل التدقيق</span>
                      </div>
                      <div className="space-y-1">
                        {incident.auditTrail.map((entry: any, idx: number) => (
                          <div
                            key={idx}
                            className="text-xs text-gray-600 flex items-center gap-2"
                          >
                            <span className="font-medium">{entry.action}</span>
                            <span>بواسطة {entry.user}</span>
                            <span className="text-gray-400">
                              {new Date(entry.timestamp).toLocaleString('ar-AE')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  {!incident.isClosed && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-card text-sm font-medium hover:bg-teal-100 transition-colors"
                        disabled={!incident.canEdit}
                      >
                        <Eye className="w-4 h-4" />
                        <span>عرض التفاصيل</span>
                      </button>
                      {incident.canEdit && (
                        <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-card text-sm font-medium hover:bg-gray-50 transition-colors">
                          تعديل
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-white rounded-card-lg p-12 text-center shadow-card">
            <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد حوادث مطابقة للبحث</p>
          </div>
        )}
      </div>
    </div>
  )
}

