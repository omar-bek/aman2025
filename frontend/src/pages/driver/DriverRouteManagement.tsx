import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, MapPin, Navigation, Users, Clock, AlertTriangle, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'

export default function DriverRouteManagement() {
  const navigate = useNavigate()
  const [isTracking, setIsTracking] = useState(false)
  const queryClient = useQueryClient()

  const { data: route } = useQuery('driver-route', async () => {
    try {
      const response = await apiClient.get('/driver/route')
      return response.data
    } catch (error) {
      return {
        route_name: 'الطريق 1',
        stops: [
          { id: 1, name: 'المدرسة', order: 0, students: [] },
          { id: 2, name: 'محطة 1', order: 1, students: [] },
          { id: 3, name: 'محطة 2', order: 2, students: [] },
        ],
        current_stop: null,
        next_stop: null,
      }
    }
  })

  const { data: students } = useQuery('driver-route-students', async () => {
    try {
      const response = await apiClient.get('/driver/route/students')
      return response.data || []
    } catch (error) {
      return []
    }
  })

  const startTrackingMutation = useMutation(
    async () => {
      const response = await apiClient.post('/driver/route/start-tracking')
      return response.data
    },
    {
      onSuccess: () => {
        setIsTracking(true)
        toast.success('تم تفعيل التتبع')
      },
      onError: () => {
        toast.error('فشل تفعيل التتبع')
      }
    }
  )

  const stopTrackingMutation = useMutation(
    async () => {
      const response = await apiClient.post('/driver/route/stop-tracking')
      return response.data
    },
    {
      onSuccess: () => {
        setIsTracking(false)
        toast.success('تم إيقاف التتبع')
      },
      onError: () => {
        toast.error('فشل إيقاف التتبع')
      }
    }
  )

  const scanStudentMutation = useMutation(
    async (studentId: number) => {
      const response = await apiClient.post(`/driver/students/${studentId}/scan`)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('driver-route-students')
        toast.success('تم تسجيل صعود الطالب')
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل تسجيل الصعود')
      }
    }
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/driver')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowRight size={24} className="text-white" />
              </button>
              <Navigation className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">إدارة الطريق</h1>
                <p className="text-white/90">{route?.route_name || 'الطريق 1'}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full font-bold ${
              isTracking ? 'bg-green-500 text-white' : 'bg-white/20 text-white'
            }`}>
              {isTracking ? 'GPS مفعّل' : 'GPS متوقف'}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Route Status */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">حالة الطريق</h2>
            {!isTracking ? (
              <button
                onClick={() => startTrackingMutation.mutate()}
                disabled={startTrackingMutation.isLoading}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                بدء التتبع
              </button>
            ) : (
              <button
                onClick={() => stopTrackingMutation.mutate()}
                disabled={stopTrackingMutation.isLoading}
                className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl font-bold hover:from-red-600 hover:to-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                إيقاف التتبع
              </button>
            )}
          </div>

          {/* Route Stops */}
          <div className="space-y-3">
            {route?.stops?.map((stop: any, index: number) => (
              <div
                key={stop.id}
                className={`p-4 rounded-xl border-2 ${
                  stop.id === route.current_stop?.id
                    ? 'bg-primary-50 border-primary-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      stop.id === route.current_stop?.id
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{stop.name}</p>
                      <p className="text-sm text-gray-600">{stop.students?.length || 0} طالب</p>
                    </div>
                  </div>
                  {stop.id === route.current_stop?.id && (
                    <span className="px-3 py-1 bg-primary-600 text-white rounded-full text-xs font-bold">
                      المحطة الحالية
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Students on Route */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <h2 className="text-xl font-bold text-gray-900 mb-4">الطلاب في الطريق</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {students?.map((student: any) => (
              <div
                key={student.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{student.full_name}</p>
                    <p className="text-sm text-gray-600">{student.class_name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {student.boarding_status === 'on_board' ? (
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold flex items-center gap-2">
                      <CheckCircle size={18} />
                      على الحافلة
                    </span>
                  ) : (
                    <button
                      onClick={() => scanStudentMutation.mutate(student.id)}
                      disabled={scanStudentMutation.isLoading}
                      className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-bold disabled:opacity-50"
                    >
                      مسح QR
                    </button>
                  )}
                </div>
              </div>
            ))}
            {(!students || students.length === 0) && (
              <p className="text-center text-gray-500 py-4">لا يوجد طلاب في هذا الطريق</p>
            )}
          </div>
        </div>

        {/* Delay Alert */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-yellow-600" size={24} />
            <div className="flex-1">
              <p className="font-bold text-yellow-900">تنبيه التأخير</p>
              <p className="text-sm text-yellow-700">يمكنك إرسال تنبيه للأهل في حالة التأخير</p>
            </div>
            <button
              onClick={() => {/* Send delay alert */}}
              className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-bold"
            >
              إرسال تنبيه
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

