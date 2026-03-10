import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, Shield, AlertTriangle, Heart } from 'lucide-react'
import { ConcernCard } from '../../components/parent'
import ParentBottomNav from '../../components/ParentBottomNav'
import { useQuery } from 'react-query'
import { concernsAPI } from '../../api'

export default function ConcernsEscalations() {
  const navigate = useNavigate()
  const [showResolved, setShowResolved] = useState(false)

  const { data: concerns = [] } = useQuery(['parent-concerns'], () => concernsAPI.getForParent())

  const mapTypeToIcon = (type: string) => {
    if (type === 'health') return <Heart size={20} className="text-teal-600" />
    if (type === 'safety') return <Shield size={20} className="text-teal-600" />
    if (type === 'academic') return <AlertTriangle size={20} className="text-teal-600" />
    if (type === 'behavior') return <AlertTriangle size={20} className="text-teal-600" />
    return <Shield size={20} className="text-teal-600" />
  }

  const activeConcerns = concerns.filter((c) => c.status === 'new' || c.status === 'in_progress')
  const resolvedConcerns = concerns.filter((c) => c.status === 'resolved')

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
            <h1 className="text-xl font-bold text-gray-900">المخاوف والتكرارات</h1>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mx-4 mt-4">
        <div className="bg-teal-50 border-2 border-teal-200 rounded-card-lg p-4">
          <div className="flex items-start gap-3">
            <Shield size={24} className="text-teal-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">
                نحن هنا للمساعدة
              </p>
              <p className="text-xs text-gray-600">
                مخاوفك تؤخذ على محمل الجد. سنقوم بمراجعة ومعالجة كل قلق بسرعة.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Active Concerns */}
        {activeConcerns.length === 0 ? (
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield size={32} className="text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">لا توجد مخاوف نشطة</h3>
            <p className="text-sm text-gray-600">جميع المخاوف تم حلها</p>
          </div>
        ) : (
          <>
            <h2 className="text-lg font-bold text-gray-900">المخاوف النشطة</h2>
            {activeConcerns.map((concern) => (
              <ConcernCard
                key={concern._id}
                id={concern._id}
                type={concern.title}
                typeIcon={mapTypeToIcon(concern.type)}
                childName={concern.studentId?.name || ''}
                description={concern.description}
                status={concern.status === 'in_progress' ? 'in-progress' : 'new'}
                lastUpdate={new Date(concern.lastUpdateAt || concern.createdAt).toLocaleString('ar-SA')}
                onViewDetails={() => navigate(`/parent/concerns/${concern._id}`)}
              />
            ))}
          </>
        )}

        {/* Resolved Concerns (Collapsible) */}
        {resolvedConcerns.length > 0 && (
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-6">
            <button
              onClick={() => setShowResolved(!showResolved)}
              className="w-full flex items-center justify-between mb-4"
            >
              <h2 className="text-lg font-bold text-gray-900">المخاوف المحلولة</h2>
              <span className="text-sm text-gray-600">
                {showResolved ? 'إخفاء' : 'عرض'} ({resolvedConcerns.length})
              </span>
            </button>
            {showResolved && (
              <div className="space-y-4">
                {resolvedConcerns.map((concern) => (
                  <ConcernCard
                    key={concern._id}
                    id={concern._id}
                    type={concern.title}
                    typeIcon={mapTypeToIcon(concern.type)}
                    childName={concern.studentId?.name || ''}
                    description={concern.description}
                    status="resolved"
                    lastUpdate={new Date(concern.lastUpdateAt || concern.createdAt).toLocaleString(
                      'ar-SA',
                    )}
                    onViewDetails={() => navigate(`/parent/concerns/${concern._id}`)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/parent/concerns/new')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full shadow-elevated flex items-center justify-center hover:from-teal-600 hover:to-teal-700 transition-all z-40"
        aria-label="Report Concern"
      >
        <Plus size={24} />
      </button>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}


