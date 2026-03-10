import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, CheckCircle, AlertCircle, Clock, MapPin } from 'lucide-react'
import { TodayStatusCard } from '../../components/parent'
import ParentBottomNav from '../../components/ParentBottomNav'

export default function TodayStatus() {
  const navigate = useNavigate()

  // Mock timeline data
  const timeline = [
    { time: '07:30', event: 'Boarded Bus', status: 'completed' },
    { time: '08:15', event: 'Arrived at School', status: 'completed' },
    { time: '12:00', event: 'Lunch Break', status: 'completed' },
    { time: '15:30', event: 'Dismissal', status: 'upcoming' },
  ]

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/parent')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowRight size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">حالة اليوم</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Large Status Display */}
        <div className="bg-gradient-to-br from-sand-100 to-white rounded-card-lg shadow-card border-2 border-emerald-200 p-8 text-center min-h-[200px] flex flex-col items-center justify-center">
          <Shield size={96} className="text-emerald-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">الجميع آمن ومحسوب</h2>
          <p className="text-sm text-gray-600">All safe and accounted for</p>
        </div>

        {/* Timeline Section */}
        <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">الجدول الزمني</h3>
          <div className="space-y-4">
            {timeline.map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center mt-1">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      item.status === 'completed'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        : 'bg-gray-50 border-gray-200 text-gray-400'
                    }`}
                  >
                    {item.status === 'completed' ? (
                      <CheckCircle size={14} />
                    ) : (
                      <Clock size={14} />
                    )}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-200 mt-1" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-gray-900">{item.event}</p>
                    <span className="text-xs text-gray-500 font-mono">{item.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Health Metrics (if applicable) */}
        <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">المقاييس الصحية</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={20} className="text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">معدل النبض</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">75</p>
              <p className="text-xs text-gray-600 mt-1">طبيعي</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="flex items-center gap-2 mb-2">
                <MapPin size={20} className="text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">الموقع</span>
              </div>
              <p className="text-sm font-bold text-gray-900">Classroom 3A</p>
              <p className="text-xs text-gray-600 mt-1">آمن</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}


