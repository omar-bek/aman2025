import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, BarChart3, TrendingUp, Map, Users, Activity } from 'lucide-react'
import apiClient from '../../api/client'

export default function SuperAdminAnalytics() {
  const navigate = useNavigate()
  const [selectedMetric, setSelectedMetric] = useState('attendance')

  const { data: analytics } = useQuery(
    ['super-admin-analytics', selectedMetric],
    async () => {
      try {
        const response = await apiClient.get('/super-admin/analytics/', {
          params: { metric: selectedMetric }
        })
        return response.data
      } catch (error) {
        return { data: [], summary: {} }
      }
    }
  )

  const metrics = [
    { id: 'attendance', name: 'معدلات الحضور', icon: Users },
    { id: 'incidents', name: 'خريطة الحوادث', icon: Map },
    { id: 'transport', name: 'كفاءة النقل', icon: Activity },
    { id: 'engagement', name: 'مؤشر التفاعل', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/super-admin')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowRight size={24} className="text-white" />
              </button>
              <BarChart3 className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">التحليلات والإحصائيات</h1>
                <p className="text-white/90">بيانات مجمعة على مستوى الدولة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Metric Selector */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-2 flex-wrap">
            {metrics.map((metric) => {
              const Icon = metric.icon
              return (
                <button
                  key={metric.id}
                  onClick={() => setSelectedMetric(metric.id)}
                  className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                    selectedMetric === metric.id
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={20} />
                  {metric.name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Analytics Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          {selectedMetric === 'attendance' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">معدلات الحضور (Aggregated)</h2>
              {analytics?.summary && (
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                    <p className="text-sm text-gray-600">المعدل العام</p>
                    <p className="text-2xl font-bold text-blue-600">{analytics.summary.average_rate || 0}%</p>
                  </div>
                  <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                    <p className="text-sm text-gray-600">أعلى معدل</p>
                    <p className="text-2xl font-bold text-green-600">{analytics.summary.highest_rate || 0}%</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                    <p className="text-sm text-gray-600">أقل معدل</p>
                    <p className="text-2xl font-bold text-red-600">{analytics.summary.lowest_rate || 0}%</p>
                  </div>
                </div>
              )}
              <div className="text-center py-12 text-gray-500">
                <BarChart3 className="mx-auto mb-4 text-gray-400" size={48} />
                <p>رسم بياني مجمع (لا يحتوي على أسماء طلاب)</p>
              </div>
            </div>
          )}

          {selectedMetric === 'incidents' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">خريطة الحوادث</h2>
              <div className="text-center py-12 text-gray-500">
                <Map className="mx-auto mb-4 text-gray-400" size={48} />
                <p>خريطة حرارية للحوادث (Aggregated data only)</p>
              </div>
            </div>
          )}

          {selectedMetric === 'transport' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">كفاءة النقل</h2>
              <div className="text-center py-12 text-gray-500">
                <Activity className="mx-auto mb-4 text-gray-400" size={48} />
                <p>إحصائيات النقل (Aggregated data only)</p>
              </div>
            </div>
          )}

          {selectedMetric === 'engagement' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-4">مؤشر التفاعل</h2>
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="mx-auto mb-4 text-gray-400" size={48} />
                <p>مؤشر تفاعل أولياء الأمور (Aggregated data only)</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

