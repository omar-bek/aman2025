import { useQuery } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react'
import apiClient from '../../api/client'

export default function SuperAdminCompliance() {
  const navigate = useNavigate()

  const { data: compliance } = useQuery(
    'super-admin-compliance',
    async () => {
      try {
        const response = await apiClient.get('/super-admin/compliance/')
        return response.data
      } catch (error) {
        return {
          overall_score: 0,
          schools: [],
          violations: [],
        }
      }
    }
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
              <Shield className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">الامتثال والالتزام</h1>
                <p className="text-white/90">مراقبة الامتثال للسياسات</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall Score */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="text-center">
            <Shield className="mx-auto mb-4 text-indigo-600" size={48} />
            <p className="text-sm text-gray-600 mb-2">نقاط الامتثال الإجمالية</p>
            <p className="text-5xl font-bold text-indigo-600 mb-4">{compliance?.overall_score || 0}%</p>
            <div className="w-full bg-gray-200 rounded-full h-4 max-w-md mx-auto">
              <div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-4 rounded-full transition-all duration-500"
                style={{ width: `${compliance?.overall_score || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Compliance Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-2xl p-6 border-2 border-green-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle className="text-green-600" size={32} />
              <span className="text-3xl font-bold text-green-600">
                {compliance?.schools?.filter((s: any) => s.compliance_status === 'compliant').length || 0}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-700">مدارس متوافقة</p>
          </div>

          <div className="bg-yellow-50 rounded-2xl p-6 border-2 border-yellow-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <AlertTriangle className="text-yellow-600" size={32} />
              <span className="text-3xl font-bold text-yellow-600">
                {compliance?.schools?.filter((s: any) => s.compliance_status === 'warning').length || 0}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-700">مدارس تحتاج مراجعة</p>
          </div>

          <div className="bg-red-50 rounded-2xl p-6 border-2 border-red-200 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <XCircle className="text-red-600" size={32} />
              <span className="text-3xl font-bold text-red-600">
                {compliance?.schools?.filter((s: any) => s.compliance_status === 'non-compliant').length || 0}
              </span>
            </div>
            <p className="text-sm font-bold text-gray-700">مدارس غير متوافقة</p>
          </div>
        </div>

        {/* Violations */}
        {compliance?.violations && compliance.violations.length > 0 && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-4">انتهاكات الامتثال</h2>
            <div className="space-y-3">
              {compliance.violations.map((violation: any) => (
                <div
                  key={violation.id}
                  className="p-4 bg-red-50 rounded-xl border-2 border-red-200"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900">{violation.school_name}</p>
                      <p className="text-sm text-gray-600">{violation.violation_type}</p>
                    </div>
                    <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold">
                      {violation.severity}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mt-2">{violation.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

