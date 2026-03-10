import { MapPin, CheckCircle, Circle, Clock } from 'lucide-react'

interface Waypoint {
  id: string
  name: string
  time: string
  status: 'completed' | 'current' | 'upcoming'
  description?: string
}

interface RouteTimelineProps {
  waypoints: Waypoint[]
  currentLocation?: string
  estimatedArrival?: string
}

export default function RouteTimeline({
  waypoints,
  currentLocation,
  estimatedArrival,
}: RouteTimelineProps) {
  const getWaypointIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return CheckCircle
      case 'current':
        return MapPin
      case 'upcoming':
        return Circle
      default:
        return Circle
    }
  }

  const getWaypointColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-emerald-600 bg-emerald-50 border-emerald-200'
      case 'current':
        return 'text-teal-600 bg-teal-50 border-teal-200 animate-pulse'
      case 'upcoming':
        return 'text-gray-400 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-400 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="space-y-4">
      {/* Current Location Card */}
      {currentLocation && (
        <div className="bg-white rounded-card-lg shadow-card border-2 border-teal-200 p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
              <MapPin className="text-teal-600" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-600 mb-1">الموقع الحالي</p>
              <p className="text-base font-bold text-gray-900">{currentLocation}</p>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-white rounded-card-lg shadow-card border-2 border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">مسار الرحلة</h3>
        <div className="space-y-4">
          {waypoints.map((waypoint, index) => {
            const WaypointIcon = getWaypointIcon(waypoint.status)
            const colors = getWaypointColor(waypoint.status)
            const isLast = index === waypoints.length - 1

            return (
              <div key={waypoint.id} className="flex items-start gap-4">
                {/* Timeline Line */}
                {!isLast && (
                  <div className="flex flex-col items-center mt-2">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${colors}`}>
                      <WaypointIcon size={14} className={waypoint.status === 'upcoming' ? 'fill-current' : ''} />
                    </div>
                    <div className="w-0.5 h-16 bg-gray-200 mt-1" />
                  </div>
                )}
                {isLast && (
                  <div className="flex flex-col items-center mt-2">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${colors}`}>
                      <WaypointIcon size={14} className={waypoint.status === 'upcoming' ? 'fill-current' : ''} />
                    </div>
                  </div>
                )}

                {/* Waypoint Content */}
                <div className="flex-1 pb-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-bold text-gray-900">{waypoint.name}</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock size={12} />
                      <span>{waypoint.time}</span>
                    </div>
                  </div>
                  {waypoint.description && (
                    <p className="text-xs text-gray-600">{waypoint.description}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Estimated Arrival */}
        {estimatedArrival && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">الوصول المتوقع</span>
              <span className="text-base font-bold text-teal-600">{estimatedArrival}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


