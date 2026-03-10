import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Clock, Lightbulb, TrendingDown, Sparkles } from 'lucide-react'
import apiClient from '../../api/client'

export default function TeacherWorkloadReduction() {
  const navigate = useNavigate()

  const { data: tips } = useQuery(
    'teacher-workload-tips',
    async () => {
      const response = await apiClient.get('/ai/teacher/workload-reduction')
      return response.data
    }
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/teacher')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowRight size={24} className="text-white" />
              </button>
              <Clock className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">تقليل عبء العمل</h1>
                <p className="text-white/90">نصائح ذكية لتوفير الوقت</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Tips List */}
        {tips && tips.tips && tips.tips.length > 0 ? (
          <div className="space-y-4">
            {tips.tips.map((tip: any, index: number) => (
              <div
                key={index}
                className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Lightbulb className="text-white" size={24} />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-bold text-gray-900 mb-2">{tip.tip}</p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">
                        {tip.category}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-green-600">
                        <TrendingDown size={16} />
                        <span className="font-medium">يوفر: {tip.estimated_time_saved}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <Lightbulb className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">لا توجد نصائح متاحة حالياً</p>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border-2 border-blue-200 shadow-lg">
          <div className="flex items-start gap-3">
            <Sparkles className="text-blue-600 mt-1" size={24} />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">كيف تعمل هذه النصائح؟</h3>
              <p className="text-sm text-gray-700">
                يتم تحليل أنماط عملك وتقديم اقتراحات مخصصة لتوفير الوقت. 
                جميع النصائح تركز على الكفاءة ولا تتضمن أي تقييم للطلاب.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

