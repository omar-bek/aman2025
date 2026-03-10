import { useState } from 'react'
import { useQuery } from 'react-query'
import { TrendingUp, BarChart3, Calendar, Download } from 'lucide-react'
import apiClient from '../../api/client'
import FilterBar from '../../components/government/FilterBar'
import TrendChart from '../../components/government/TrendChart'
import StatisticalInsightCard from '../../components/government/StatisticalInsightCard'

export default function TrendAnalysis() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedSchoolTypes, setSelectedSchoolTypes] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })
  const [metricGroup, setMetricGroup] = useState<'all' | 'attendance' | 'safety' | 'compliance'>('all')
  const [timeRange, setTimeRange] = useState<'3' | '6' | '12'>('12')
  const [comparisonMode, setComparisonMode] = useState<'none' | 'yoy' | 'mom' | 'regional'>('none')

  const regions = ['دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'أم القيوين']
  const schoolTypes = ['حكومي', 'خاص', 'خاص ممول']

  const { data: trendData, isLoading } = useQuery(
    ['government-trend-analysis', metricGroup, timeRange, comparisonMode, selectedRegions, selectedSchoolTypes],
    async () => {
      try {
        const response = await apiClient.get('/government/trend-analysis', {
          params: {
            metric_group: metricGroup,
            time_range: timeRange,
            comparison_mode: comparisonMode,
            regions: selectedRegions.length > 0 ? selectedRegions : undefined,
            school_types: selectedSchoolTypes.length > 0 ? selectedSchoolTypes : undefined,
          },
        })
        return response.data
      } catch (error) {
        // Mock data
        return {
          primary_trend: Array.from({ length: 12 }, (_, i) => ({
            date: new Date(2024, i, 1).toISOString(),
            attendance: 90 + Math.random() * 5,
            safety: 94 + Math.random() * 3,
            compliance: 96 + Math.random() * 3,
          })),
          regional_comparison: regions.map((region) => ({
            region,
            attendance: 90 + Math.random() * 5,
            safety: 94 + Math.random() * 3,
            compliance: 96 + Math.random() * 3,
          })),
          school_type_comparison: schoolTypes.map((type) => ({
            type,
            attendance: 90 + Math.random() * 5,
            safety: 94 + Math.random() * 3,
            compliance: 96 + Math.random() * 3,
          })),
          insights: [
            {
              insight: 'زيادة 2.3% في معدل الحضور على أساس سنوي',
              insightEn: '2.3% increase in attendance rate YoY',
              type: 'positive' as const,
            },
            {
              insight: 'مؤشرات السلامة مستقرة عبر جميع المناطق',
              insightEn: 'Safety scores stable across all regions',
              type: 'neutral' as const,
            },
            {
              insight: 'معدل الامتثال الأعلى في أبوظبي (99.1%)',
              insightEn: 'Highest compliance rate in Abu Dhabi (99.1%)',
              type: 'positive' as const,
            },
            {
              insight: 'المدارس الخاصة تظهر 5.2% مشاركة أعلى',
              insightEn: 'Private schools show 5.2% higher engagement',
              type: 'positive' as const,
            },
          ],
          forecast: {
            next_3_months: Array.from({ length: 3 }, (_, i) => ({
              month: new Date(2025, i, 1).toISOString(),
              projected_attendance: 94.5 + Math.random() * 1,
              confidence_interval: [93.8, 95.2],
            })),
          },
        }
      }
    }
  )

  const handleResetFilters = () => {
    setSelectedRegions([])
    setSelectedSchoolTypes([])
    setDateRange({ start: null, end: null })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
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

      {/* Controls */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              مجموعة المقاييس / Metric Group
            </label>
            <select
              value={metricGroup}
              onChange={(e) => setMetricGroup(e.target.value as any)}
              className="w-full px-4 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">الكل / All</option>
              <option value="attendance">الحضور / Attendance</option>
              <option value="safety">السلامة / Safety</option>
              <option value="compliance">الامتثال / Compliance</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              النطاق الزمني / Time Range
            </label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as '3' | '6' | '12')}
              className="w-full px-4 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="3">3 أشهر / 3 Months</option>
              <option value="6">6 أشهر / 6 Months</option>
              <option value="12">12 شهر / 12 Months</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              وضع المقارنة / Comparison Mode
            </label>
            <select
              value={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.value as any)}
              className="w-full px-4 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="none">بدون / None</option>
              <option value="yoy">سنوي / YoY</option>
              <option value="mom">شهري / MoM</option>
              <option value="regional">إقليمي / Regional</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary Trend Chart */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">الاتجاه الرئيسي / Primary Trend</h2>
            <p className="text-sm text-gray-500">الاتجاهات على مدار آخر {timeRange} شهر</p>
          </div>
          <TrendingUp className="w-6 h-6 text-teal-600" />
        </div>
        <TrendChart
          data={trendData?.primary_trend || []}
          metrics={['attendance', 'safety', 'compliance']}
          timeRange={timeRange}
          comparisonMode={comparisonMode}
        />
      </div>

      {/* Comparison Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Regional Comparison */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">المقارنة الإقليمية / Regional Comparison</h3>
              <p className="text-sm text-gray-500">مقارنة المقاييس عبر المناطق</p>
            </div>
            <BarChart3 className="w-5 h-5 text-teal-600" />
          </div>
          <div className="bg-sand-50 rounded-xl p-4 border-2 border-gray-200 min-h-[200px] flex items-center justify-center">
            <p className="text-sm text-gray-600 text-center">
              مخطط شريطي تفاعلي | Interactive bar chart
            </p>
          </div>
        </div>

        {/* School Type Comparison */}
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">مقارنة نوع المدرسة / School Type Comparison</h3>
              <p className="text-sm text-gray-500">مقارنة المقاييس حسب نوع المدرسة</p>
            </div>
            <BarChart3 className="w-5 h-5 text-teal-600" />
          </div>
          <div className="bg-sand-50 rounded-xl p-4 border-2 border-gray-200 min-h-[200px] flex items-center justify-center">
            <p className="text-sm text-gray-600 text-center">
              مخطط شريطي تفاعلي | Interactive bar chart
            </p>
          </div>
        </div>
      </div>

      {/* Statistical Insights */}
      {trendData?.insights && trendData.insights.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xl font-bold text-gray-900">الرؤى الإحصائية / Statistical Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {trendData.insights.map((insight: any, index: number) => (
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

      {/* Forecast */}
      {trendData?.forecast && (
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">التنبؤ / Forecast</h2>
              <p className="text-sm text-gray-500">التنبؤ بالشهور الثلاثة القادمة (مشروع - غير مؤكد)</p>
            </div>
            <Calendar className="w-6 h-6 text-teal-600" />
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200 mb-4">
            <p className="text-sm text-amber-800 font-medium">
              ⚠️ هذه التوقعات مشروطة وغير مؤكدة | These projections are conditional and uncertain
            </p>
          </div>
          <div className="bg-sand-50 rounded-xl p-4 border-2 border-gray-200 min-h-[200px] flex items-center justify-center">
            <p className="text-sm text-gray-600 text-center">
              مخطط التنبؤ مع فترات الثقة | Forecast chart with confidence intervals
            </p>
          </div>
        </div>
      )}
    </div>
  )
}


