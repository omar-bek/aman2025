import { useState } from 'react'
import { useQuery } from 'react-query'
import {
  Users,
  AlertCircle,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  ChevronDown,
  ChevronUp,
  School,
  GraduationCap,
} from 'lucide-react'
import apiClient from '../../../api/client'
import KPITile from './KPITile'
import SLACountdown from './SLACountdown'
import StatusIndicator from './StatusIndicator'

export default function LiveDashboard() {
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null)
  const [selectedClass, setSelectedClass] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // Mock data - replace with actual API calls
  const { data: dashboardData, isLoading } = useQuery(
    'command-center-dashboard',
    async () => {
      try {
        const response = await apiClient.get('/admin/command-center/dashboard')
        return response.data
      } catch (error) {
        // Return mock data for development
        return {
          kpis: {
            activeIncidents: 3,
            activeIncidentsTrend: 'down',
            pendingApprovals: 12,
            pendingApprovalsTrend: 'up',
            slaCompliance: 94,
            slaComplianceTrend: 'up',
            resolvedToday: 8,
            resolvedTodayTrend: 'up',
            avgResponseTime: '12m',
            avgResponseTimeTrend: 'down',
            studentsOnCampus: 1247,
            studentsOnCampusTrend: 'neutral',
          },
          slaCountdowns: [
            {
              id: 1,
              title: 'موافقة على طلب خروج',
              priority: 'high',
              timeRemaining: 45, // minutes
              assignedTo: 'أ. أحمد محمد',
              status: 'pending',
            },
            {
              id: 2,
              title: 'مراجعة حادث سلوكي',
              priority: 'medium',
              timeRemaining: 120,
              assignedTo: 'أ. فاطمة علي',
              status: 'in-progress',
            },
            {
              id: 3,
              title: 'تأكيد حضور طالب',
              priority: 'low',
              timeRemaining: 180,
              assignedTo: 'أ. خالد حسن',
              status: 'pending',
            },
          ],
          gradeBreakdown: [
            { grade: 'الصف الأول', students: 145, incidents: 0, approvals: 2 },
            { grade: 'الصف الثاني', students: 138, incidents: 1, approvals: 3 },
            { grade: 'الصف الثالث', students: 142, incidents: 0, approvals: 1 },
            { grade: 'الصف الرابع', students: 135, incidents: 1, approvals: 2 },
            { grade: 'الصف الخامس', students: 140, incidents: 0, approvals: 1 },
            { grade: 'الصف السادس', students: 132, incidents: 1, approvals: 2 },
          ],
        }
      }
    }
  )

  const kpis = dashboardData?.kpis || {}
  const slaCountdowns = Array.isArray(dashboardData?.slaCountdowns)
    ? dashboardData!.slaCountdowns
    : []
  const gradeBreakdown = Array.isArray(dashboardData?.gradeBreakdown)
    ? dashboardData!.gradeBreakdown
    : []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Tiles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <KPITile
          title="حوادث نشطة"
          titleEn="Active Incidents"
          value={kpis.activeIncidents}
          trend={kpis.activeIncidentsTrend}
          trendValue="-2"
          icon={AlertCircle}
          color="emerald"
          onClick={() => {}}
        />
        <KPITile
          title="موافقات معلقة"
          titleEn="Pending Approvals"
          value={kpis.pendingApprovals}
          trend={kpis.pendingApprovalsTrend}
          trendValue="+3"
          icon={CheckCircle2}
          color="teal"
          onClick={() => {}}
        />
        <KPITile
          title="الامتثال لـ SLA"
          titleEn="SLA Compliance"
          value={`${kpis.slaCompliance}%`}
          trend={kpis.slaComplianceTrend}
          trendValue="+2%"
          icon={Clock}
          color="emerald"
          onClick={() => {}}
        />
        <KPITile
          title="تم الحل اليوم"
          titleEn="Resolved Today"
          value={kpis.resolvedToday}
          trend={kpis.resolvedTodayTrend}
          trendValue="+2"
          icon={CheckCircle2}
          color="teal"
          onClick={() => {}}
        />
        <KPITile
          title="متوسط وقت الاستجابة"
          titleEn="Avg Response Time"
          value={kpis.avgResponseTime}
          trend={kpis.avgResponseTimeTrend}
          trendValue="-3m"
          icon={Clock}
          color="emerald"
          onClick={() => {}}
        />
        <KPITile
          title="الطلاب في الحرم"
          titleEn="Students on Campus"
          value={kpis.studentsOnCampus}
          trend={kpis.studentsOnCampusTrend}
          trendValue="0"
          icon={Users}
          color="teal"
          onClick={() => {}}
        />
      </div>

      {/* Filters & Drill-down */}
      <div className="bg-white rounded-card-lg p-4 shadow-card">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center justify-between w-full text-right"
        >
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              تصفية حسب الصف / الفصل
            </span>
            <span className="text-xs text-gray-500">(اختياري)</span>
          </div>
          {showFilters ? (
            <ChevronUp className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                الصف
              </label>
              <select
                value={selectedGrade || ''}
                onChange={(e) => {
                  setSelectedGrade(e.target.value || null)
                  setSelectedClass(null)
                }}
                className="w-full px-3 py-2 bg-sand-50 border border-gray-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="">جميع الصفوف</option>
                {gradeBreakdown.map((item: any, idx: number) => (
                  <option key={idx} value={item.grade}>
                    {item.grade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-2">
                الفصل
              </label>
              <select
                value={selectedClass || ''}
                onChange={(e) => setSelectedClass(e.target.value || null)}
                disabled={!selectedGrade}
                className="w-full px-3 py-2 bg-sand-50 border border-gray-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">جميع الفصول</option>
                {selectedGrade && (
                  <>
                    <option value="A">أ</option>
                    <option value="B">ب</option>
                    <option value="C">ج</option>
                  </>
                )}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* SLA Countdown Indicators */}
      <div className="bg-white rounded-card-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            مؤشرات SLA النشطة
          </h2>
          <span className="text-xs text-gray-500">Active SLA Indicators</span>
        </div>
        <div className="space-y-3">
          {slaCountdowns.length > 0 ? (
            slaCountdowns.map((sla: any) => (
              <SLACountdown key={sla.id} {...sla} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              لا توجد مؤشرات SLA نشطة
            </div>
          )}
        </div>
      </div>

      {/* Grade/Class Breakdown */}
      <div className="bg-white rounded-card-lg p-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            تفصيل حسب الصف
          </h2>
          <span className="text-xs text-gray-500">Grade Breakdown</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  الصف
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  عدد الطلاب
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  حوادث
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  موافقات معلقة
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700">
                  الحالة
                </th>
              </tr>
            </thead>
            <tbody>
              {gradeBreakdown.map((item: any, idx: number) => (
                <tr
                  key={idx}
                  className="border-b border-gray-100 hover:bg-sand-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedGrade(item.grade)
                    setShowFilters(true)
                  }}
                >
                  <td className="py-3 px-4 font-medium text-gray-900">
                    {item.grade}
                  </td>
                  <td className="py-3 px-4 text-gray-700">{item.students}</td>
                  <td className="py-3 px-4">
                    <StatusIndicator
                      status={item.incidents > 0 ? 'warning' : 'safe'}
                      label={item.incidents > 0 ? `${item.incidents} حادث` : 'لا توجد'}
                      showIcon
                    />
                  </td>
                  <td className="py-3 px-4">
                    <StatusIndicator
                      status={item.approvals > 0 ? 'info' : 'safe'}
                      label={item.approvals > 0 ? `${item.approvals} موافقة` : 'لا توجد'}
                      showIcon
                    />
                  </td>
                  <td className="py-3 px-4">
                    <StatusIndicator
                      status="safe"
                      label="طبيعي"
                      showIcon
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

