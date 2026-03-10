import { useState } from 'react'
import { useQuery } from 'react-query'
import {
  FileText,
  Download,
  Calendar,
  Filter,
  BarChart3,
  TrendingUp,
  Users,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  FileText as FilePdf,
  FileJson,
  RefreshCw,
} from 'lucide-react'
import apiClient from '../../../api/client'

type ReportType = 'incidents' | 'approvals' | 'attendance' | 'compliance' | 'summary'
type ExportFormat = 'pdf' | 'excel' | 'csv' | 'json'

export default function ReportsExports() {
  const [selectedReportType, setSelectedReportType] = useState<ReportType | 'all'>('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('pdf')

  const { data: reports, isLoading } = useQuery(
    'command-center-reports',
    async () => {
      try {
        const response = await apiClient.get('/admin/command-center/reports')
        return response.data
      } catch (error) {
        // Mock data
        return {
          summary: {
            totalIncidents: 45,
            resolvedIncidents: 42,
            pendingApprovals: 8,
            slaCompliance: 94,
            avgResponseTime: '15m',
          },
          recentReports: [
            {
              id: 1,
              type: 'incidents' as ReportType,
              title: 'تقرير الحوادث الشهري',
              titleEn: 'Monthly Incidents Report',
              generatedAt: '2024-01-15T10:00:00',
              period: 'ديسمبر 2023',
              format: 'pdf' as ExportFormat,
              size: '2.4 MB',
              downloadUrl: '#',
            },
            {
              id: 2,
              type: 'approvals' as ReportType,
              title: 'تقرير الموافقات الأسبوعي',
              titleEn: 'Weekly Approvals Report',
              generatedAt: '2024-01-14T09:00:00',
              period: 'الأسبوع الماضي',
              format: 'excel' as ExportFormat,
              size: '1.8 MB',
              downloadUrl: '#',
            },
            {
              id: 3,
              type: 'compliance' as ReportType,
              title: 'تقرير الامتثال',
              titleEn: 'Compliance Report',
              generatedAt: '2024-01-13T14:00:00',
              period: 'ربع سنوي',
              format: 'pdf' as ExportFormat,
              size: '3.1 MB',
              downloadUrl: '#',
            },
          ],
        }
      }
    }
  )

  const reportTypeLabels = {
    incidents: { ar: 'حوادث', en: 'Incidents' },
    approvals: { ar: 'موافقات', en: 'Approvals' },
    attendance: { ar: 'حضور', en: 'Attendance' },
    compliance: { ar: 'امتثال', en: 'Compliance' },
    summary: { ar: 'ملخص', en: 'Summary' },
  }

  const formatIcons = {
    pdf: FileText,
    excel: FileSpreadsheet,
    csv: FileSpreadsheet,
    json: FileJson,
  } as Record<ExportFormat, any>

  const formatLabels = {
    pdf: 'PDF',
    excel: 'Excel',
    csv: 'CSV',
    json: 'JSON',
  }

  const handleGenerateReport = () => {
    // Implementation
    console.log('Generate report', {
      type: selectedReportType,
      dateRange,
      format: selectedFormat,
    })
  }

  const handleExport = (reportId: number, format: ExportFormat) => {
    // Implementation
    console.log('Export report', reportId, format)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  const summary = reports?.summary || {}
  const recentReports = Array.isArray(reports?.recentReports)
    ? reports!.recentReports
    : []

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-card-lg p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span className="text-xs text-gray-500">إجمالي الحوادث</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{summary.totalIncidents || 0}</p>
        </div>
        <div className="bg-white rounded-card-lg p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs text-gray-500">تم الحل</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{summary.resolvedIncidents || 0}</p>
        </div>
        <div className="bg-white rounded-card-lg p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <Clock className="w-5 h-5 text-teal-600" />
            <span className="text-xs text-gray-500">موافقات معلقة</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{summary.pendingApprovals || 0}</p>
        </div>
        <div className="bg-white rounded-card-lg p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span className="text-xs text-gray-500">الامتثال لـ SLA</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{summary.slaCompliance || 0}%</p>
        </div>
        <div className="bg-white rounded-card-lg p-4 shadow-card">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <span className="text-xs text-gray-500">متوسط وقت الاستجابة</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{summary.avgResponseTime || '0m'}</p>
        </div>
      </div>

      {/* Generate New Report */}
      <div className="bg-white rounded-card-lg p-6 shadow-card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">إنشاء تقرير جديد</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">نوع التقرير</label>
            <select
              value={selectedReportType}
              onChange={(e) => setSelectedReportType(e.target.value as any)}
              className="w-full px-4 py-2 bg-sand-50 border border-gray-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="all">جميع الأنواع</option>
              <option value="incidents">حوادث</option>
              <option value="approvals">موافقات</option>
              <option value="attendance">حضور</option>
              <option value="compliance">امتثال</option>
              <option value="summary">ملخص شامل</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">من تاريخ</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-full px-4 py-2 bg-sand-50 border border-gray-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">إلى تاريخ</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-full px-4 py-2 bg-sand-50 border border-gray-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">صيغة التصدير</label>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value as ExportFormat)}
              className="w-full px-4 py-2 bg-sand-50 border border-gray-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleGenerateReport}
            className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-card text-sm font-medium hover:bg-teal-700 transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>إنشاء تقرير</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-card text-sm font-medium hover:bg-gray-50 transition-colors">
            <RefreshCw className="w-4 h-4" />
            <span>إعادة تعيين</span>
          </button>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="bg-white rounded-card-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">التقارير الأخيرة</h2>
          <span className="text-xs text-gray-500">Recent Reports</span>
        </div>
        <div className="space-y-3">
          {recentReports.length > 0 ? (
            recentReports.map((report: any) => {
              const FormatIcon = formatIcons[report.format as ExportFormat]
              const typeLabel = reportTypeLabels[report.type as ReportType]

              return (
                <div
                  key={report.id}
                  className="flex items-center justify-between p-4 bg-sand-50 rounded-card border border-gray-200 hover:bg-sand-100 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-10 h-10 bg-teal-100 rounded-card flex items-center justify-center`}>
                      <FileText className="w-5 h-5 text-teal-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-sm font-bold text-gray-900 mb-1">{report.title}</h3>
                      <p className="text-xs text-gray-500 mb-1">{report.titleEn}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-600">
                        <span>{typeLabel.ar}</span>
                        <span>•</span>
                        <span>{report.period}</span>
                        <span>•</span>
                        <span>{report.size}</span>
                        <span>•</span>
                        <span>{new Date(report.generatedAt).toLocaleDateString('ar-AE')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleExport(report.id, report.format as ExportFormat)}
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-card text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                      <FormatIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">{formatLabels[report.format as ExportFormat]}</span>
                    </button>
                    <button
                      onClick={() => handleExport(report.id, 'pdf')}
                      className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-card text-sm font-medium hover:bg-teal-700 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      <span className="hidden sm:inline">تحميل</span>
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              لا توجد تقارير متاحة
            </div>
          )}
        </div>
      </div>

      {/* Export-Ready Layout Preview */}
      <div className="bg-white rounded-card-lg p-6 shadow-card">
        <h2 className="text-lg font-bold text-gray-900 mb-4">معاينة التنسيق للتصدير</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-sand-100 border-b-2 border-gray-300">
                <th className="text-right py-3 px-4 font-bold text-gray-900">التاريخ</th>
                <th className="text-right py-3 px-4 font-bold text-gray-900">النوع</th>
                <th className="text-right py-3 px-4 font-bold text-gray-900">الحالة</th>
                <th className="text-right py-3 px-4 font-bold text-gray-900">المسؤول</th>
                <th className="text-right py-3 px-4 font-bold text-gray-900">الوقت</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-sand-50">
                <td className="py-3 px-4 text-gray-700">2024-01-15</td>
                <td className="py-3 px-4 text-gray-700">حادث</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    تم الحل
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">أ. أحمد محمد</td>
                <td className="py-3 px-4 text-gray-700">12:30</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-sand-50">
                <td className="py-3 px-4 text-gray-700">2024-01-15</td>
                <td className="py-3 px-4 text-gray-700">موافقة</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">
                    في الانتظار
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">أ. فاطمة علي</td>
                <td className="py-3 px-4 text-gray-700">09:15</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-sand-50">
                <td className="py-3 px-4 text-gray-700">2024-01-14</td>
                <td className="py-3 px-4 text-gray-700">امتثال</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                    متوافق
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-700">أ. خالد حسن</td>
                <td className="py-3 px-4 text-gray-700">14:45</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-card text-sm font-medium hover:bg-gray-50 transition-colors">
            <FileSpreadsheet className="w-4 h-4" />
            <span>تصدير Excel</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-card text-sm font-medium hover:bg-gray-50 transition-colors">
            <FileText className="w-4 h-4" />
            <span>تصدير PDF</span>
          </button>
        </div>
      </div>
    </div>
  )
}

