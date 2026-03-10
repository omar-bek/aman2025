import { useState } from 'react'
import { useQuery } from 'react-query'
import { FileText, Plus, Calendar, Filter } from 'lucide-react'
import apiClient from '../../api/client'
import FilterBar from '../../components/government/FilterBar'
import ReportCard from '../../components/government/ReportCard'

export default function PolicyReports() {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([])
  const [selectedSchoolTypes, setSelectedSchoolTypes] = useState<string[]>([])
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null,
  })
  const [showReportBuilder, setShowReportBuilder] = useState(false)
  const [reportName, setReportName] = useState('')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])
  const [reportFormat, setReportFormat] = useState<'PDF' | 'Excel' | 'CSV' | 'JSON'>('PDF')

  const regions = ['دبي', 'أبوظبي', 'الشارقة', 'عجمان', 'رأس الخيمة', 'الفجيرة', 'أم القيوين']
  const schoolTypes = ['حكومي', 'خاص', 'خاص ممول']
  const availableMetrics = [
    'الحضور / Attendance',
    'السلامة / Safety',
    'الامتثال / Compliance',
    'مشاركة أولياء الأمور / Parent Engagement',
    'استبقاء المعلمين / Teacher Retention',
  ]

  const { data: reportsData, isLoading } = useQuery('government-policy-reports', async () => {
    try {
      const response = await apiClient.get('/government/policy-reports')
      return response.data
    } catch (error) {
      // Mock data
      return {
        templates: [
          {
            id: 1,
            title: 'التقرير الشهري',
            titleEn: 'Monthly Summary',
            description: 'ملخص شامل للمؤشرات الشهرية',
            descriptionEn: 'Comprehensive summary of monthly indicators',
            type: 'template' as const,
          },
          {
            id: 2,
            title: 'تقرير الامتثال الربعي',
            titleEn: 'Quarterly Compliance Report',
            description: 'تقرير مفصل عن معدلات الامتثال',
            descriptionEn: 'Detailed report on compliance rates',
            type: 'template' as const,
          },
          {
            id: 3,
            title: 'التقرير السنوي للتعليم',
            titleEn: 'Annual Education Report',
            description: 'تقرير سنوي شامل عن نظام التعليم',
            descriptionEn: 'Comprehensive annual education system report',
            type: 'template' as const,
          },
          {
            id: 4,
            title: 'تقييم السلامة',
            titleEn: 'Safety Assessment',
            description: 'تقرير تقييم شامل للسلامة',
            descriptionEn: 'Comprehensive safety assessment report',
            type: 'template' as const,
          },
          {
            id: 5,
            title: 'تقرير الأداء الإقليمي',
            titleEn: 'Regional Performance Report',
            description: 'مقارنة الأداء بين المناطق',
            descriptionEn: 'Performance comparison across regions',
            type: 'template' as const,
          },
        ],
        generated: [
          {
            id: 101,
            title: 'التقرير الشهري - ديسمبر 2024',
            titleEn: 'Monthly Summary - December 2024',
            description: 'ملخص شامل للمؤشرات الشهرية',
            descriptionEn: 'Comprehensive summary of monthly indicators',
            type: 'generated' as const,
            status: 'ready' as const,
            formats: ['PDF', 'Excel'],
            generatedAt: new Date(2024, 11, 31),
          },
          {
            id: 102,
            title: 'تقرير الامتثال الربعي - الربع الرابع 2024',
            titleEn: 'Quarterly Compliance - Q4 2024',
            description: 'تقرير مفصل عن معدلات الامتثال',
            descriptionEn: 'Detailed report on compliance rates',
            type: 'generated' as const,
            status: 'ready' as const,
            formats: ['PDF', 'Excel'],
            generatedAt: new Date(2024, 11, 15),
          },
        ],
      }
    }
  })

  const handleResetFilters = () => {
    setSelectedRegions([])
    setSelectedSchoolTypes([])
    setDateRange({ start: null, end: null })
  }

  const handleGenerateReport = () => {
    // TODO: Implement report generation
    console.log('Generating report:', {
      name: reportName,
      regions: selectedRegions,
      schoolTypes: selectedSchoolTypes,
      dateRange,
      metrics: selectedMetrics,
      format: reportFormat,
    })
    setShowReportBuilder(false)
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

      {/* Report Builder Toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">تقارير السياسات / Policy Reports</h2>
        <button
          onClick={() => setShowReportBuilder(!showReportBuilder)}
          className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold"
        >
          <Plus className="w-5 h-5" />
          {showReportBuilder ? 'إلغاء / Cancel' : 'إنشاء تقرير مخصص / Create Custom Report'}
        </button>
      </div>

      {/* Report Builder */}
      {showReportBuilder && (
        <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4">منشئ التقارير المخصصة / Custom Report Builder</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                اسم التقرير / Report Name
              </label>
              <input
                type="text"
                value={reportName}
                onChange={(e) => setReportName(e.target.value)}
                placeholder="أدخل اسم التقرير / Enter report name"
                className="w-full px-4 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  النطاق الزمني / Date Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateRange.start ? dateRange.start.toISOString().split('T')[0] : ''}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value ? new Date(e.target.value) : null })}
                    className="flex-1 px-4 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                  <span className="text-gray-500">إلى / To</span>
                  <input
                    type="date"
                    value={dateRange.end ? dateRange.end.toISOString().split('T')[0] : ''}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value ? new Date(e.target.value) : null })}
                    className="flex-1 px-4 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الصيغة / Format
                </label>
                <select
                  value={reportFormat}
                  onChange={(e) => setReportFormat(e.target.value as any)}
                  className="w-full px-4 py-2 bg-sand-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="PDF">PDF</option>
                  <option value="Excel">Excel</option>
                  <option value="CSV">CSV</option>
                  <option value="JSON">JSON</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                المقاييس / Metrics
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {availableMetrics.map((metric) => (
                  <label key={metric} className="flex items-center gap-2 p-2 bg-sand-50 rounded-lg cursor-pointer hover:bg-sand-100">
                    <input
                      type="checkbox"
                      checked={selectedMetrics.includes(metric)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedMetrics([...selectedMetrics, metric])
                        } else {
                          setSelectedMetrics(selectedMetrics.filter((m) => m !== metric))
                        }
                      }}
                      className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                    />
                    <span className="text-sm">{metric}</span>
                  </label>
                ))}
              </div>
            </div>
            <button
              onClick={handleGenerateReport}
              disabled={!reportName || selectedMetrics.length === 0}
              className="w-full px-6 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              إنشاء التقرير / Generate Report
            </button>
          </div>
        </div>
      )}

      {/* Report Templates */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">قوالب التقارير / Report Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportsData?.templates?.map((template: any) => (
            <ReportCard
              key={template.id}
              title={template.title}
              titleEn={template.titleEn}
              description={template.description}
              descriptionEn={template.descriptionEn}
              type={template.type}
              onView={() => console.log('View template:', template.id)}
            />
          ))}
        </div>
      </div>

      {/* Generated Reports */}
      {reportsData?.generated && reportsData.generated.length > 0 && (
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-4">التقارير المولدة / Generated Reports</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportsData.generated.map((report: any) => (
              <ReportCard
                key={report.id}
                title={report.title}
                titleEn={report.titleEn}
                description={report.description}
                descriptionEn={report.descriptionEn}
                type={report.type}
                status={report.status}
                formats={report.formats}
                generatedAt={report.generatedAt}
                onView={() => console.log('View report:', report.id)}
                onDownload={() => console.log('Download report:', report.id)}
                onShare={() => console.log('Share report:', report.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}


