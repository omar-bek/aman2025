import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from 'react-query'
import {
  ArrowRight,
  Sparkles,
  Smile,
  Meh,
  Frown,
  Heart,
  CheckCircle,
  Loader,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'

type MoodType = 'great' | 'good' | 'okay' | 'tough' | null

interface MoodOption {
  id: MoodType
  label: string
  icon: any
  color: string
  bgColor: string
  message: string
}

const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'great',
    label: 'رائع',
    icon: Smile,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50 border-emerald-200',
    message: 'أنا بخير جداً'
  },
  {
    id: 'good',
    label: 'جيد',
    icon: Smile,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50 border-teal-200',
    message: 'أشعر بالرضا'
  },
  {
    id: 'okay',
    label: 'عادي',
    icon: Meh,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50 border-amber-200',
    message: 'أشعر بأني بخير'
  },
  {
    id: 'tough',
    label: 'صعب قليلاً',
    icon: Frown,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50 border-blue-200',
    message: 'أواجه بعض التحديات'
  },
]

export default function SilentWellbeingCheckin() {
  const navigate = useNavigate()
  const [selectedMood, setSelectedMood] = useState<MoodType>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [canSkip, setCanSkip] = useState(true)

  const checkinMutation = useMutation(
    async (mood: MoodType) => {
      const response = await apiClient.post('/wellbeing/student/checkin', {
        mood,
      })
      return response.data
    },
    {
      onSuccess: () => {
        setShowSuccess(true)
        setTimeout(() => {
          navigate('/student')
        }, 2000)
      },
      onError: (_error: any) => {
        toast.error('حدث خطأ. يمكنك المحاولة لاحقاً.')
      }
    }
  )

  const handleMoodSelect = (mood: MoodType) => {
    setSelectedMood(mood)
    setCanSkip(false)
    checkinMutation.mutate(mood)
  }

  const handleSkip = () => {
    navigate('/student')
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-card-lg p-8 border border-emerald-200 shadow-elevated text-center max-w-md w-full">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-emerald-600" size={40} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">شكراً لك</h2>
          <p className="text-gray-600 mb-4">معلوماتك محفوظة بشكل خاص</p>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
            <Heart className="text-red-400" size={16} />
            <span>نحن هنا لدعمك</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header - Minimal */}
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
                <h1 className="text-xl font-bold text-gray-900">كيف تشعر اليوم؟</h1>
                <p className="text-xs text-gray-500 mt-1">اختياري تماماً • خاص بك فقط</p>
              </div>
            </div>
            {canSkip && (
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1 rounded-card hover:bg-sand-100 transition-colors"
              >
                تخطي
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-2xl mx-auto">
        {/* Privacy Notice */}
        <div className="bg-blue-50 rounded-card-lg p-4 border border-blue-200 mb-6">
          <div className="flex items-start gap-3">
            <Heart className="text-blue-600 mt-0.5 flex-shrink-0" size={18} />
            <div>
              <p className="text-sm font-medium text-gray-900 mb-1">معلوماتك خاصة</p>
              <p className="text-xs text-gray-600">
                هذه المعلومات محفوظة بشكل آمن وخاص. نحن نستخدمها فقط لمساعدتك بشكل أفضل.
              </p>
            </div>
          </div>
        </div>

        {/* Mood Selection */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <div className="text-center mb-8">
            <Sparkles className="mx-auto text-amber-500 mb-3" size={32} />
            <p className="text-gray-700 mb-2">اختر ما يناسبك</p>
            <p className="text-sm text-gray-500">لا يوجد إجابة صحيحة أو خاطئة</p>
          </div>

          {checkinMutation.isLoading ? (
            <div className="text-center py-12">
              <Loader className="mx-auto animate-spin text-teal-600" size={32} />
              <p className="text-gray-600 mt-4 text-sm">جاري الحفظ...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {MOOD_OPTIONS.map((mood) => {
                const Icon = mood.icon
                const isSelected = selectedMood === mood.id

                return (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood.id)}
                    disabled={checkinMutation.isLoading || !!selectedMood}
                    className={`p-6 rounded-card-lg border-2 transition-all ${
                      isSelected
                        ? `${mood.bgColor} border-2 ring-2 ring-offset-2 ring-teal-300 scale-105`
                        : 'bg-white border-sand-200 hover:border-teal-300 hover:shadow-soft'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Icon className={`mx-auto mb-3 ${isSelected ? mood.color : 'text-gray-400'}`} size={32} />
                    <p className={`text-sm font-medium mb-1 ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                      {mood.label}
                    </p>
                    <p className="text-xs text-gray-500">{mood.message}</p>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Encouragement Messages */}
        <div className="mt-6 space-y-3">
          <div className="bg-emerald-50 rounded-card p-4 border border-emerald-200 text-center">
            <p className="text-sm text-gray-700">
              <strong>تذكر:</strong> من الطبيعي أن تختلف مشاعرك يومياً. نحن هنا لدعمك.
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/student')}
              className="text-sm text-gray-500 hover:text-gray-700 underline"
            >
              العودة إلى لوحة التحكم
            </button>
          </div>
        </div>

        {/* Help Resources - Only shown if needed, no escalation */}
        <div className="mt-8 bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <h3 className="text-sm font-medium text-gray-900 mb-3">موارد مفيدة</h3>
          <div className="space-y-2">
            <button className="w-full text-right p-3 bg-sand-50 rounded-card border border-sand-200 hover:bg-sand-100 transition-colors">
              <p className="text-sm font-medium text-gray-900">نصائح للاسترخاء</p>
              <p className="text-xs text-gray-600 mt-1">تقنيات بسيطة للمساعدة</p>
            </button>
            <button className="w-full text-right p-3 bg-sand-50 rounded-card border border-sand-200 hover:bg-sand-100 transition-colors">
              <p className="text-sm font-medium text-gray-900">أنشطة ممتعة</p>
              <p className="text-xs text-gray-600 mt-1">أفكار لأنشطة تساعدك على الشعور بالتحسن</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


