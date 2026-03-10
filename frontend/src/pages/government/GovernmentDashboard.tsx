import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import {
  LayoutDashboard,
  Map,
  TrendingUp,
  FileText,
  Shield,
} from 'lucide-react'
import NationalOverview from './NationalOverview'
import Heatmaps from './Heatmaps'
import TrendAnalysis from './TrendAnalysis'
import PolicyReports from './PolicyReports'
import AttendanceTrendsView from './AttendanceTrendsView'

type TabType = 'overview' | 'attendance' | 'heatmaps' | 'trends' | 'reports'

export default function GovernmentDashboard() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  const tabs = [
    {
      id: 'overview' as TabType,
      label: 'لوحة التحكم الوطنية',
      labelEn: 'National Overview',
      icon: LayoutDashboard,
    },
    {
      id: 'attendance' as TabType,
      label: 'الحضور الوطني',
      labelEn: 'Attendance Intelligence',
      icon: TrendingUp,
    },
    {
      id: 'heatmaps' as TabType,
      label: 'خرائط الحرارة',
      labelEn: 'Heatmaps',
      icon: Map,
    },
    {
      id: 'trends' as TabType,
      label: 'تحليل الاتجاهات',
      labelEn: 'Trend Analysis',
      icon: TrendingUp,
    },
    {
      id: 'reports' as TabType,
      label: 'تقارير السياسات',
      labelEn: 'Policy Reports',
      icon: FileText,
    },
  ]

  return (
    <div className="min-h-screen bg-sand-50" dir="rtl">
      {/* Header */}
      <div className="bg-white border-b-2 border-gray-200 shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">لوحة تحكم السلطة الحكومية</h1>
                  <p className="text-sm text-gray-500">Government Authority Dashboard</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                مرحباً، {user?.full_name} | Welcome, {user?.full_name}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border-2 border-emerald-200 rounded-lg">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-emerald-700">بيانات مجمعة / Aggregated Data</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="px-6">
          <div className="flex items-center gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-4 border-b-2 transition-all relative
                    ${isActive
                      ? 'border-teal-600 text-teal-700 bg-teal-50'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-sand-50'
                    }
                  `}
                  aria-label={tab.labelEn}
                >
                  <Icon className="w-5 h-5" />
                  <div className="text-right">
                    <div className="font-semibold text-sm">{tab.label}</div>
                    <div className="text-xs text-gray-500">{tab.labelEn}</div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6">
        {activeTab === 'overview' && <NationalOverview />}
        {activeTab === 'attendance' && <AttendanceTrendsView />}
        {activeTab === 'heatmaps' && <Heatmaps />}
        {activeTab === 'trends' && <TrendAnalysis />}
        {activeTab === 'reports' && <PolicyReports />}
      </div>
    </div>
  )
}


