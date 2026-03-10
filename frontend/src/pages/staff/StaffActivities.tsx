import { useNavigate } from 'react-router-dom'
import { ArrowRight, Activity } from 'lucide-react'

export default function StaffActivities() {
  const navigate = useNavigate()

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
              <Activity className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">إدارة الأنشطة المدرسية</h1>
                <p className="text-white/90">إدارة وتنظيم الأنشطة والفعاليات</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
          <Activity className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600">صفحة الأنشطة المدرسية قيد التطوير</p>
        </div>
      </div>
    </div>
  )
}

