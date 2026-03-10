import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Download, BarChart3, TrendingUp, Users, Calendar, FileText } from 'lucide-react'
import apiClient from '../../api/client'
import { format, subDays } from 'date-fns'
import toast from 'react-hot-toast'

export default function AdminReports() {
  const navigate = useNavigate()
  const [selectedReport, setSelectedReport] = useState<string>('attendance')
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd'),
  })

  const { data: attendanceReport } = useQuery(
    ['attendance-report', dateRange],
    async () => {
      try {
        const response = await apiClient.get('/admin/reports/attendance', {
          params: dateRange
        })
        return response.data
      } catch (error) {
        return { trends: [], summary: {} }
      }
    },
    { enabled: selectedReport === 'attendance' }
  )

  const { data: teacherActivityReport } = useQuery(
    ['teacher-activity-report', dateRange],
    async () => {
      try {
        const response = await apiClient.get('/admin/reports/teacher-activity', {
          params: dateRange
        })
        return response.data
      } catch (error) {
        return { activities: [], summary: {} }
      }
    },
    { enabled: selectedReport === 'teacher-activity' }
  )

  const { data: parentEngagementReport } = useQuery(
    ['parent-engagement-report', dateRange],
    async () => {
      try {
        const response = await apiClient.get('/admin/reports/parent-engagement', {
          params: dateRange
        })
        return response.data
      } catch (error) {
        return { engagement: [], summary: {} }
      }
    },
    { enabled: selectedReport === 'parent-engagement' }
  )

  const handleExport = (reportType: string) => {
    // Export functionality
    toast.success('جاري تصدير التقرير...')
  }

  const reports = [
    { id: 'attendance', name: 'تقرير الحضور', icon: Calendar },
    { id: 'teacher-activity', name: 'نشاط المدرسين', icon: Users },
    { id: 'parent-engagement', name: 'تفاعل أولياء الأمور', icon: TrendingUp },
    { id: 'incidents', name: 'سجل الحوادث', icon: FileText },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/admin')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowRight size={24} className="text-white" />
              </button>
              <BarChart3 className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">التقارير والإحصائيات</h1>
                <p className="text-white/90">تقارير شاملة عن أداء المدرسة</p>
              </div>
            </div>
            <button
              onClick={() => handleExport(selectedReport)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white font-bold flex items-center gap-2"
            >
              <Download size={20} />
              تصدير
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Report Type Selector */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-2 flex-wrap">
            {reports.map((report) => {
              const Icon = report.icon
              return (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report.id)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                    selectedReport === report.id
                      ? 'bg-gradient-to-r from-primary-600 to-primary-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={20} />
                  {report.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Date Range */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">من تاريخ</label>
              <input
                type="date"
                className="input-field"
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
            <div>
              <label className="label">إلى تاريخ</label>
              <input
                type="date"
                className="input-field"
                value={dateRange.end}
                onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          {selectedReport === 'attendance' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">تقرير الحضور</h2>
              {attendanceReport?.summary && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <p className="text-sm text-gray-600">معدل الحضور</p>
                    <p className="text-2xl font-bold text-green-600">
                      {attendanceReport.summary.attendance_rate || 0}%
                    </p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-sm text-gray-600">إجمالي الحضور</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {attendanceReport.summary.total_present || 0}
                    </p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                    <p className="text-sm text-gray-600">إجمالي الغياب</p>
                    <p className="text-2xl font-bold text-red-600">
                      {attendanceReport.summary.total_absent || 0}
                    </p>
                  </div>
                </div>
              )}
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="mx-auto mb-4 text-gray-400" size={48} />
                <p>رسم بياني للحضور سيظهر هنا</p>
              </div>
            </div>
          )}

          {selectedReport === 'teacher-activity' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">نشاط المدرسين</h2>
              <div className="text-center py-12 text-gray-500">
                <Users className="mx-auto mb-4 text-gray-400" size={48} />
                <p>إحصائيات نشاط المدرسين ستظهر هنا</p>
              </div>
            </div>
          )}

          {selectedReport === 'parent-engagement' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">تفاعل أولياء الأمور</h2>
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="mx-auto mb-4 text-gray-400" size={48} />
                <p>إحصائيات التفاعل ستظهر هنا</p>
              </div>
            </div>
          )}

          {selectedReport === 'incidents' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">سجل الحوادث</h2>
              <div className="text-center py-12 text-gray-500">
                <FileText className="mx-auto mb-4 text-gray-400" size={48} />
                <p>سجل الحوادث سيظهر هنا</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

