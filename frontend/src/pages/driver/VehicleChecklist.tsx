import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import {
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bus,
  Loader,
  Shield,
  Fuel,
  Battery,
  Lightbulb,
  Circle
} from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'

interface ChecklistItem {
  id: string
  label: string
  category: 'safety' | 'mechanical' | 'visual'
  icon: any
  required: boolean
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { id: 'brakes', label: 'المكابح', category: 'safety', icon: AlertCircle, required: true },
  { id: 'lights', label: 'الأضواء', category: 'visual', icon: Lightbulb, required: true },
  { id: 'tires', label: 'الإطارات', category: 'mechanical', icon: Circle, required: true },
  { id: 'fuel', label: 'الوقود', category: 'mechanical', icon: Fuel, required: true },
  { id: 'battery', label: 'البطارية', category: 'mechanical', icon: Battery, required: true },
  { id: 'mirrors', label: 'المرايا', category: 'visual', icon: Shield, required: true },
  { id: 'doors', label: 'الأبواب', category: 'safety', icon: Bus, required: true },
  { id: 'seats', label: 'المقاعد', category: 'safety', icon: Bus, required: true },
  { id: 'first_aid', label: 'صندوق الإسعاف', category: 'safety', icon: Shield, required: true },
  { id: 'fire_extinguisher', label: 'مطفأة الحريق', category: 'safety', icon: AlertCircle, required: true },
]

export default function VehicleChecklist() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [checklist, setChecklist] = useState<Record<string, boolean>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleToggleItem = (itemId: string) => {
    setChecklist((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }))
  }

  const handleNoteChange = (itemId: string, note: string) => {
    setNotes((prev) => ({
      ...prev,
      [itemId]: note,
    }))
  }

  const requiredItems = CHECKLIST_ITEMS.filter((item) => item.required)
  const completedRequired = requiredItems.filter((item) => checklist[item.id]).length
  const allRequiredCompleted = completedRequired === requiredItems.length

  const handleSubmit = async () => {
    if (!allRequiredCompleted) {
      toast.error('يرجى إكمال جميع العناصر المطلوبة')
      return
    }

    setIsSubmitting(true)
    try {
      await apiClient.post('/driver/checklist', {
        checklist,
        notes,
        timestamp: new Date().toISOString(),
        driver_id: user?.id,
      })
      toast.success('تم حفظ الفحص بنجاح')
      navigate('/driver/route')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'فشل حفظ الفحص')
    } finally {
      setIsSubmitting(false)
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
                onClick={() => navigate('/driver')}
                className="p-2 hover:bg-sand-100 rounded-card transition-colors"
              >
                <ArrowRight size={24} className="text-teal-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">فحص المركبة</h1>
                <p className="text-sm text-gray-600 mt-1">فحص ما قبل الرحلة • مطلوب للسلامة</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        {/* Progress */}
        <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">عناصر مطلوبة</p>
              <p className="text-2xl font-bold text-gray-900">
                {completedRequired} / {requiredItems.length}
              </p>
            </div>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
              allRequiredCompleted ? 'bg-emerald-100' : 'bg-amber-100'
            }`}>
              {allRequiredCompleted ? (
                <CheckCircle className="text-emerald-600" size={32} />
              ) : (
                <Loader className="text-amber-600 animate-spin" size={32} />
              )}
            </div>
          </div>
          <div className="w-full bg-sand-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-500 ${
                allRequiredCompleted ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
              style={{ width: `${(completedRequired / requiredItems.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Checklist Items */}
        <div className="space-y-4">
          {CHECKLIST_ITEMS.map((item) => {
            const Icon = item.icon
            const isChecked = checklist[item.id]
            const itemNote = notes[item.id] || ''

            return (
              <div
                key={item.id}
                className={`bg-white rounded-card-lg p-5 border-2 transition-all ${
                  isChecked
                    ? 'border-emerald-300 bg-emerald-50'
                    : item.required
                    ? 'border-red-200 bg-red-50'
                    : 'border-sand-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => handleToggleItem(item.id)}
                    className={`flex-shrink-0 w-12 h-12 rounded-card border-2 flex items-center justify-center transition-all ${
                      isChecked
                        ? 'bg-emerald-500 border-emerald-600'
                        : 'bg-white border-gray-300 hover:border-teal-500'
                    }`}
                  >
                    {isChecked ? (
                      <CheckCircle className="text-white" size={24} />
                    ) : (
                      <XCircle className="text-gray-400" size={24} />
                    )}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Icon className={`${isChecked ? 'text-emerald-600' : 'text-gray-400'}`} size={20} />
                        <h3 className="font-bold text-gray-900 text-lg">{item.label}</h3>
                        {item.required && (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                            مطلوب
                          </span>
                        )}
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.category === 'safety'
                          ? 'bg-red-100 text-red-700'
                          : item.category === 'mechanical'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {item.category === 'safety' ? 'سلامة' : item.category === 'mechanical' ? 'ميكانيكي' : 'بصري'}
                      </span>
                    </div>

                    {/* Notes field */}
                    <input
                      type="text"
                      placeholder="ملاحظات (اختياري)..."
                      value={itemNote}
                      onChange={(e) => handleNoteChange(item.id, e.target.value)}
                      className="w-full mt-2 px-3 py-2 bg-white border border-sand-300 rounded-card text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Warning if not all required completed */}
        {!allRequiredCompleted && (
          <div className="bg-amber-50 rounded-card-lg p-5 border-2 border-amber-300">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="font-medium text-gray-900 mb-1">لا يمكن بدء الرحلة</p>
                <p className="text-sm text-gray-700">
                  يجب إكمال جميع العناصر المطلوبة قبل بدء الرحلة لضمان سلامة الجميع.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-sand-200 p-4 shadow-elevated">
          <div className="max-w-4xl mx-auto">
            <button
              onClick={handleSubmit}
              disabled={!allRequiredCompleted || isSubmitting}
              className={`w-full py-5 rounded-card text-xl font-bold transition-all ${
                allRequiredCompleted
                  ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-card'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              } flex items-center justify-center gap-3`}
            >
              {isSubmitting ? (
                <>
                  <Loader className="animate-spin" size={24} />
                  جاري الحفظ...
                </>
              ) : (
                <>
                  <CheckCircle size={24} />
                  {allRequiredCompleted ? 'إكمال الفحص والبدء' : 'أكمل العناصر المطلوبة'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

