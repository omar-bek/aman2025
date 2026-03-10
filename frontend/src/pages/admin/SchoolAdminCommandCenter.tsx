import { useState } from 'react'
import { useQuery } from 'react-query'
import { useAuthStore } from '../../store/authStore'
import {
  LayoutDashboard,
  AlertTriangle,
  CheckCircle2,
  FileText,
  TrendingUp,
  TrendingDown,
  Minus,
  Clock,
  Filter,
  Download,
  Eye,
  Lock,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from 'lucide-react'
import apiClient from '../../api/client'
import LiveDashboard from '../../components/admin/command-center/LiveDashboard'
import IncidentOverview from '../../components/admin/command-center/IncidentOverview'
import ApprovalsQueue from '../../components/admin/command-center/ApprovalsQueue'
import ReportsExports from '../../components/admin/command-center/ReportsExports'

type TabType = 'dashboard' | 'incidents' | 'approvals' | 'reports'

export default function SchoolAdminCommandCenter() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>('dashboard')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const tabs = [
    {
      id: 'dashboard' as TabType,
      label: 'لوحة التحكم المباشرة',
      labelEn: 'Live Dashboard',
      icon: LayoutDashboard,
      count: null,
    },
    {
      id: 'incidents' as TabType,
      label: 'نظرة عامة على الحوادث',
      labelEn: 'Incident Overview',
      icon: AlertTriangle,
      count: 3,
    },
    {
      id: 'approvals' as TabType,
      label: 'قائمة الموافقات',
      labelEn: 'Approvals Queue',
      icon: CheckCircle2,
      count: 12,
    },
    {
      id: 'reports' as TabType,
      label: 'التقارير والتصدير',
      labelEn: 'Reports & Exports',
      icon: FileText,
      count: null,
    },
  ]

  const handleRefresh = () => {
    setLastRefresh(new Date())
    // Trigger refetch for all queries
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-sand-50" dir="rtl">
      {/* Header - Authoritative, Clean */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">
                مركز قيادة الإدارة المدرسية
              </h1>
              <p className="text-sm text-gray-600">
                School Admin Command Center
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleRefresh}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-card text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                aria-label="تحديث البيانات"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">تحديث</span>
              </button>
              <div className="text-xs text-gray-500">
                آخر تحديث: {lastRefresh.toLocaleTimeString('ar-AE')}
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 sm:px-6 lg:px-8 border-t border-gray-100">
          <nav className="flex gap-1 overflow-x-auto scrollbar-hide" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-card transition-all
                    whitespace-nowrap
                    ${
                      isActive
                        ? 'bg-white text-teal-700 border-b-2 border-teal-600'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.labelEn}</span>
                  {tab.count !== null && (
                    <span
                      className={`
                        px-2 py-0.5 rounded-full text-xs font-bold
                        ${
                          isActive
                            ? 'bg-teal-100 text-teal-700'
                            : 'bg-gray-200 text-gray-700'
                        }
                      `}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && <LiveDashboard />}
        {activeTab === 'incidents' && <IncidentOverview />}
        {activeTab === 'approvals' && <ApprovalsQueue />}
        {activeTab === 'reports' && <ReportsExports />}
      </div>
    </div>
  )
}


