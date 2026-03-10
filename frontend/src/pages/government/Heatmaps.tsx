import { useState } from 'react'
import { useQuery } from 'react-query'
import { Map, Calendar, Grid3x3, Download } from 'lucide-react'
import apiClient from '../../api/client'
import FilterBar from '../../components/government/FilterBar'
import HeatmapMap from '../../components/government/HeatmapMap'

type MetricType = 'attendance' | 'safety' | 'compliance' | 'incidents' | 'engagement'

export default function Heatmaps() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedSchoolTypes, setSelectedSchoolTypes] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('attendance')
  const [timePeriod, setTimePeriod] = useState<'7' | '30' | '90'>('30')

  const regions = ['دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'أم القيوين']
  const schoolTypes = ['حكومي', 'خاص', 'خاص ممول']

  const metrics = [
    { value: 'attendance' as MetricType, label: 'معدل الحضور', labelEn: 'Attendance Rate' },
    { value: 'safety' as MetricType, label: 'مؤشر السلامة', labelEn: 'Safety Score' },
    { value: 'compliance' as MetricType, label: 'معدل الامتثال', labelEn: 'Compliance Rate' },
    { value: 'incidents' as MetricType, label: 'تكرار الحوادث', labelEn: 'Incident Frequency' },
    { value: 'engagement' as MetricType, label: 'مشاركة أولياء الأمور', labelEn: 'Parent Engagement' },
  ]

  const { data: heatmapData, isLoading } = useQuery(
    ['government-heatmaps', selectedMetric, timePeriod, selectedRegions, selectedSchoolTypes],
    async () => {
      try {
        const response = await apiClient.get('/government/heatmaps', {
          params: {
            metric: selectedMetric,
            time_period: timePeriod,
            regions: selectedRegions.length > 0 ? selectedRegions : undefined,
            school_types: selectedSchoolTypes.length > 0 ? selectedSchoolTypes : undefined,
          },
        })
        return response.data
      } catch (error) {
        // Mock data
        return {
          geographic: [
            { region: 'دبي', value: 95.2, intensity: 'high' },
            { region: 'أبوظبي', value: 94.8, intensity: 'high' },
            { region: 'الشارقة', value: 93.5, intensity: 'medium' },
            { region: 'عجمان', value: 92.8, intensity: 'medium' },
            { region: 'رأس الخيمة', value: 94.1, intensity: 'high' },
            { region: 'الفجيرة', value: 93.2, intensity: 'medium' },
            { region: 'أم القيوين', value: 92.5, intensity: 'medium' },
          ],
          temporal: Array.from({ length: 90 }, (_, i) => ({
            date: new Date(Date.now() - (89 - i) * 24 * 60 * 60 * 1000),
            value: 90 + Math.random() * 10,
          })),
          matrix: regions.map((region) =>
            schoolTypes.map((type) => ({
              region,
              type,
              value: 85 + Math.random() * 15,
            }))
          ).flat(),
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

      {/* Metric Selector and Controls */}
      <div className="bg-white rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              المقياس / Metric
            </label>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
              className="w-full px-4 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {metrics.map((metric) => (
                <option key={metric.value} value={metric.value}>
                  {metric.label} / {metric.labelEn}
                </option>
              ))}
            </select>
          </div>
          <div className="min-w-[150px]">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              الفترة الزمنية / Time Period
            </label>
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as '7' | '30' | '90')}
              className="w-full px-4 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="7">7 أيام / 7 Days</option>
              <option value="30">30 يوم / 30 Days</option>
              <option value="90">90 يوم / 90 Days</option>
            </select>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold mt-6"
            aria-label="Export heatmap"
          >
            <Download className="w-4 h-4" />
            تصدير / Export
          </button>
        </div>
      </div>

      {/* Geographic Heatmap */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">الخريطة الجغرافية / Geographic Heatmap</h2>
            <p className="text-sm text-gray-500">توزيع {metrics.find(m => m.value === selectedMetric)?.label} حسب الإمارة</p>
          </div>
          <Map className="w-6 h-6 text-teal-600" />
        </div>
        <HeatmapMap
          data={heatmapData?.geographic || []}
          metric={selectedMetric}
          metricLabel={metrics.find(m => m.value === selectedMetric)?.label || ''}
        />
      </div>

      {/* Temporal Heatmap */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">الخريطة الزمنية / Temporal Heatmap</h2>
            <p className="text-sm text-gray-500">أنماط {metrics.find(m => m.value === selectedMetric)?.label} على مدار الوقت</p>
          </div>
          <Calendar className="w-6 h-6 text-teal-600" />
        </div>
        <div className="bg-sand-50 rounded-xl p-4 border-2 border-gray-200">
          <p className="text-sm text-gray-600 text-center py-8">
            عرض تقويم مع تدرج لوني يوضح القيم على مدار آخر {timePeriod} يوم
            <br />
            Calendar view with color gradient showing values over the last {timePeriod} days
          </p>
        </div>
      </div>

      {/* School Type Matrix */}
      <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">مصفوفة نوع المدرسة / School Type Matrix</h2>
            <p className="text-sm text-gray-500">مقارنة {metrics.find(m => m.value === selectedMetric)?.label} حسب المنطقة ونوع المدرسة</p>
          </div>
          <Grid3x3 className="w-6 h-6 text-teal-600" />
        </div>
        <div className="bg-sand-50 rounded-xl p-4 border-2 border-gray-200">
          <p className="text-sm text-gray-600 text-center py-8">
            مصفوفة تفاعلية تظهر القيم عبر المناطق وأنواع المدارس
            <br />
            Interactive matrix showing values across regions and school types
          </p>
        </div>
      </div>
    </div>
  )
}


