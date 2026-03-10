import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Bus, Users, MapPin, Clock, TrendingUp, CheckCircle, AlertCircle, Eye, Route } from 'lucide-react'
import { staffAPI, BusDetail, BusRouteDetail } from '../../api'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function StaffBuses() {
  const navigate = useNavigate()
  const [selectedBus, setSelectedBus] = useState<number | null>(null)
  const [activeView, setActiveView] = useState<'buses' | 'routes'>('buses')

  // Fetch buses
  const { data: buses, isLoading: busesLoading } = useQuery(
    'staff-buses',
    () => staffAPI.getAllBusesDetails(),
    { retry: false }
  )

  // Fetch routes
  const { data: routes } = useQuery(
    'staff-bus-routes',
    () => staffAPI.getAllBusRoutes(),
    { retry: false, enabled: activeView === 'routes' }
  )

  // Fetch bus details
  const { data: busDetails } = useQuery(
    ['bus-details', selectedBus],
    () => staffAPI.getBusDetails(selectedBus!),
    { enabled: !!selectedBus, retry: false }
  )

  // Fetch bus students
  const { data: busStudents } = useQuery(
    ['bus-students', selectedBus],
    () => staffAPI.getBusStudents(selectedBus!),
    { enabled: !!selectedBus, retry: false }
  )

  // Prepare efficiency chart data
  const efficiencyData = buses?.map(bus => ({
    bus: bus.bus_number,
    rate: bus.on_time_rate,
    students: bus.student_count
  })) || []

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/staff')}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowRight size={24} className="text-white" />
              </button>
              <Bus className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">إدارة الحافلات والنقل</h1>
                <p className="text-white/90">عرض وإدارة الحافلات والطرق والطلاب</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Tabs */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-2 border-2 border-gray-200 shadow-lg">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveView('buses')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                activeView === 'buses'
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              الحافلات
            </button>
            <button
              onClick={() => setActiveView('routes')}
              className={`flex-1 px-6 py-3 rounded-xl font-bold transition-all ${
                activeView === 'routes'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              الخطوط
            </button>
          </div>
        </div>

        {/* Buses View */}
        {activeView === 'buses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Buses List */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-xl font-bold text-gray-900">الحافلات النشطة</h2>
              
              {busesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">جاري التحميل...</p>
                </div>
              ) : buses && buses.length > 0 ? (
                buses.map((bus) => (
                  <div
                    key={bus.id}
                    className={`bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all cursor-pointer ${
                      selectedBus === bus.id ? 'ring-4 ring-primary-400 border-primary-400' : ''
                    }`}
                    onClick={() => setSelectedBus(selectedBus === bus.id ? null : bus.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                          <Bus className="text-white" size={32} />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">حافلة {bus.bus_number}</h3>
                          {bus.route_name && (
                            <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                              <Route size={14} />
                              {bus.route_name}
                            </p>
                          )}
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        bus.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {bus.is_active ? 'نشط' : 'غير نشط'}
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">الطلاب</p>
                        <p className="text-2xl font-bold text-blue-700">{bus.student_count}</p>
                        {bus.capacity && (
                          <p className="text-xs text-gray-500">من {bus.capacity}</p>
                        )}
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">نسبة الدقة</p>
                        <p className="text-2xl font-bold text-green-700">{bus.on_time_rate.toFixed(0)}%</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">السائق</p>
                        <p className="text-sm font-bold text-purple-700">{bus.driver_name || 'غير محدد'}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
                  <Bus className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-600">لا توجد حافلات</p>
                </div>
              )}
            </div>

            {/* Bus Details Sidebar */}
            {selectedBus && busDetails && (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">تفاصيل الحافلة</h2>
                  <button
                    onClick={() => setSelectedBus(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">رقم الحافلة</p>
                    <p className="text-lg font-bold text-gray-900">حافلة {busDetails.bus_number}</p>
                  </div>

                  {busDetails.route_name && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">اسم الخط</p>
                      <p className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <Route size={18} />
                        {busDetails.route_name}
                      </p>
                    </div>
                  )}

                  {busDetails.driver_name && (
                    <div>
                      <p className="text-sm text-gray-600 mb-1">السائق</p>
                      <p className="text-lg font-bold text-gray-900">{busDetails.driver_name}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">الطلاب</p>
                      <p className="text-xl font-bold text-blue-700">{busDetails?.student_count || 0}</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-xs text-gray-600 mb-1">نسبة الدقة</p>
                      <p className="text-xl font-bold text-green-700">{busDetails.on_time_rate.toFixed(0)}%</p>
                    </div>
                  </div>

                  {/* Students List */}
                  {busStudents && busStudents.length > 0 && (
                    <div className="mt-6">
                      <p className="text-sm font-bold text-gray-900 mb-3">الطلاب المخصصين</p>
                      <div className="space-y-2 max-h-64 overflow-y-auto">
                        {busStudents.map((student: any) => (
                          <div key={student.id} className="p-3 bg-gray-50 rounded-lg">
                            <p className="font-bold text-gray-900">{student.full_name}</p>
                            <p className="text-xs text-gray-600">{student.grade} - {student.class_name}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Efficiency Chart */}
            {efficiencyData.length > 0 && (
              <div className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="text-primary-600" size={24} />
                  <h2 className="text-xl font-bold text-gray-900">كفاءة النقل</h2>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={efficiencyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis 
                      dataKey="bus" 
                      stroke="#6b7280"
                      style={{ fontSize: '12px' }}
                    />
                    <YAxis 
                      stroke="#6b7280" 
                      style={{ fontSize: '12px' }}
                      domain={[0, 100]}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb', 
                        borderRadius: '8px'
                      }}
                      formatter={(value: any) => [`${value}%`, 'نسبة الدقة']}
                    />
                    <Legend />
                    <Bar 
                      dataKey="rate" 
                      fill="#10b981" 
                      name="نسبة الدقة"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Routes View */}
        {activeView === 'routes' && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">خطوط الحافلات</h2>
            
            {routes && routes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {routes.map((route) => (
                  <div
                    key={route.bus_id}
                    className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Route className="text-white" size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{route.route_name}</h3>
                        <p className="text-sm text-gray-600">حافلة {route.bus_number}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">الطلاب</p>
                        <p className="text-xl font-bold text-blue-700">{route.students_on_route}</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-xs text-gray-600 mb-1">محطات</p>
                        <p className="text-xl font-bold text-green-700">{route.stops_count}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
                <Route className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="text-gray-600">لا توجد خطوط حافلات</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

