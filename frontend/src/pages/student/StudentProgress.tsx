import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Minus,
  BookOpen,
  Award,
  Target,
  Calendar,
  BarChart3,
  Loader,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react'
import apiClient from '../../api/client'

interface ProgressTrend {
  subject: string
  trend: 'up' | 'down' | 'stable'
  improvement: number
  recent_avg?: number
}

interface SubjectProgress {
  subject: string
  completion_rate: number
  assignments_completed: number
  assignments_total: number
  recent_improvement?: number
}

export default function StudentProgress() {
  const navigate = useNavigate()
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'semester'>('month')

  const { data: progressData, isLoading } = useQuery(
    ['student-progress', timeRange],
    async () => {
      try {
        const response = await apiClient.get('/student/progress')
        return response.data?.data
      } catch {
        return {
          overall_completion: 0,
          trends: [],
          subjects: [],
          milestones: [],
        }
      }
    }
  )

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="text-emerald-500" size={20} />
      case 'down':
        return <TrendingDown className="text-amber-500" size={20} />
      default:
        return <Minus className="text-gray-400" size={20} />
    }
  }

  const getEncouragementMessage = (completion: number) => {
    if (completion >= 90) return { text: 'أداء ممتاز! استمر في التفوق 🌟', color: 'text-emerald-600' }
    if (completion >= 75) return { text: 'أنت تقوم بعمل رائع! 💪', color: 'text-teal-600' }
    if (completion >= 60) return { text: 'تقدم جيد، يمكنك التحسين أكثر! 📚', color: 'text-amber-600' }
    return { text: 'كل خطوة مهمة، استمر! 🎯', color: 'text-blue-600' }
  }

  const encouragement = getEncouragementMessage(progressData?.overall_completion || 0)

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/student')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
                aria-label="العودة"
              >
                <ArrowRight size={24} className="text-teal-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">التقدم</h1>
                <p className="text-sm text-gray-600 mt-1">رؤية تحسنك الشخصي</p>
              </div>
            </div>
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

      <div className="p-4 sm:p-6 max-w-7xl mx-auto space-y-6">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader className="mx-auto animate-spin text-teal-600" size={32} />
            <p className="text-gray-600 mt-4">جاري تحليل تقدمك...</p>
          </div>
        ) : (
          <>
            {/* Overall Progress */}
            <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-card flex items-center justify-center">
                    <Target className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">التقدم الإجمالي</h2>
                    <p className={`text-sm font-medium mt-1 ${encouragement.color}`}>
                      {encouragement.text}
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative w-full h-32 mb-4">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-28 h-28">
                    <svg className="transform -rotate-90 w-28 h-28">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        className="text-sand-200"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(progressData?.overall_completion || 0) * 3.02} 301.59`}
                        className="text-emerald-500 transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-gray-900">
                        {progressData?.overall_completion || 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-center text-sm text-gray-600">معدل إتمام المهام</p>
            </div>

            {/* Trends */}
            {progressData?.trends && progressData.trends.length > 0 && (
              <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <BarChart3 className="text-teal-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">الاتجاهات</h2>
                </div>
                <div className="space-y-4">
                  {progressData.trends.map((trend: ProgressTrend, idx: number) => (
                    <div key={idx} className="p-4 bg-sand-50 rounded-card border border-sand-200">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{trend.subject}</p>
                          {trend.recent_avg && (
                            <p className="text-xs text-gray-600 mt-1">متوسط الأداء: {trend.recent_avg}%</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(trend.trend)}
                          {trend.improvement > 0 && (
                            <span className="text-sm font-medium text-emerald-600">
                              +{trend.improvement}%
                            </span>
                          )}
                          {trend.improvement === 0 && (
                            <span className="text-sm font-medium text-gray-600">
                              مستقر
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-sand-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${trend.recent_avg || 0}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Subject Progress */}
            {progressData?.subjects && progressData.subjects.length > 0 && (
              <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="text-emerald-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">التقدم حسب المادة</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {progressData.subjects.map((subject: SubjectProgress, idx: number) => (
                    <div key={idx} className="p-5 bg-sand-50 rounded-card-lg border border-sand-200">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-gray-900">{subject.subject}</h3>
                        <span className="text-lg font-bold text-emerald-600">
                          {subject.completion_rate}%
                        </span>
                      </div>
                      <div className="w-full bg-sand-200 rounded-full h-3 mb-3">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-500"
                          style={{ width: `${subject.completion_rate}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>{subject.assignments_completed} من {subject.assignments_total} واجب</span>
                        {subject.recent_improvement && subject.recent_improvement > 0 && (
                          <span className="text-emerald-600 font-medium">
                            تحسن +{subject.recent_improvement}%
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Milestones */}
            {progressData?.milestones && progressData.milestones.length > 0 && (
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-card-lg p-6 border border-emerald-200 shadow-card">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="text-emerald-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">إنجازاتك</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {progressData.milestones.map((milestone: any, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 bg-white rounded-card border border-emerald-200 flex items-start gap-3"
                    >
                      <div className="text-2xl">{milestone.icon}</div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 text-sm mb-1">{milestone.title}</p>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="text-emerald-500" size={14} />
                          <span className="text-xs text-gray-600">{milestone.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Encouragement Message */}
            <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card text-center">
              <Sparkles className="mx-auto text-amber-500 mb-3" size={32} />
              <p className="text-lg font-medium text-gray-900 mb-2">
                استمر في العمل الجيد!
              </p>
              <p className="text-sm text-gray-600">
                كل خطوة تخطوها تقربك من أهدافك. نحن فخورون بتقدمك.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


