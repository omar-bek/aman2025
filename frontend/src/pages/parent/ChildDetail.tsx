import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from 'react-query'
import { studentsAPI } from '../../api'
import {
  MapPin,
  Heart,
  Thermometer,
  Activity,
  TrendingUp,
  Moon,
  Battery,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react'
import ParentBottomNav from '../../components/ParentBottomNav'

export default function ChildDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { data: student } = useQuery(
    ['student', id],
    () => studentsAPI.getById(id || ''),
    { enabled: !!id }
  )

  // Mock health data
  const healthData = {
    location: { value: 'Unknown', status: 'warning', lastUpdate: '1m ago' },
    heartRate: { value: 125, status: 'elevated' },
    skinTemp: { value: 35.8, status: 'cool' },
    trembling: { value: 'High Detected', status: 'warning' },
    steps: { value: 1250, period: 'Today' },
    sleep: { value: 8.5, quality: 'Poor' }
  }

  const activities = [
    { time: '7:35 AM', title: 'وصل إلى المدرسة', location: 'Bus Stop', status: 'anxious' },
    { time: '7:35 AM', title: 'صعد الحافلة', status: 'normal' },
    { time: '7:20 AM', title: 'غادر المنزل', status: 'normal' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-20">
      {/* Header - Premium */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowRight size={24} className="text-white" />
            </button>
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-xl border border-white/30">
              <span className="text-white font-bold text-2xl">
                {(student?.full_name ?? student?.name ?? '')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white">{student?.full_name ?? student?.name}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-4 py-1.5 bg-red-500/90 text-white rounded-full text-xs font-bold shadow-md">
                  خطر
                </span>
                <div className="flex items-center gap-1.5 text-white bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                  <Battery size={16} />
                  <span className="text-sm font-bold">14%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Critical Alert */}
      <div className="bg-red-50 border-r-4 border-red-500 mx-4 mt-4 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0 mt-1" size={20} />
          <div>
            <p className="text-red-800 font-medium">GPS Signal Lost At 7:40 AM Near Gate 3</p>
            <p className="text-red-700 text-sm mt-1">Unusual Heart Activity Detected</p>
          </div>
        </div>
      </div>

      {/* Health Metrics */}
      <div className="p-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">الصحة</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Location */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="text-green-600" size={20} />
              <span className="text-sm text-gray-600">الموقع</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">Unknown</p>
            <div className="flex items-center gap-1">
              <AlertTriangle className="text-red-600" size={12} />
              <span className="text-xs text-red-600">منذ دقيقة</span>
            </div>
          </div>

          {/* Heart Rate */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="text-red-600" size={20} />
              <span className="text-sm text-gray-600">معدل النبض</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">125</p>
            <div className="flex items-center gap-1">
              <AlertTriangle className="text-red-600" size={12} />
              <span className="text-xs text-red-600">مرتفع</span>
            </div>
          </div>

          {/* Skin Temp */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Thermometer className="text-orange-600" size={20} />
              <span className="text-sm text-gray-600">درجة الحرارة</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">35.8°C</p>
            <p className="text-xs text-gray-600">بارد</p>
          </div>

          {/* Trembling */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-blue-600" size={20} />
              <span className="text-sm text-gray-600">الرعشة</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">High Detected</p>
            <div className="flex items-center gap-1">
              <AlertTriangle className="text-red-600" size={12} />
              <span className="text-xs text-red-600">رعشة</span>
            </div>
          </div>

          {/* Steps */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-blue-600" size={20} />
              <span className="text-sm text-gray-600">الخطوات</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">1,250</p>
            <p className="text-xs text-gray-600">اليوم</p>
          </div>

          {/* Sleep */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="text-purple-600" size={20} />
              <span className="text-sm text-gray-600">النوم</span>
            </div>
            <p className="text-lg font-bold text-gray-900 mb-1">8.5 ساعة</p>
            <p className="text-xs text-gray-600">ضعيف</p>
          </div>
        </div>
      </div>

      {/* School Activities */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-900">أنشطة المدرسة</h2>
          <button className="text-primary-600">
            <TrendingUp size={20} />
          </button>
        </div>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">{activity.time}</span>
                  </div>
                  <p className="font-medium text-gray-900">{activity.title}</p>
                  {activity.location && (
                    <p className="text-sm text-gray-500 mt-1">{activity.location}</p>
                  )}
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'anxious'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {activity.status === 'anxious' ? 'قلق' : 'طبيعي'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />

      <div className="h-20"></div>
    </div>
  )
}

