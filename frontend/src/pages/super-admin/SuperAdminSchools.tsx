import { useState } from 'react'
import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Search, Building2, Users, TrendingUp, Shield } from 'lucide-react'
import apiClient from '../../api/client'

export default function SuperAdminSchools() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')

  const { data: schools } = useQuery(
    'super-admin-schools',
    async () => {
      try {
        const response = await apiClient.get('/super-admin/schools/')
        return response.data || []
      } catch (error) {
        console.error('Error fetching schools:', error)
        return []
      }
    }
  )

  const schoolsArray = Array.isArray(schools) ? schools : []
  const filteredSchools = schoolsArray.filter((school: any) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/super-admin')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                <ArrowRight size={24} className="text-white" />
              </button>
              <Building2 className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">المدارس</h1>
                <p className="text-white/90">نظرة عامة على جميع المدارس</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Search */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-4 border-2 border-gray-200 shadow-lg">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="ابحث عن مدرسة..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-12 pl-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Schools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchools.map((school: any) => (
            <div
              key={school.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-xl flex items-center justify-center">
                    <Building2 className="text-white" size={28} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{school.name}</h3>
                    <p className="text-sm text-gray-600">{school.location || 'غير محدد'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Users className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">الطلاب</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{school.students_count || 0}</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">معدل الحضور</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{school.attendance_rate || 0}%</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Shield className="text-gray-400" size={16} />
                    <span className="text-sm text-gray-600">نقاط الامتثال</span>
                  </div>
                  <span className="text-sm font-bold text-gray-900">{school.compliance_score || 0}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!filteredSchools || filteredSchools.length === 0) && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <Building2 className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">لا توجد مدارس</p>
          </div>
        )}
      </div>
    </div>
  )
}

