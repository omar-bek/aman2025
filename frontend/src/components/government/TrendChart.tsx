import { Download } from 'lucide-react'
import { useState } from 'react'

interface TrendDataPoint {
  date: string
  [key: string]: string | number
}

interface TrendChartProps {
  data: TrendDataPoint[]
  metrics: string[]
  timeRange: '3' | '6' | '12' | 'custom'
  comparisonMode?: 'none' | 'yoy' | 'mom' | 'regional'
  onMetricToggle?: (metric: string) => void
}

export default function TrendChart({
  data,
  metrics,
  timeRange,
  comparisonMode = 'none',
  onMetricToggle,
}: TrendChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(metrics)

  const toggleMetric = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      const newMetrics = selectedMetrics.filter((m) => m !== metric)
      setSelectedMetrics(newMetrics)
      onMetricToggle?.(metric)
    } else {
      setSelectedMetrics([...selectedMetrics, metric])
      onMetricToggle?.(metric)
    }
  }

  const colors = ['bg-emerald-500', 'bg-teal-500', 'bg-emerald-400', 'bg-teal-400']

  return (
    <div className="space-y-4">
      {/* Chart Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-wrap">
          {metrics.map((metric, index) => (
            <button
              key={metric}
              onClick={() => toggleMetric(metric)}
              className={`
                px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                ${selectedMetrics.includes(metric)
                  ? `${colors[index % colors.length]} text-white`
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              {metric}
            </button>
          ))}
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
          aria-label="Export chart"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">تصدير / Export</span>
        </button>
      </div>

      {/* Chart Area */}
      <div className="bg-sand-50 rounded-xl p-6 border-2 border-gray-200 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 mb-2">📊</div>
          <p className="text-gray-600 font-medium mb-1">مخطط الاتجاهات / Trend Chart</p>
          <p className="text-sm text-gray-500">
            {selectedMetrics.length} مقياس محدد | {selectedMetrics.length} metric(s) selected
          </p>
          <p className="text-xs text-gray-400 mt-2">
            سيتم عرض المخطط التفاعلي هنا | Interactive chart will be displayed here
          </p>
        </div>
      </div>

      {/* Chart Legend */}
      {selectedMetrics.length > 0 && (
        <div className="flex items-center gap-4 flex-wrap">
          {selectedMetrics.map((metric, index) => (
            <div key={metric} className="flex items-center gap-2">
              <div className={`w-4 h-4 ${colors[index % colors.length]} rounded`}></div>
              <span className="text-sm text-gray-700">{metric}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}


