import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Plus, AlertTriangle, FileText, Calendar, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import apiClient from '../../api/client'

export default function DriverIncidents() {
  const navigate = useNavigate()
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [formData, setFormData] = useState({
    incident_type: 'delay' as 'delay' | 'accident' | 'breakdown' | 'other',
    description: '',
    location: '',
    severity: 'low' as 'low' | 'medium' | 'high',
  })
  const queryClient = useQueryClient()

  const { data: incidents } = useQuery(
    'driver-incidents',
    async () => {
      try {
        const response = await apiClient.get('/driver/incidents/')
        return response.data || []
      } catch (error) {
        console.error('Error fetching incidents:', error)
        return []
      }
    }
  )

  const createMutation = useMutation(
    async (data: any) => {
      const response = await apiClient.post('/driver/incidents/', data)
      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('driver-incidents')
        toast.success('تم تسجيل الحادث بنجاح')
        setShowCreateModal(false)
        setFormData({
          incident_type: 'delay',
          description: '',
          location: '',
          severity: 'low',
        })
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.detail || 'فشل تسجيل الحادث')
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createMutation.mutate(formData)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-100 text-red-700 border-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300'
      case 'low':
        return 'bg-blue-100 text-blue-700 border-blue-300'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300'
    }
  }

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'عالي'
      case 'medium':
        return 'متوسط'
      case 'low':
        return 'منخفض'
      default:
        return severity
    }
  }

  const getIncidentTypeText = (type: string) => {
    switch (type) {
      case 'delay':
        return 'تأخير'
      case 'accident':
        return 'حادث'
      case 'breakdown':
        return 'عطل'
      case 'other':
        return 'أخرى'
      default:
        return type
    }
  }

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
              <AlertTriangle className="text-white" size={32} />
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">تقرير الحوادث</h1>
                <p className="text-white/90">تسجيل الحوادث والطوارئ</p>
              </div>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl hover:bg-white/30 transition-colors text-white font-bold flex items-center gap-2"
            >
              <Plus size={20} />
              تقرير جديد
            </button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Incidents List */}
        <div className="space-y-4">
          {incidents?.map((incident: any) => (
            <div
              key={incident.id}
              className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-gray-900">{getIncidentTypeText(incident.incident_type)}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${getSeverityColor(incident.severity)}`}>
                      {getSeverityText(incident.severity)}
                    </span>
                  </div>
                  {incident.location && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin size={16} />
                      <span>{incident.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={16} />
                    <span>
                      {new Date(incident.created_at).toLocaleString('ar-SA')}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 p-3 bg-gray-50 rounded-lg">{incident.description}</p>
            </div>
          ))}
        </div>

        {(!incidents || incidents.length === 0) && (
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-12 text-center border-2 border-gray-200 shadow-lg">
            <AlertTriangle className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">لا توجد حوادث مسجلة</p>
          </div>
        )}
      </div>

      {/* Create Incident Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">تقرير حادث جديد</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">نوع الحادث</label>
                <select
                  className="input-field"
                  value={formData.incident_type}
                  onChange={(e) => setFormData({ ...formData, incident_type: e.target.value as any })}
                  required
                >
                  <option value="delay">تأخير</option>
                  <option value="accident">حادث</option>
                  <option value="breakdown">عطل</option>
                  <option value="other">أخرى</option>
                </select>
              </div>

              <div>
                <label className="label">الخطورة</label>
                <select
                  className="input-field"
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                  required
                >
                  <option value="low">منخفض</option>
                  <option value="medium">متوسط</option>
                  <option value="high">عالي</option>
                </select>
              </div>

              <div>
                <label className="label">الموقع (اختياري)</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="موقع الحادث"
                />
              </div>

              <div>
                <label className="label">الوصف</label>
                <textarea
                  className="input-field"
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="وصف تفصيلي للحادث..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={createMutation.isLoading}
                  className="flex-1 btn-primary disabled:opacity-50"
                >
                  {createMutation.isLoading ? 'جاري الحفظ...' : 'تسجيل الحادث'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

