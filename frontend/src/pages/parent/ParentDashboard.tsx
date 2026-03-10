import { useQuery } from 'react-query'
import { parentAPI } from '../../api'
import { useAuthStore } from '../../store/authStore'
import { useNavigate } from 'react-router-dom'
import { Clock } from 'lucide-react'
import { StatusCard, TodayStatusCard } from '../../components/parent'
import ParentBottomNav from '../../components/ParentBottomNav'
import { ErrorState } from '../../components/common/ErrorState'

export default function ParentDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  // Load aggregated daily status for this parent
  const {
    data: dashboard,
    isLoading,
    isError,
    refetch,
  } = useQuery(['parent-dashboard', user?.id], () => parentAPI.getDashboard(), {
    enabled: !!user?.id,
    retry: 1,
  })

  // Get time-aware greeting
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return { ar: 'صباح الخير', en: 'Good morning' }
    if (hour < 18) return { ar: 'مساء الخير', en: 'Good afternoon' }
    return { ar: 'مساء الخير', en: 'Good evening' }
  }

  const greeting = getGreeting()

  // Format last update time
  const formatLastUpdate = (minutes: number) => {
    if (minutes === 0) return 'الآن'
    if (minutes === 1) return 'منذ دقيقة'
    return `منذ ${minutes} دقيقة`
  }

  const children = dashboard?.children || []
  const overallStatus = dashboard?.overallStatus || 'safe'

  const handleContactSchool = () => {
    // Implement contact school functionality
    window.location.href = 'tel:+971123456789'
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-card-lg flex items-center justify-center shadow-card">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{greeting.ar}</h1>
                <p className="text-sm text-gray-600">
                  {new Date().toLocaleDateString('ar-SA', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>
            <div className="bg-sand-100 px-3 py-1.5 rounded-lg border border-sand-200">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <Clock size={12} />
                <span>محدث منذ 2 دقيقة</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Today Status Card */}
          <TodayStatusCard
            status={overallStatus}
            lastUpdate={formatLastUpdate(2)}
            childrenCount={children.length}
          />

        {/* Error state (similar to staff/admin pages) */}
        {isError && !isLoading && (
          <ErrorState
            title="تعذر تحميل بيانات الأطفال"
            description="حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى."
            onRetry={() => refetch()}
          />
        )}

        {/* Children Status Cards */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
            <p className="text-gray-600 mt-4">جاري التحميل...</p>
          </div>
        ) : children.length === 0 ? (
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👶</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">لا يوجد أطفال مسجلين</h3>
            <p className="text-sm text-gray-600 mb-4">لا يوجد أطفال مسجلين بعد</p>
            <button
              onClick={handleContactSchool}
              className="px-6 py-2 bg-teal-500 text-white rounded-card font-medium hover:bg-teal-600 transition-colors"
            >
              اتصل بالمدرسة للتسجيل
            </button>
          </div>
        ) : (
          children.map((child) => (
            <StatusCard
              key={child.id}
              childId={child.id as unknown as number}
              childName={child.name}
              status={
                child.attendanceState === 'late' || child.wellbeingState === 'attention'
                  ? 'action-required'
                  : child.attendanceState === 'pending'
                    ? 'informational'
                    : 'safe'
              }
              lastUpdate={formatLastUpdate(2)}
              indicators={[
                {
                  type: 'location',
                  label: 'الموقع',
                  value:
                    child.locationState === 'in_class'
                      ? 'In Class'
                      : child.locationState === 'on_route'
                        ? 'On Route'
                        : child.locationState === 'leaving'
                          ? 'Leaving School'
                          : child.locationState === 'home'
                            ? 'Home'
                            : 'Unknown',
                  status:
                    child.locationState === 'in_class' || child.locationState === 'home'
                      ? 'ok'
                      : child.locationState === 'on_route'
                        ? 'warning'
                        : 'unknown',
                },
                {
                  type: 'health',
                  label: 'الصحة',
                  value:
                    child.wellbeingState === 'attention'
                      ? 'يحتاج متابعة'
                      : child.wellbeingState === 'watch'
                        ? 'تحت المراقبة'
                        : 'طبيعي',
                  status:
                    child.wellbeingState === 'attention'
                      ? 'warning'
                      : child.wellbeingState === 'watch'
                        ? 'warning'
                        : 'ok',
                },
                {
                  type: 'activity',
                  label: 'النشاط',
                  value: 'نشط',
                  status: 'ok',
                },
              ]}
              onViewDetails={() => navigate(`/parent/child/${child.id}`)}
              onContactSchool={handleContactSchool}
            />
          ))
        )}

        {/* Daily Digest Preview */}
        {children.length > 0 && (
          <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-5">
            <h3 className="text-lg font-bold text-gray-900 mb-4">ملخص اليوم</h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3 py-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">وصل جميع الأطفال في الوقت المحدد</p>
              </div>
              <div className="flex items-start gap-3 py-2">
                <div className="w-2 h-2 rounded-full bg-teal-500 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">لا توجد حوادث أو مخاوف</p>
              </div>
              <div className="flex items-start gap-3 py-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mt-2 flex-shrink-0"></div>
                <p className="text-sm text-gray-700">جميع الأنشطة طبيعية</p>
              </div>
            </div>
            <button
              onClick={() => navigate('/parent/digest')}
              className="w-full mt-4 text-center text-sm font-medium text-teal-600 hover:text-teal-700 py-2 rounded-lg hover:bg-teal-50 transition-colors"
            >
              عرض الملخص الكامل &gt;
            </button>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}
