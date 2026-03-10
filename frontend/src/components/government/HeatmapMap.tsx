import { MapPin } from 'lucide-react'

interface HeatmapData {
  region: string
  value: number
  intensity: 'low' | 'medium' | 'high'
}

interface HeatmapMapProps {
  data: HeatmapData[]
  metric: string
  metricLabel: string
}

export default function HeatmapMap({ data, metric, metricLabel }: HeatmapMapProps) {
  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'high':
        return 'bg-emerald-700 text-white'
      case 'medium':
        return 'bg-emerald-500 text-white'
      case 'low':
        return 'bg-emerald-200 text-gray-900'
      default:
        return 'bg-sand-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex items-center justify-end gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-200 rounded"></div>
          <span className="text-gray-600">منخفض / Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded"></div>
          <span className="text-gray-600">متوسط / Medium</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-700 rounded"></div>
          <span className="text-gray-600">عالي / High</span>
        </div>
      </div>

      {/* Map Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {data.map((item, index) => (
          <div
            key={index}
            className={`
              ${getIntensityColor(item.intensity)}
              rounded-xl p-4 text-center border-2 border-gray-200
              hover:scale-105 transition-transform cursor-pointer
            `}
            title={`${item.region}: ${item.value.toFixed(1)}`}
          >
            <MapPin className="w-5 h-5 mx-auto mb-2" />
            <div className="font-bold text-sm mb-1">{item.region}</div>
            <div className="text-xs opacity-90">{item.value.toFixed(1)}</div>
          </div>
        ))}
      </div>

      {/* Tooltip Info */}
      <div className="bg-sand-50 rounded-xl p-3 border-2 border-gray-200">
        <p className="text-xs text-gray-600 text-center">
          انقر على الإمارة لعرض التفاصيل | Click on emirate to view details
        </p>
      </div>
    </div>
  )
}


