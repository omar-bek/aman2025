import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, Calendar, UserCheck, CheckCircle } from 'lucide-react'
import { RequestCard } from '../../components/parent'
import ParentBottomNav from '../../components/ParentBottomNav'
import { useQuery } from 'react-query'
import { requestsAPI } from '../../api'

type FilterTab = 'pending' | 'approved' | 'all'

export default function RequestsApprovals() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<FilterTab>('all')

  const { data: requestsArray = [] } = useQuery(['parent-requests'], () =>
    requestsAPI.getForParent(),
  )

  const filteredRequests =
    activeTab === 'all'
      ? requestsArray
      : requestsArray.filter((r) =>
          activeTab === 'pending' ? r.status === 'pending' || r.status === 'pending_teacher' || r.status === 'pending_admin' : r.status === 'approved',
        )

  const handleApprove = (_id: string) => {}

  const handleReject = (_id: string) => {}

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/parent')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowRight size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">الطلبات والموافقات</h1>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 px-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'pending'
                ? 'bg-teal-100 text-teal-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            قيد الانتظار
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'approved'
                ? 'bg-emerald-100 text-emerald-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            موافق عليه
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              activeTab === 'all'
                ? 'bg-gray-100 text-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            الكل
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد طلبات</h3>
            <p className="text-sm text-gray-600">
              {activeTab === 'pending'
                ? 'لا توجد طلبات قيد الانتظار'
                : activeTab === 'approved'
                ? 'لا توجد طلبات موافق عليها'
                : 'لا توجد طلبات بعد'}
            </p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              id={request.id}
              type={request.typeLabel}
              typeIcon={
                request.kind === 'pickup' ? (
                  <UserCheck size={20} className="text-teal-600" />
                ) : (
                  <Calendar size={20} className="text-teal-600" />
                )
              }
              childName={request.childName}
              details=""
              status={
                request.status === 'approved'
                  ? 'approved'
                  : request.status === 'rejected'
                    ? 'rejected'
                    : 'pending'
              }
              submittedAt={new Date(request.submittedAt).toLocaleString('ar-SA')}
              onApprove={undefined}
              onReject={undefined}
              onViewDetails={() => navigate(`/parent/requests/${request.id}`)}
            />
          ))
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/parent/requests/new')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full shadow-elevated flex items-center justify-center hover:from-teal-600 hover:to-teal-700 transition-all z-40"
        aria-label="New Request"
      >
        <Plus size={24} />
      </button>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}

