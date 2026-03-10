import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Phone, MessageCircle, ArrowRight, Plus, Minus } from 'lucide-react'
import ParentBottomNav from '../../components/ParentBottomNav'

export default function LiveMap() {
  const navigate = useNavigate()
  const [selectedChild, setSelectedChild] = useState<string>('Nuha')
  const [zoom, setZoom] = useState(15)

  const children = [
    { id: 'Ramy', name: 'Ramy', hasAlert: true },
    { id: 'Lolly', name: 'Lolly', hasAlert: false },
    { id: 'Nuha', name: 'Nuha', hasAlert: false }
  ]

  const nearbyPeople = [
    { name: 'Mr. Adel', role: 'Teacher', emoji: '👨‍🏫' },
    { name: 'Karim', role: 'Student', emoji: '😊' },
    { name: 'Noah', role: 'Student', emoji: '😟' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-gray-600">
            <ArrowRight size={24} />
          </button>
          <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">A</span>
          </div>
          <h1 className="text-xl font-bold text-gray-900">الخريطة المباشرة</h1>
        </div>
      </div>

      {/* Child Selector */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {children.map((child) => (
            <button
              key={child.id}
              onClick={() => setSelectedChild(child.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedChild === child.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <div className="flex items-center gap-1">
                {child.name}
                {child.hasAlert && (
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Map Container */}
      <div className="relative bg-gray-200 h-96 overflow-hidden">
        {/* Map Placeholder - Replace with actual map component */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="mx-auto text-primary-600 mb-2" size={48} />
            <p className="text-gray-600">خريطة تفاعلية</p>
            <p className="text-sm text-gray-500 mt-1">سيتم إضافة خريطة حقيقية هنا</p>
          </div>
        </div>

        {/* School Geofence */}
        <div className="absolute top-10 left-10 w-32 h-32 border-4 border-green-500 rounded-full opacity-30 bg-green-100">
          <div className="absolute top-0 left-0 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
            المدرسة
          </div>
        </div>

        {/* Home Geofence */}
        <div className="absolute bottom-20 right-10 w-32 h-32 border-4 border-green-500 rounded-full opacity-30 bg-green-100">
          <div className="absolute top-0 left-0 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
            المنزل
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-2">
          <button
            onClick={() => setZoom(z => Math.min(z + 1, 20))}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
          >
            <Plus size={20} />
          </button>
          <button
            onClick={() => setZoom(z => Math.max(z - 1, 1))}
            className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-50"
          >
            <Minus size={20} />
          </button>
        </div>
      </div>

      {/* Nearby People */}
      <div className="bg-white px-4 py-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-gray-900">الأشخاص القريبين</h2>
          <button className="text-primary-600 text-sm font-medium">عرض الكل</button>
        </div>
        <div className="space-y-3">
          {nearbyPeople.map((person, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-xl">
                  {person.emoji}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{person.name}</p>
                  <p className="text-sm text-gray-500">{person.role}</p>
                </div>
              </div>
              <button className="text-primary-600">
                <MessageCircle size={20} />
              </button>
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

