import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  Navigation,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  ArrowLeft,
  Play,
  Square,
  ChevronLeft,
  ChevronRight,
  Loader,
  Wifi,
  WifiOff
} from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'
import { useAuthStore } from '../../store/authStore'

interface RouteStop {
  id: number
  name: string
  address: string
  order: number
  students: Array<{
    id: number
    name: string
    class_name: string
    check_in: boolean
    check_out: boolean
  }>
  estimated_arrival?: string
  actual_arrival?: string
}

export default function RouteExecution() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const queryClient = useQueryClient()
  const [isRouteActive, setIsRouteActive] = useState(false)
  const [currentStopIndex, setCurrentStopIndex] = useState(0)
  const [isOffline, setIsOffline] = useState(false)

  const {
    data: route,
    isLoading,
    isError,
  } = useQuery(
    'driver-active-route',
    async () => {
      try {
        const response = await apiClient.get('/driver/route/active')
        return response.data
      } catch (error) {
        toast.error('تعذر تحميل بيانات الرحلة الحالية')
        throw error
      }
    },
    {
      enabled: isRouteActive,
      refetchInterval: isRouteActive ? 30000 : false, // Refresh every 30s when active
    }
  )

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const startRouteMutation = useMutation(
    async () => {
      const response = await apiClient.post('/driver/route/start', {
        driver_id: user?.id,
        timestamp: new Date().toISOString()
      })
      return response.data
    },
    {
      onSuccess: () => {
        setIsRouteActive(true)
        toast.success('تم بدء الرحلة')
        queryClient.invalidateQueries('driver-active-route')
      },
      onError: () => {
        toast.error('فشل بدء الرحلة')
      }
    }
  )

  const endRouteMutation = useMutation(
    async () => {
      const response = await apiClient.post('/driver/route/end', {
        driver_id: user?.id,
        timestamp: new Date().toISOString()
      })
      return response.data
    },
    {
      onSuccess: (data) => {
        setIsRouteActive(false)
        toast.success('تم إنهاء الرحلة')
        const routeId = data?.route_id || route?.id
        if (routeId) {
          navigate(`/driver/summary/${routeId}`)
        } else {
          navigate('/driver')
        }
      },
      onError: () => {
        toast.error('فشل إنهاء الرحلة')
      }
    }
  )

  const arriveAtStopMutation = useMutation(
    async (stopId: number) => {
      const response = await apiClient.post(`/driver/route/stop/${stopId}/arrive`, {
        timestamp: new Date().toISOString()
      })
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('driver-active-route')
      }
    }
  )

  const currentStop = route?.stops?.[currentStopIndex]
  const nextStop = route?.stops?.[currentStopIndex + 1]
  const isLastStop = currentStopIndex === (route?.stops?.length || 0) - 1

  const handleStartRoute = () => {
    if (confirm('هل أنت متأكد من بدء الرحلة؟')) {
      startRouteMutation.mutate()
    }
  }

  const handleEndRoute = () => {
    if (confirm('هل أنت متأكد من إنهاء الرحلة؟')) {
      endRouteMutation.mutate()
    }
  }

  const handleArriveAtStop = () => {
    if (currentStop) {
      arriveAtStopMutation.mutate(currentStop.id)
    }
  }

  const handleNextStop = () => {
    if (currentStopIndex < (route?.stops?.length || 0) - 1) {
      setCurrentStopIndex(currentStopIndex + 1)
    }
  }

  const handlePreviousStop = () => {
    if (currentStopIndex > 0) {
      setCurrentStopIndex(currentStopIndex - 1)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <Loader className="animate-spin text-teal-600" size={48} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header - Minimal while driving */}
      <div className="bg-white border-b border-sand-200 shadow-soft">
        <div className="px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!isRouteActive && (
                <button
                  onClick={() => navigate('/driver')}
                  className="p-2 hover:bg-sand-100 rounded-card transition-colors"
                >
                  <ArrowLeft size={24} className="text-teal-600" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{route?.name || 'الطريق'}</h1>
                <p className="text-xs text-gray-600">
                  {route?.type === 'pickup' ? 'استلام' : 'إيصال'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isOffline && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 rounded-card border border-amber-300">
                  <WifiOff className="text-amber-700" size={16} />
                  <span className="text-xs font-medium text-amber-700">لا يوجد إنترنت</span>
                </div>
              )}
              {!isOffline && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 rounded-card border border-emerald-300">
                  <Wifi className="text-emerald-700" size={16} />
                  <span className="text-xs font-medium text-emerald-700">متصل</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        {!isRouteActive ? (
          /* Pre-Route - Start Screen */
          <div className="bg-white rounded-card-lg p-8 border border-sand-200 shadow-card text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-card-lg flex items-center justify-center mx-auto mb-6 shadow-elevated">
              <Navigation className="text-white" size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">جاهز للبدء؟</h2>
            <p className="text-gray-600 mb-8">
              تأكد من إكمال فحص المركبة قبل بدء الرحلة
            </p>
            <button
              onClick={handleStartRoute}
              disabled={startRouteMutation.isLoading}
              className="px-12 py-6 bg-teal-600 text-white rounded-card-lg text-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-elevated"
            >
              {startRouteMutation.isLoading ? (
                <Loader className="animate-spin mx-auto" size={24} />
              ) : (
                <>
                  <Play className="inline-block ml-2" size={24} />
                  بدء الرحلة
                </>
              )}
            </button>
          </div>
        ) : (
          <>
            {/* Current Stop - Large Display */}
            <div className="bg-white rounded-card-lg p-8 border-2 border-teal-300 shadow-elevated">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-teal-100 rounded-full mb-4">
                  <MapPin className="text-teal-600" size={40} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentStop?.name || 'المحطة الحالية'}
                </h2>
                <p className="text-lg text-gray-600">{currentStop?.address}</p>
                {currentStop?.estimated_arrival && (
                  <p className="text-sm text-gray-500 mt-2">
                    متوقع: {currentStop.estimated_arrival}
                  </p>
                )}
              </div>

              {/* Students at this stop */}
              {currentStop?.students && currentStop.students.length > 0 && (
                <div className="bg-sand-50 rounded-card-lg p-6 mb-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Users className="text-teal-600" size={24} />
                    <h3 className="text-lg font-bold text-gray-900">
                      {currentStop.students.length} طالب
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentStop.students.map((student: { id: number; name: string; class_name: string; check_in: boolean; check_out: boolean }) => (
                      <div
                        key={student.id}
                        className={`p-4 rounded-card border-2 ${
                          student.check_in
                            ? 'bg-emerald-50 border-emerald-300'
                            : 'bg-white border-sand-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-600">{student.class_name}</p>
                          </div>
                          {student.check_in && (
                            <CheckCircle className="text-emerald-600" size={24} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between gap-4">
                <button
                  onClick={handlePreviousStop}
                  disabled={currentStopIndex === 0}
                  className="flex-1 py-4 bg-sand-100 text-gray-700 rounded-card-lg font-bold hover:bg-sand-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ChevronRight size={24} />
                  السابقة
                </button>
                <button
                  onClick={handleArriveAtStop}
                  className="flex-2 px-8 py-4 bg-emerald-600 text-white rounded-card-lg text-lg font-bold hover:bg-emerald-700 transition-colors shadow-card flex items-center justify-center gap-2"
                >
                  <CheckCircle size={24} />
                  وصلت للمحطة
                </button>
                <button
                  onClick={handleNextStop}
                  disabled={isLastStop}
                  className="flex-1 py-4 bg-sand-100 text-gray-700 rounded-card-lg font-bold hover:bg-sand-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  التالية
                  <ChevronLeft size={24} />
                </button>
              </div>
            </div>

            {/* Next Stop Preview */}
            {nextStop && (
              <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
                <div className="flex items-center gap-3 mb-4">
                  <Navigation className="text-blue-600" size={24} />
                  <h3 className="text-lg font-bold text-gray-900">المحطة التالية</h3>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{nextStop.name}</p>
                    <p className="text-sm text-gray-600">{nextStop.address}</p>
                    {nextStop.students && nextStop.students.length > 0 && (
                      <p className="text-sm text-gray-500 mt-1">
                        {nextStop.students.length} طالب
                      </p>
                    )}
                  </div>
                  {nextStop.estimated_arrival && (
                    <div className="text-left">
                      <Clock className="text-blue-600 mb-1" size={20} />
                      <p className="text-sm font-medium text-gray-900">
                        {nextStop.estimated_arrival}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Route Progress */}
            <div className="bg-white rounded-card-lg p-6 border border-sand-200 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">تقدم الرحلة</h3>
                <span className="text-sm text-gray-600">
                  {currentStopIndex + 1} / {route?.stops?.length || 0}
                </span>
              </div>
              <div className="w-full bg-sand-200 rounded-full h-4">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-teal-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStopIndex + 1) / (route?.stops?.length || 1)) * 100}%` }}
                />
              </div>
            </div>

            {/* End Route Button - Large & Safe */}
            {isLastStop && (
              <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-sand-200 p-6 shadow-elevated">
                <button
                  onClick={handleEndRoute}
                  disabled={endRouteMutation.isLoading}
                  className="w-full py-6 bg-teal-600 text-white rounded-card-lg text-xl font-bold hover:bg-teal-700 transition-colors disabled:opacity-50 shadow-elevated flex items-center justify-center gap-3"
                >
                  {endRouteMutation.isLoading ? (
                    <Loader className="animate-spin" size={24} />
                  ) : (
                    <>
                      <Square size={24} />
                      إنهاء الرحلة
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}


