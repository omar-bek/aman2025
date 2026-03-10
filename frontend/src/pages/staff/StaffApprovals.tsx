import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ClipboardList, CheckCircle, XCircle, Clock, User, Phone, Calendar, FileText, AlertCircle, Eye } from 'lucide-react'
import { staffAPI, PickupRequestDetail, DismissalRequestDetail } from '../../api'
import toast from 'react-hot-toast'
import { format, parseISO } from 'date-fns'

export default function StaffApprovals() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [activeTab, setActiveTab] = useState<'pickup' | 'dismissal'>('pickup')
  const [selectedRequest, setSelectedRequest] = useState<PickupRequestDetail | DismissalRequestDetail | null>(null)

  // Fetch pickup requests
  const { data: pickupRequests, isLoading: pickupLoading } = useQuery(
    ['pickup-requests', 'pending'],
    () => staffAPI.getPickupRequests('pending'),
    { retry: false }
  )

  // Fetch dismissal requests
  const { data: dismissalRequests, isLoading: dismissalLoading } = useQuery(
    ['dismissal-requests', 'pending'],
    () => staffAPI.getDismissalRequests('pending'),
    { retry: false }
  )

  // Approve pickup mutation
  const approvePickup = useMutation(
    async (requestId: number) => {
      const response = await staffAPI.performPickupAction(requestId, { action: 'approve' })
      return response
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pickup-requests')
        toast.success('تم الموافقة على طلب الاستلام بنجاح')
        setSelectedRequest(null)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل الموافقة على الطلب')
      }
    }
  )

  // Reject pickup mutation
  const rejectPickup = useMutation(
    async ({ requestId, reason }: { requestId: number; reason?: string }) => {
      const response = await staffAPI.performPickupAction(requestId, { action: 'reject', reason })
      return response
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pickup-requests')
        toast.success('تم رفض طلب الاستلام')
        setSelectedRequest(null)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل رفض الطلب')
      }
    }
  )

  // Approve dismissal mutation
  const approveDismissal = useMutation(
    async (requestId: number) => {
      const response = await staffAPI.performDismissalAction(requestId, { action: 'approve' })
      return response
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dismissal-requests')
        toast.success('تم الموافقة على طلب المغادرة بنجاح')
        setSelectedRequest(null)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل الموافقة على الطلب')
      }
    }
  )

  // Reject dismissal mutation
  const rejectDismissal = useMutation(
    async ({ requestId, reason }: { requestId: number; reason?: string }) => {
      const response = await staffAPI.performDismissalAction(requestId, { action: 'reject', reason })
      return response
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('dismissal-requests')
        toast.success('تم رفض طلب المغادرة')
        setSelectedRequest(null)
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل رفض الطلب')
      }
    }
  )

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'في الانتظار' },
      approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'موافق' },
      teacher_approved: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'موافق من المدرس' },
      admin_approved: { bg: 'bg-green-100', text: 'text-green-700', label: 'موافق من الإدارة' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'مرفوض' },
    }
    const config = statusConfig[status] || statusConfig.pending
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/staff')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowRight size={24} className="text-white" />
              </button>
              <ClipboardList className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">الموافقات والعمليات</h1>
                <p className="text-white/90">مراجعة والموافقة على طلبات الاستلام والمغادرة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 border-2 border-gray-200 shadow-lg">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('pickup')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'pickup'
                  ? 'bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              طلبات الاستلام
              {pickupRequests && pickupRequests.length > 0 && (
                <span className="mr-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                  {pickupRequests.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('dismissal')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                activeTab === 'dismissal'
                  ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              طلبات المغادرة
              {dismissalRequests && dismissalRequests.length > 0 && (
                <span className="mr-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                  {dismissalRequests.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Requests List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Requests */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">
              {activeTab === 'pickup' ? 'طلبات الاستلام' : 'طلبات المغادرة'}
            </h2>
            
            {activeTab === 'pickup' ? (
              pickupLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">جاري التحميل...</p>
                </div>
              ) : pickupRequests && pickupRequests.length > 0 ? (
                pickupRequests.map((request) => (
                  <div
                    key={request.id}
                    className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                      selectedRequest?.id === request.id ? 'ring-4 ring-primary-400 border-primary-400' : ''
                    }`}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{request.student_name}</h3>
                        <p className="text-sm text-gray-600">والد: {request.parent_name}</p>
                      </div>
                      {getStatusBadge(request.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <User size={16} />
                        <span>المستلم: {request.recipient_name}</span>
                      </div>
                      {request.recipient_relation && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <span>صلة القرابة: {request.recipient_relation}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar size={16} />
                        <span>{format(parseISO(request.pickup_date), 'yyyy-MM-dd')}</span>
                        <span>•</span>
                        <Clock size={16} />
                        <span>{format(parseISO(request.pickup_time), 'HH:mm')}</span>
                      </div>
                      {request.reason && (
                        <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500 mb-1">السبب:</p>
                          <p className="text-sm text-gray-700">{request.reason}</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          approvePickup.mutate(request.id)
                        }}
                        disabled={approvePickup.isLoading}
                        className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition-colors disabled:opacity-50"
                      >
                        موافقة
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const reason = prompt('يرجى إدخال سبب الرفض (اختياري):')
                          if (reason !== null) {
                            rejectPickup.mutate({ requestId: request.id, reason: reason || undefined })
                          }
                        }}
                        disabled={rejectPickup.isLoading}
                        className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold transition-colors disabled:opacity-50"
                      >
                        رفض
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
                  <ClipboardList className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">لا توجد طلبات استلام معلقة</p>
                </div>
              )
            ) : dismissalLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">جاري التحميل...</p>
              </div>
            ) : dismissalRequests && dismissalRequests.length > 0 ? (
              dismissalRequests.map((request) => (
                <div
                  key={request.id}
                  className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                    selectedRequest?.id === request.id ? 'ring-4 ring-primary-400 border-primary-400' : ''
                  }`}
                  onClick={() => setSelectedRequest(request)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{request.student_name}</h3>
                      <p className="text-sm text-gray-600">والد: {request.parent_name}</p>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>{format(parseISO(request.dismissal_date), 'yyyy-MM-dd')}</span>
                      <span>•</span>
                      <Clock size={16} />
                      <span>{format(parseISO(request.dismissal_time), 'HH:mm')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText size={16} />
                      <span>نوع السبب: {request.reason_type}</span>
                    </div>
                    {request.reason_details && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-500 mb-1">تفاصيل السبب:</p>
                        <p className="text-sm text-gray-700">{request.reason_details}</p>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        approveDismissal.mutate(request.id)
                      }}
                      disabled={approveDismissal.isLoading}
                      className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold transition-colors disabled:opacity-50"
                    >
                      موافقة
                    </button>
                    <button
                        onClick={(e) => {
                          e.stopPropagation()
                          const reason = prompt('يرجى إدخال سبب الرفض (اختياري):')
                          if (reason !== null) {
                            rejectDismissal.mutate({ requestId: request.id, reason: reason || undefined })
                          }
                        }}
                      disabled={rejectDismissal.isLoading}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold transition-colors disabled:opacity-50"
                    >
                      رفض
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
                <ClipboardList className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">لا توجد طلبات مغادرة معلقة</p>
              </div>
            )}
          </div>

          {/* Request Details Sidebar */}
          {selectedRequest && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">تفاصيل الطلب</h2>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {activeTab === 'pickup' && 'recipient_name' in selectedRequest && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">الطالب</p>
                    <p className="text-lg font-bold text-gray-900">{selectedRequest.student_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ولي الأمر</p>
                    <p className="text-lg font-bold text-gray-900">{selectedRequest.parent_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">المستلم</p>
                    <p className="text-lg font-bold text-gray-900">{selectedRequest.recipient_name}</p>
                    {selectedRequest.recipient_relation && (
                      <p className="text-sm text-gray-600">صلة القرابة: {selectedRequest.recipient_relation}</p>
                    )}
                    {selectedRequest.recipient_phone && (
                      <p className="text-sm text-gray-600 flex items-center gap-2 mt-1">
                        <Phone size={16} />
                        {selectedRequest.recipient_phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تاريخ ووقت الاستلام</p>
                    <p className="text-lg font-bold text-gray-900">
                      {format(parseISO(selectedRequest.pickup_date), 'yyyy-MM-dd')} في{' '}
                      {format(parseISO(selectedRequest.pickup_time), 'HH:mm')}
                    </p>
                  </div>
                  {selectedRequest.reason && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">السبب</p>
                      <p className="text-gray-900">{selectedRequest.reason}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تاريخ الطلب</p>
                    <p className="text-gray-900">{format(parseISO(selectedRequest.created_at), 'yyyy-MM-dd HH:mm')}</p>
                  </div>
                </div>
              )}

              {activeTab === 'dismissal' && 'dismissal_date' in selectedRequest && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">الطالب</p>
                    <p className="text-lg font-bold text-gray-900">{selectedRequest.student_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">ولي الأمر</p>
                    <p className="text-lg font-bold text-gray-900">{selectedRequest.parent_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تاريخ ووقت المغادرة</p>
                    <p className="text-lg font-bold text-gray-900">
                      {format(parseISO(selectedRequest.dismissal_date), 'yyyy-MM-dd')} في{' '}
                      {format(parseISO(selectedRequest.dismissal_time), 'HH:mm')}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">نوع السبب</p>
                    <p className="text-gray-900">{selectedRequest.reason_type}</p>
                  </div>
                  {selectedRequest.reason_details && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">تفاصيل السبب</p>
                      <p className="text-gray-900">{selectedRequest.reason_details}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600 mb-1">تاريخ الطلب</p>
                    <p className="text-gray-900">{format(parseISO(selectedRequest.created_at), 'yyyy-MM-dd HH:mm')}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

