import { useNavigate, useParams } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { RouteTimeline as RouteTimelineComponent } from '../../components/parent'
import ParentBottomNav from '../../components/ParentBottomNav'

export default function RouteTimeline() {
  const navigate = useNavigate()
  const { childId } = useParams<{ childId?: string }>()

  // Mock route data
  const waypoints = [
    {
      id: '1',
      name: 'Home',
      time: '07:30',
      status: 'completed' as const,
      description: 'Boarded bus #12',
    },
    {
      id: '2',
      name: 'Bus Stop 3',
      time: '07:45',
      status: 'completed' as const,
      description: 'Picked up 3 students',
    },
    {
      id: '3',
      name: 'School Gate',
      time: '08:15',
      status: 'current' as const,
      description: 'Arrived at school',
    },
    {
      id: '4',
      name: 'Classroom 3A',
      time: '08:30',
      status: 'upcoming' as const,
      description: 'Expected arrival',
    },
  ]

  return (
    <div className="min-h-screen bg-sand-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-soft">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/parent')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Back"
            >
              <ArrowRight size={20} className="text-gray-700" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">المسار إلى المدرسة</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Simplified Map View Placeholder */}
        <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-6">
          <div className="h-[200px] bg-gradient-to-br from-teal-50 to-teal-100 rounded-xl flex items-center justify-center border-2 border-teal-200">
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-500 rounded-full flex items-center justify-center mx-auto mb-2 animate-pulse">
                <span className="text-white text-2xl">📍</span>
              </div>
              <p className="text-sm text-gray-600">خريطة المسار المبسطة</p>
              <p className="text-xs text-gray-500 mt-1">Simplified Route Map</p>
            </div>
          </div>
        </div>

        {/* Route Timeline */}
        <RouteTimelineComponent
          waypoints={waypoints}
          currentLocation="Bus Stop 3"
          estimatedArrival="08:30"
        />
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}


