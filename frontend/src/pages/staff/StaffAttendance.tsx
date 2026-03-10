import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'
import { attendanceAPI } from '../../api'

export default function StaffAttendance() {
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])

  // This is a placeholder - in production, implement proper attendance API for staff
  const { data: attendance, isLoading } = useQuery(
    ['attendance', selectedDate],
    async () => {
      // Placeholder data
      return []
    },
    { retry: false }
  )

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
              <Calendar className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">الحضور والغياب</h1>
                <p className="text-white/90">تسجيل ومراجعة حضور الطلاب</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Date Filter */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
          <label className="block text-sm font-bold text-gray-700 mb-2">اختر التاريخ</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Placeholder Content */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
          <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">صفحة الحضور والغياب قيد التطوير</p>
        </div>
      </div>
    </div>
  )
}

