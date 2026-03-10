import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  BookOpen,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  Loader,
  Eye,
} from 'lucide-react'
import apiClient from '../../api/client'

interface EngagementMetric {
  topic: string
  engagement_score: number
  trend: 'up' | 'down' | 'stable'
  students_engaged: number
  total_students: number
}

interface AcademicTrend {
  topic: string
  subject: string
  current_avg: number
  previous_avg: number
  trend: 'up' | 'down' | 'stable'
  assessment_count: number
}

interface WeeklyRecommendation {
  id: number
  priority: 'high' | 'medium' | 'low'
  category: 'engagement' | 'academic' | 'attendance' | 'behavior'
  title: string
  description: string
  action: string
  impacted_students?: number
}

export default function ClassInsights() {
  const navigate = useNavigate()
  const [selectedClass, setSelectedClass] = useState<string>('')
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('week')

  const { data: insights, isLoading } = useQuery(
    ['class-insights', selectedClass, timeRange],
    async () => {
      const response = await apiClient.get('/teacher/class-insights', {
        params: { class: selectedClass || undefined, period: timeRange },
      })
      return response.data as {
        overall_engagement: number
        engagement_metrics: EngagementMetric[]
        academic_trends: AcademicTrend[]
        recommendations: WeeklyRecommendation[]
      }
    },
  )

  const engagementData = insights
  const academicTrends = insights?.academic_trends || []
  const recommendations = insights?.recommendations || []

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-emerald-500" size={20} />
      case 'down':
        return <TrendingDown className="text-red-500" size={20} />
      default:
        return <Minus className="text-gray-400" size={20} />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-amber-300 bg-amber-50'
      case 'medium':
        return 'border-teal-300 bg-teal-50'
      default:
        return 'border-gray-300 bg-gray-50'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'engagement':
        return <Activity className="text-teal-600" size={18} />
      case 'academic':
        return <BookOpen className="text-emerald-600" size={18} />
      case 'attendance':
        return <Clock className="text-blue-600" size={18} />
      default:
        return <AlertCircle className="text-gray-600" size={18} />
    }
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/teacher')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
                aria-label="العودة"
              >
                <ArrowRight size={24} className="text-teal-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">تحليلات الصف</h1>
                <p className="text-sm text-gray-600 mt-1">رؤى مجمعة • اتجاهات أكاديمية • توصيات قابلة للتنفيذ</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <select
                className="px-3 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
              >
                <option value="">جميع الصفوف</option>
                <option value="1A">1A</option>
                <option value="2A">2A</option>
                <option value="3A">3A</option>
              </select>
              <select
                className="px-3 py-2 bg-sand-50 border border-sand-300 rounded-card text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as any)}
              >
                <option value="week">أسبوع</option>
                <option value="month">شهر</option>
                <option value="semester">فصل دراسي</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader className="mx-auto animate-spin text-teal-600" size={32} />
            <p className="text-gray-600 mt-4">جاري تحليل البيانات...</p>
          </div>
        ) : (
          <>
            {/* Overall Engagement Score */}
            <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-card flex items-center justify-center">
                    <Activity className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">مستوى التفاعل الإجمالي</h2>
                    <p className="text-sm text-gray-600">للصف بأكمله</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32">
                  <svg className="transform -rotate-90 w-32 h-32">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      className="text-sand-200"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="currentColor"
                      strokeWidth="12"
                      fill="none"
                      strokeDasharray={`${(engagementData?.overall_engagement || 0) * 3.516} 395.84`}
                      className="text-emerald-500 transition-all duration-1000"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-900">
                      {engagementData?.overall_engagement || 0}%
                    </span>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-3 gap-4">
                    {engagementData?.engagement_metrics.slice(0, 3).map((metric, idx) => (
                      <div key={idx} className="text-center">
                        <p className="text-xs text-gray-600 mb-1">{metric.topic.split(' - ')[1] || metric.topic}</p>
                        <div className="flex items-center justify-center gap-2">
                          {getTrendIcon(metric.trend)}
                          <span className="text-lg font-bold text-gray-900">{metric.engagement_score}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Engagement Metrics by Topic */}
              <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="text-teal-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">التفاعل حسب الموضوع</h2>
                </div>
                <div className="space-y-4">
                  {engagementData?.engagement_metrics.map((metric, idx) => (
                    <div key={idx} className="p-4 bg-sand-50 rounded-card border border-sand-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-sm mb-1">{metric.topic}</p>
                          <p className="text-xs text-gray-600">
                            {metric.students_engaged} من {metric.total_students} طالب
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(metric.trend)}
                          <span className="text-lg font-bold text-gray-900">{metric.engagement_score}%</span>
                        </div>
                      </div>
                      <div className="w-full bg-sand-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${metric.engagement_score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Trends */}
              <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="text-emerald-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">الاتجاهات الأكاديمية</h2>
                </div>
                <div className="space-y-4">
                  {academicTrends?.map((trend, idx) => (
                    <div key={idx} className="p-4 bg-sand-50 rounded-card border border-sand-200">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{trend.topic}</p>
                          <p className="text-xs text-gray-600">{trend.subject}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(trend.trend)}
                          <span className="text-lg font-bold text-gray-900">{trend.current_avg}%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600 mt-2">
                        <span>السابق: {trend.previous_avg}%</span>
                        <span>{trend.assessment_count} تقييم</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <div className="flex-1 bg-sand-200 rounded-full h-1.5">
                          <div
                            className="bg-gradient-to-r from-emerald-400 to-teal-500 h-1.5 rounded-full"
                            style={{ width: `${trend.current_avg}%` }}
                          />
                        </div>
                        <div className="flex-1 bg-sand-200 rounded-full h-1.5">
                          <div
                            className="bg-gray-400 h-1.5 rounded-full"
                            style={{ width: `${trend.previous_avg}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Weekly Recommendations */}
            <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-card flex items-center justify-center">
                    <Lightbulb className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">توصيات هذا الأسبوع</h2>
                    <p className="text-sm text-gray-600">إجراءات قابلة للتنفيذ بناءً على البيانات</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                {recommendations?.map((rec) => (
                  <div
                    key={rec.id}
                    className={`p-5 rounded-card-lg border-2 ${getPriorityColor(rec.priority)} transition-all hover:shadow-elevated`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="mt-1">{getCategoryIcon(rec.category)}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-bold text-gray-900">{rec.title}</h3>
                          {rec.impacted_students && (
                            <span className="px-2 py-1 bg-white rounded-full text-xs font-medium text-gray-700 border border-gray-300">
                              {rec.impacted_students} طالب
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-3">{rec.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-teal-700">{rec.action}</span>
                          <button className="px-4 py-2 bg-teal-600 text-white rounded-card text-sm font-medium hover:bg-teal-700 transition-colors flex items-center gap-2">
                            <Eye size={16} />
                            عرض التفاصيل
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {(!recommendations || recommendations.length === 0) && (
                  <div className="text-center py-8">
                    <CheckCircle className="mx-auto text-emerald-500 mb-3" size={48} />
                    <p className="text-gray-600">لا توجد توصيات حالياً - كل شيء يسير بشكل جيد!</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

