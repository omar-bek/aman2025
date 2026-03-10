import { useQuery } from 'react-query'
import { useState } from 'react'
import {
  School,
  Users,
  TrendingUp,
  Shield,
  CheckCircle2,
  Heart,
  GraduationCap,
  Activity,
} from 'lucide-react'
import apiClient from '../../api/client'
import toast from 'react-hot-toast'
import { ErrorState } from '../../components/common/ErrorState'
import { LoadingState } from '../../components/common/LoadingState'
import NationalKPICard from '../../components/government/NationalKPICard'
import FilterBar from '../../components/government/FilterBar'
import StatisticalInsightCard from '../../components/government/StatisticalInsightCard'
import RegionalDistributionMap from '../../components/government/RegionalDistributionMap'
import SchoolTypeDistribution from '../../components/government/SchoolTypeDistribution'

export default function NationalOverview() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedSchoolTypes, setSelectedSchoolTypes] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })

  const regions = ['دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'أم القيوين']
  const schoolTypes = ['حكومي', 'خاص', 'خاص ممول']

  const {
    data: overviewData,
    isLoading,
    isError,
    refetch,
  } = useQuery(
    'government-national-overview',
    async () => {
      try {
        const response = await apiClient.get('/government/national-overview', {
          params: {
            regions: selectedRegions.length > 0 ? selectedRegions : undefined,
            school_types: selectedSchoolTypes.length > 0 ? selectedSchoolTypes : undefined,
            start_date: dateRange.start?.toISOString(),
            end_date: dateRange.end?.toISOString(),
          },
        })
        return response.data
      } catch (error: any) {
        const message =
          error?.response?.data?.detail ||
          error?.response?.data?.message ||
          'تعذر تحميل النظرة الوطنية'
        toast.error(message)
        throw error
      }
    },
    {
      refetchInterval: 300000, // Refresh every 5 minutes
    }
  )

  const kpis = overviewData?.kpis || {}
  const regionalData = overviewData?.regional_distribution || []
  const schoolTypeData = overviewData?.school_type_distribution || []
  const insights = overviewData?.insights || []

  const handleResetFilters = () => {
    setSelectedRegions([])
    setSelectedSchoolTypes([])
    setDateRange({ start: null, end: null })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingState inline message="جاري تحميل النظرة الوطنية..." />
      </div>
    )
  }

  if (isError || !overviewData) {
    return (
      <div className="flex items-center justify-center py-12">
        <ErrorState
          title="تعذر تحميل النظرة الوطنية"
          description="حدث خطأ أثناء جلب بيانات المؤشرات الوطنية."
          onRetry={() => refetch()}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <FilterBar
        regions={regions}
        schoolTypes={schoolTypes}
        selectedRegions={selectedRegions}
        selectedSchoolTypes={selectedSchoolTypes}
        dateRange={dateRange}
        onRegionChange={setSelectedRegions}
        onSchoolTypeChange={setSelectedSchoolTypes}
        onDateRangeChange={setDateRange}
        onReset={handleResetFilters}
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NationalKPICard
          title="إجمالي المدارس"
          titleEn="Total Schools"
          value={kpis.total_schools?.toLocaleString() || '0'}
          trend={kpis.total_schools_trend}
          trendValue={kpis.total_schools_change}
          icon={School}
          color="emerald"
        />
        <NationalKPICard
          title="الطلاب النشطون"
          titleEn="Active Students"
          value={kpis.active_students?.toLocaleString() || '0'}
          trend={kpis.active_students_trend}
          trendValue={kpis.active_students_change}
          icon={Users}
          color="teal"
        />
        <NationalKPICard
          title="متوسط الحضور"
          titleEn="Average Attendance"
          value={`${kpis.avg_attendance?.toFixed(1) || '0'}%`}
          trend={kpis.avg_attendance_trend}
          trendValue={kpis.avg_attendance_change}
          icon={TrendingUp}
          color="emerald"
        />
        <NationalKPICard
          title="صحة النظام"
          titleEn="System Health"
          value={kpis.system_health === 'healthy' ? 'صحي / Healthy' : 'تحت المراقبة / Monitoring'}
          icon={Activity}
          color={kpis.system_health === 'healthy' ? 'emerald' : 'neutral'}
        />
        <NationalKPICard
          title="مؤشر السلامة"
          titleEn="Safety Score"
          value={`${kpis.safety_score?.toFixed(1) || '0'}%`}
          trend={kpis.safety_score_trend}
          trendValue={kpis.safety_score_change}
          icon={Shield}
          color="emerald"
        />
        <NationalKPICard
          title="معدل الامتثال"
          titleEn="Compliance Rate"
          value={`${kpis.compliance_rate?.toFixed(1) || '0'}%`}
          trend={kpis.compliance_rate_trend}
          trendValue={kpis.compliance_rate_change}
          icon={CheckCircle2}
          color="teal"
        />
        <NationalKPICard
          title="مشاركة أولياء الأمور"
          titleEn="Parent Engagement"
          value={`${kpis.parent_engagement?.toFixed(1) || '0'}%`}
          trend={kpis.parent_engagement_trend}
          trendValue={kpis.parent_engagement_change}
          icon={Heart}
          color="emerald"
        />
        <NationalKPICard
          title="استبقاء المعلمين"
          titleEn="Teacher Retention"
          value={`${kpis.teacher_retention?.toFixed(1) || '0'}%`}
          trend={kpis.teacher_retention_trend}
          trendValue={kpis.teacher_retention_change}
          icon={GraduationCap}
          color="teal"
        />
      </div>

      {/* Regional Distribution */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-2">التوزيع الإقليمي / Regional Distribution</h2>
        <p className="text-sm text-gray-500 mb-4">توزيع المدارس والطلاب حسب الإمارة</p>
        <RegionalDistributionMap data={regionalData} />
      </div>

      {/* School Type Distribution */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        <h2 className="text-xl font-bold text-gray-900 mb-2">توزيع أنواع المدارس / School Type Distribution</h2>
        <p className="text-sm text-gray-500 mb-4">نسبة المدارس حسب النوع</p>
        <SchoolTypeDistribution data={schoolTypeData} />
      </div>

      {/* Statistical Insights */}
      {insights.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">الرؤى الإحصائية / Statistical Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight: any, index: number) => (
              <StatisticalInsightCard
                key={index}
                insight={insight.insight}
                insightEn={insight.insightEn}
                type={insight.type}
                supportingData={insight.supportingData}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


