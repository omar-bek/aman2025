import { useState } from 'react'
import { useQuery } from 'react-query'
import {
  CheckCircle2,
  XCircle,
  Clock,
  User,
  FileText,
  Eye,
  Lock,
  Filter,
  Search,
  AlertCircle,
} from 'lucide-react'
import apiClient from '../../../api/client'
import StatusIndicator from './StatusIndicator'
import SLACountdown from './SLACountdown'

type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'expired'
type ApprovalType = 'dismissal' | 'absence' | 'activity' | 'other'

export default function ApprovalsQueue() {
  const [selectedStatus, setSelectedStatus] = useState<ApprovalStatus | 'all'>('all')
  const [selectedType, setSelectedType] = useState<ApprovalType | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')

  const { data: approvals, isLoading } = useQuery(
    'command-center-approvals',
    async () => {
      try {
        const response = await apiClient.get('/admin/command-center/approvals')
        return response.data
      } catch (error) {
        // Mock data
        return [
          {
            id: 1,
            type: 'dismissal' as ApprovalType,
            title: 'طلب خروج مبكر',
            titleEn: 'Early Dismissal Request',
            student: 'أحمد محمد علي',
            grade: 'الصف الثالث',
            class: 'أ',
            requestedBy: 'والدة الطالب',
            requestedAt: '2024-01-15T08:00:00',
            status: 'pending' as ApprovalStatus,
            slaDeadline: '2024-01-15T10:00:00',
            timeRemaining: 45, // minutes
            priority: 'high' as const,
            assignedTo: 'أ. أحمد محمد',
            canApprove: true,
            canReject: true,
            isClosed: false,
            reason: 'موعد طبي',
            auditTrail: [
              {
                action: 'تم الإنشاء',
                user: 'والدة الطالب',
                timestamp: '2024-01-15T08:00:00',
              },
            ],
          },
          {
            id: 2,
            type: 'absence' as ApprovalType,
            title: 'طلب غياب',
            titleEn: 'Absence Request',
            student: 'فاطمة خالد',
            grade: 'الصف الخامس',
            class: 'ب',
            requestedBy: 'والد الطالب',
            requestedAt: '2024-01-15T07:30:00',
            status: 'pending' as ApprovalStatus,
            slaDeadline: '2024-01-15T11:30:00',
            timeRemaining: 120,
            priority: 'medium' as const,
            assignedTo: 'أ. فاطمة علي',
            canApprove: true,
            canReject: true,
            isClosed: false,
            reason: 'سفر عائلي',
            auditTrail: [
              {
                action: 'تم الإنشاء',
                user: 'والد الطالب',
                timestamp: '2024-01-15T07:30:00',
              },
            ],
          },
          {
            id: 3,
            type: 'activity' as ApprovalType,
            title: 'طلب مشاركة في نشاط',
            titleEn: 'Activity Participation Request',
            student: 'محمد سعيد',
            grade: 'الصف الثاني',
            class: 'ج',
            requestedBy: 'والدة الطالب',
            requestedAt: '2024-01-14T15:00:00',
            status: 'approved' as ApprovalStatus,
            slaDeadline: '2024-01-15T15:00:00',
            timeRemaining: 0,
            priority: 'low' as const,
            assignedTo: 'أ. خالد حسن',
            canApprove: false,
            canReject: false,
            isClosed: true,
            reason: 'مشاركة في مسابقة',
            approvedBy: 'أ. خالد حسن',
            approvedAt: '2024-01-14T16:30:00',
            auditTrail: [
              {
                action: 'تم الإنشاء',
                user: 'والدة الطالب',
                timestamp: '2024-01-14T15:00:00',
              },
              {
                action: 'تم الموافقة',
                user: 'أ. خالد حسن',
                timestamp: '2024-01-14T16:30:00',
              },
            ],
          },
        ]
      }
    }
  )

  const typeLabels = {
    dismissal: { ar: 'خروج مبكر', en: 'Early Dismissal' },
    absence: { ar: 'غياب', en: 'Absence' },
    activity: { ar: 'نشاط', en: 'Activity' },
    other: { ar: 'أخرى', en: 'Other' },
  }

  const statusConfig = {
    pending: { label: 'في الانتظار', color: 'warning' },
    approved: { label: 'موافق عليه', color: 'safe' },
    rejected: { label: 'مرفوض', color: 'error' },
    expired: { label: 'منتهي الصلاحية', color: 'error' },
  }

  const approvalsList = Array.isArray(approvals) ? approvals : []

  const filteredApprovals = approvalsList.filter((approval: any) => {
    if (selectedStatus !== 'all' && approval.status !== selectedStatus) return false
    if (selectedType !== 'all' && approval.type !== selectedType) return false
    if (
      searchQuery &&
      !approval.student.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !approval.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false
    // Role-based filtering would be implemented here
    return true
  })

  const handleApprove = (id: number) => {
    // Implementation
    console.log('Approve', id)
  }

  const handleReject = (id: number) => {
    // Implementation
    console.log('Reject', id)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  const pendingCount = filteredApprovals.filter((a: any) => a.status === 'pending').length

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-card-lg p-4 shadow-card border-l-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">في الانتظار</p>
              <p className="text-2xl font-bold text-gray-900">{pendingCount}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
        </div>
        <div className="bg-white rounded-card-lg p-4 shadow-card border-l-4 border-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">موافق عليه</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredApprovals.filter((a: any) => a.status === 'approved').length}
              </p>
            </div>
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
        <div className="bg-white rounded-card-lg p-4 shadow-card border-l-4 border-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">مرفوض</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredApprovals.filter((a: any) => a.status === 'rejected').length}
              </p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-card-lg p-4 shadow-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <option value="pending">في الانتظار</option>
            <option value="approved">موافق عليه</option>
            <option value="rejected">مرفوض</option>
            <option value="expired">منتهي الصلاحية</option>
          </select>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-4 py-2 bg-sand-50 border border-gray-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">جميع الأنواع</option>
            <option value="dismissal">خروج مبكر</option>
            <option value="absence">غياب</option>
            <option value="activity">نشاط</option>
            <option value="other">أخرى</option>
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 bg-sand-50 border border-gray-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="all">جميع الأدوار</option>
            <option value="admin">إدارة</option>
            <option value="teacher">مدرس</option>
            <option value="staff">موظف</option>
          </select>
        </div>
      </div>

      {/* SLA Countdowns for Pending */}
      {pendingCount > 0 && (
        <div className="bg-white rounded-card-lg p-6 shadow-card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">موافقات عاجلة (SLA)</h3>
          <div className="space-y-3">
            {filteredApprovals
              .filter((a: any) => a.status === 'pending' && a.timeRemaining < 120)
              .map((approval: any) => (
                <SLACountdown
                  key={approval.id}
                  id={approval.id}
                  title={approval.title}
                  priority={approval.priority}
                  timeRemaining={approval.timeRemaining}
                  assignedTo={approval.assignedTo || 'غير مخصص'}
                  status="pending"
                />
              ))}
          </div>
        </div>
      )}

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.length > 0 ? (
          filteredApprovals.map((approval: any) => {
            const status = statusConfig[approval.status as keyof typeof statusConfig]
            const typeLabel = typeLabels[approval.type as keyof typeof typeLabels]

            return (
              <div
                key={approval.id}
                className={`
                  bg-white rounded-card-lg p-6 shadow-card border-2
                  ${approval.isClosed ? 'border-gray-200 opacity-75' : 'border-gray-200'}
                `}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-5 h-5 text-teal-600" />
                      <h3 className="text-lg font-bold text-gray-900">{approval.title}</h3>
                      <span className="text-sm text-gray-500">({approval.titleEn})</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <StatusIndicator
                        status={status.color as any}
                        label={status.label}
                        showIcon
                      />
                      <span className="text-sm text-gray-600">
                        {typeLabel.ar} ({typeLabel.en})
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700">
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
                      {approval.assignedTo && (
                        <div>
                          <span className="text-gray-500">مخصص لـ:</span>
                          <span className="mr-2 font-medium">{approval.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  {approval.isClosed && (
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Lock className="w-4 h-4" />
                      <span>مغلق</span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      <span>طلب بواسطة:</span>
                      <span className="mr-2 font-medium">{approval.requestedBy}</span>
                      <span className="text-gray-400">
                        {new Date(approval.requestedAt).toLocaleString('ar-AE')}
                      </span>
                    </div>
                    {approval.status === 'pending' && approval.timeRemaining > 0 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span className="font-medium text-amber-700">
                          {Math.floor(approval.timeRemaining / 60)}س{' '}
                          {approval.timeRemaining % 60}د متبقي
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Audit Trail */}
                  {Array.isArray(approval.auditTrail) && approval.auditTrail.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="text-xs font-medium text-gray-700">سجل التدقيق</span>
                      </div>
                      <div className="space-y-1">
                      {(approval.auditTrail || []).map((entry: any, idx: number) => (
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
                  {!approval.isClosed && approval.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                      {approval.canApprove && (
                        <button
                          onClick={() => handleApprove(approval.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-card text-sm font-medium hover:bg-emerald-100 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>موافقة</span>
                        </button>
                      )}
                      {approval.canReject && (
                        <button
                          onClick={() => handleReject(approval.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-card text-sm font-medium hover:bg-red-100 transition-colors"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>رفض</span>
                        </button>
                      )}
                      <button className="flex items-center gap-2 px-4 py-2 bg-teal-50 text-teal-700 rounded-card text-sm font-medium hover:bg-teal-100 transition-colors">
                        <Eye className="w-4 h-4" />
                        <span>عرض التفاصيل</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        ) : (
          <div className="bg-white rounded-card-lg p-12 text-center shadow-card">
            <CheckCircle2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">لا توجد موافقات مطابقة للبحث</p>
          </div>
        )}
      </div>
    </div>
  )
}

