import { useState, useMemo } from 'react'
import { useQuery } from 'react-query'
import { TrendingUp } from 'lucide-react'
import { governmentAPI, type AttendanceTrendFilter, type AttendanceTrendsResponse } from '../../api'
import { LoadingState } from '../../components/common/LoadingState'
import { ErrorState } from '../../components/common/ErrorState'
import AttendanceFilters from '../../components/government/AttendanceFilters'
import AttendanceCharts from '../../components/government/AttendanceCharts'
import AttendancePolicySummary from '../../components/government/AttendancePolicySummary'

const DEFAULT_MIN_CELL_SIZE = 10

const DEFAULT_FILTERS: AttendanceTrendFilter = {
  timeframe: 'current_term',
  emirateCode: undefined,
  regionCode: undefined,
  schoolType: 'all',
  minCellSize: DEFAULT_MIN_CELL_SIZE,
}

const emirateOptions = [
  { code: 'AUH', label: 'أبوظبي' },
  { code: 'DXB', label: 'دبي' },
  { code: 'SHJ', label: 'الشارقة' },
  { code: 'AJM', label: 'عجمان' },
  { code: 'RAK', label: 'رأس الخيمة' },
  { code: 'FJR', label: 'الفجيرة' },
  { code: 'UAQ', label: 'أم القيوين' },
]

const schoolTypeOptions = [
  { value: 'all' as const, label: 'جميع المدارس' },
  { value: 'public' as const, label: 'حكومي' },
  { value: 'private' as const, label: 'خاص' },
  { value: 'public_private' as const, label: 'خاص ممول / شراكات' },
  { value: 'other' as const, label: 'أخرى' },
]

export default function AttendanceTrendsView() {
  const [filters, setFilters] = useState<AttendanceTrendFilter>(DEFAULT_FILTERS)

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery<AttendanceTrendsResponse>(
    ['government-attendance-trends', filters],
    () => governmentAPI.getAttendanceTrends(filters),
    {
      // Attendance trends change relatively slowly; no need for very frequent polling
      refetchInterval: 300000,
    }
  )

  const hasPoints = (data?.points?.length || 0) > 0

  const suppressionInfo = useMemo(() => {
    if (!data?.points || data.points.length === 0) return null
    const suppressedCount = data.points.filter((p) => p.isSuppressed || p.attendanceRate == null).length
    if (!suppressedCount) return null
    const total = data.points.length
    const ratio = suppressedCount / total
    return { suppressedCount, total, ratio }
  }, [data])

  if (isLoading && !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingState inline message="جاري تحميل اتجاهات الحضور الوطنية..." />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center py-12">
        <ErrorState
          title="تعذر تحميل اتجاهات الحضور"
          description="حدث خطأ أثناء جلب بيانات الحضور الوطنية."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <AttendanceFilters
        value={filters}
        onChange={setFilters}
        emirateOptions={emirateOptions}
        schoolTypeOptions={schoolTypeOptions}
      />

      {/* Charts and summary */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              اتجاهات الحضور الوطنية / National Attendance Trends
            </h2>
            <p className="text-sm text-gray-500">
              بيانات مجمعة على مستوى الإمارة/المنطقة ونوع المدرسة، بدون أي معرفات فردية.
            </p>
          </div>
          <TrendingUp className="w-6 h-6 text-teal-600" />
        </div>

        {!hasPoints && (
          <div className="bg-sand-50 rounded-xl p-6 border-2 border-dashed border-gray-300 text-center">
            <p className="text-gray-700 font-medium mb-1">
              لا توجد بيانات متاحة لهذا النطاق الزمني ومجموعة المرشحات الحالية.
            </p>
            <p className="text-sm text-gray-500">
              جرّب توسيع النطاق الزمني أو إزالة بعض المرشحات لعرض الاتجاهات الوطنية المجمعة.
            </p>
          </div>
        )}

        {hasPoints && data && (
          <AttendanceCharts points={data.points} summary={data.summary} />
        )}

        {suppressionInfo && (
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            لأسباب تتعلق بالخصوصية، تم إخفاء القيم الرقمية في {suppressionInfo.suppressedCount} من أصل{' '}
            {suppressionInfo.total} نقطة بيانات حيث كان عدد الطلبة أقل من العتبة الوطنية المعتمدة.
          </div>
        )}
      </div>

      {/* Policy narrative & report-style summary */}
      {data && (
        <AttendancePolicySummary
          summary={data.summary}
          filters={filters}
        />
      )}
    </div>
  )
}

