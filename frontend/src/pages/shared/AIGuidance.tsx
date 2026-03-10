import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, Lightbulb, TrendingUp, AlertCircle, FileText, Sparkles } from 'lucide-react'
import apiClient from '../../api/client'
import { useAuthStore } from '../../store/authStore'

export default function AIGuidance() {
  const navigate = useNavigate()
  const { studentId } = useParams()
  const { user } = useAuthStore()
  const [selectedPeriod, setSelectedPeriod] = useState('month')

  const { data: guidance } = useQuery(
    ['ai-guidance', studentId],
    async () => {
      if (!studentId) return null
      const response = await apiClient.get(`/ai/parent-guidance/${studentId}`)
      return response.data
    },
    { enabled: !!studentId && user?.role === 'parent' }
  )

  const { data: summary } = useQuery(
    ['ai-summary', studentId, selectedPeriod],
    async () => {
      if (!studentId) return null
      const response = await apiClient.get(`/ai/smart-summary/${studentId}`, {
        params: { period: selectedPeriod }
      })
      return response.data
    },
    { enabled: !!studentId }
  )

  const { data: anomalies } = useQuery(
    ['ai-anomalies', studentId],
    async () => {
      if (!studentId) return null
      const response = await apiClient.get('/ai/anomaly-detection', {
        params: { student_id: studentId }
      })
      return response.data
    },
    { enabled: !!studentId }
  )

  const { data: prediction } = useQuery(
    ['ai-prediction', studentId],
    async () => {
      if (!studentId) return null
      const response = await apiClient.get(`/ai/predictive-absenteeism`, {
        params: { student_id: studentId }
      })
      return response.data
    },
    { enabled: !!studentId }
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowRight size={24} className="text-white" />
              </button>
              <Sparkles className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">الإرشادات الذكية</h1>
                <p className="text-white/90">اقتراحات داعمة بناءً على البيانات</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Smart Summary */}
        {summary && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="text-purple-600" size={24} />
                <h2 className="text-xl font-bold text-gray-900">ملخص ذكي</h2>
              </div>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 bg-gray-100 rounded-lg border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="week">أسبوع</option>
                <option value="month">شهر</option>
                <option value="semester">فصل دراسي</option>
              </select>
            </div>
            <p className="text-gray-700 mb-4">{summary.summary}</p>
            <div className="space-y-2">
              {summary.key_points.map((point: string, index: number) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Parent Guidance Suggestions */}
        {guidance && guidance.suggestions && guidance.suggestions.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="text-yellow-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">اقتراحات إرشادية</h2>
            </div>
            <div className="space-y-4">
              {guidance.suggestions.map((suggestion: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-xl border-2 border-yellow-200"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb className="text-yellow-600 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium mb-2">{suggestion.suggestion}</p>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-bold">
                          {suggestion.category}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          suggestion.priority === 'high' ? 'bg-red-100 text-red-700' :
                          suggestion.priority === 'medium' ? 'bg-orange-100 text-orange-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {suggestion.priority === 'high' ? 'عالي' :
                           suggestion.priority === 'medium' ? 'متوسط' : 'منخفض'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Anomaly Detection (Non-Alarm) */}
        {anomalies && anomalies.anomalies && anomalies.anomalies.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-blue-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">ملاحظات (غير تنبيهية)</h2>
            </div>
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border-2 border-blue-200">
              <p className="text-sm text-blue-700 font-medium">
                ⓘ جميع الملاحظات غير تنبيهية - للمتابعة والدعم فقط
              </p>
            </div>
            <div className="space-y-3">
              {anomalies.anomalies.map((anomaly: any, index: number) => (
                <div
                  key={index}
                  className="p-4 bg-blue-50 rounded-xl border-2 border-blue-200"
                >
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-blue-600 mt-1" size={20} />
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 mb-1">{anomaly.description}</p>
                      <p className="text-sm text-gray-700 mb-2">{anomaly.recommendation}</p>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        anomaly.severity === 'high' ? 'bg-red-100 text-red-700' :
                        anomaly.severity === 'medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {anomaly.severity === 'high' ? 'عالي' :
                         anomaly.severity === 'medium' ? 'متوسط' : 'منخفض'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Predictive Absenteeism */}
        {prediction && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="text-green-600" size={24} />
              <h2 className="text-xl font-bold text-gray-900">تحليل الأنماط</h2>
            </div>
            <div className="p-4 bg-green-50 rounded-xl border-2 border-green-200">
              <p className="text-gray-900 font-medium mb-2">{prediction.message}</p>
              <p className="text-sm text-gray-700">{prediction.recommendation}</p>
            </div>
          </div>
        )}

        {/* Ethical Notice */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="text-purple-600 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">المبادئ الأخلاقية</h3>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>• لا تشخيص نفسي أو طبي</li>
                <li>• لا مقارنة بين الطلاب</li>
                <li>• لا تصنيف تلقائي</li>
                <li>• لغة داعمة وإيجابية فقط</li>
                <li>• جميع التنبيهات غير تنبيهية</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

