import type { AttendanceTrendPoint, AttendanceAggregateSummary } from '../../api'

interface AttendanceChartsProps {
  points: AttendanceTrendPoint[]
  summary: AttendanceAggregateSummary
}

function formatDateLabel(dateString: string) {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return dateString
  return date.toLocaleDateString('ar-AE', { month: 'short', day: 'numeric' })
}

export default function AttendanceCharts({ points, summary }: AttendanceChartsProps) {
  const sortedPoints = [...points].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  const hasVisibleRates = sortedPoints.some((p) => p.attendanceRate != null)

  const highAttentionRegions = summary.attentionRegions.filter(
    (r) => r.riskLevel === 'high'
  )

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-sand-50 border-2 border-emerald-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">متوسط الحضور الوطني / National Average Attendance</p>
          <p className="text-3xl font-bold text-emerald-700">
            {summary.nationalAverageRate != null ? `${summary.nationalAverageRate.toFixed(1)}%` : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            للفترة المحددة، مع احترام قواعد إخفاء الهوية.
          </p>
        </div>
        <div className="bg-sand-50 border-2 border-teal-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">
            التغير مقابل الفترة السابقة / Change vs Previous Period
          </p>
          <p
            className={`text-3xl font-bold ${
              (summary.nationalChangeVsPrevious ?? 0) >= 0
                ? 'text-emerald-700'
                : 'text-rose-700'
            }`}
          >
            {summary.nationalChangeVsPrevious != null
              ? `${summary.nationalChangeVsPrevious >= 0 ? '+' : ''}${summary.nationalChangeVsPrevious.toFixed(
                  1
                )} نقطة`
              : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            مقارنة بفترة مماثلة، على مستوى الدولة.
          </p>
        </div>
        <div className="bg-sand-50 border-2 border-amber-200 rounded-2xl p-4">
          <p className="text-xs text-gray-500 mb-1">
            المناطق ذات الأولوية / Priority Regions
          </p>
          <p className="text-3xl font-bold text-amber-700">
            {highAttentionRegions.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            عدد الإمارات/المناطق التي تقل عن عتبة السياسة ({summary.policyThreshold}%).
          </p>
        </div>
      </div>

      {/* Simple trend visualization (policy-focused, not detailed analytics) */}
      <div className="bg-sand-50 rounded-2xl p-4 border-2 border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-gray-800">
            منحنى اتجاه الحضور / Attendance Trend Curve
          </h3>
          <p className="text-xs text-gray-500">
            عرض تجميعي على مستوى اليوم/الأسبوع، بدون عرض بيانات لمجموعات صغيرة.
          </p>
        </div>
        {!hasVisibleRates ? (
          <p className="text-sm text-gray-600 text-center py-8">
            تم إخفاء القيم التفصيلية لأن معظم نقاط البيانات تقع تحت الحد الأدنى لحجم المجموعة.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>التاريخ / Date</span>
                <span>معدل الحضور / Attendance</span>
              </div>
              <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white">
                {sortedPoints.map((point, idx) => (
                  <div
                    key={`${point.date}-${point.emirateCode}-${point.schoolType}-${idx}`}
                    className="flex items-center justify-between px-3 py-2 text-xs"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-800">
                        {formatDateLabel(point.date)}
                      </span>
                      <span className="text-[11px] text-gray-500">
                        {point.emirateCode} • {point.schoolType}
                      </span>
                    </div>
                    {point.attendanceRate != null ? (
                      <span className="font-semibold text-emerald-700">
                        {point.attendanceRate.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-700">
                        مخفي لحماية الخصوصية
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-center">
              <p className="text-sm text-gray-600 text-center px-4">
                يمكن تمثيل هذه الاتجاهات بيانياً (مخطط خطي) في المرحلة القادمة.
                حالياً يتم التركيز على قراءة سياساتية سريعة دون تفاصيل تشغيلية أو فردية.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Top / bottom emirates summary list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 border-2 border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            الإمارات الأعلى حضوراً / Highest Attendance Emirates
          </h3>
          <ul className="space-y-1 text-sm">
            {summary.topEmirates.map((e) => (
              <li key={e.emirateCode} className="flex items-center justify-between">
                <span className="font-medium text-gray-800">{e.emirateCode}</span>
                <span className="text-emerald-700 font-semibold">
                  {e.averageAttendanceRate != null ? `${e.averageAttendanceRate.toFixed(1)}%` : '—'}
                </span>
              </li>
            ))}
            {summary.topEmirates.length === 0 && (
              <li className="text-xs text-gray-500">لا توجد بيانات كافية لعرض ترتيب الإمارات.</li>
            )}
          </ul>
        </div>
        <div className="bg-white rounded-2xl p-4 border-2 border-amber-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-2">
            مناطق بحاجة إلى متابعة / Regions Requiring Attention
          </h3>
          <ul className="space-y-1 text-sm">
            {summary.attentionRegions.map((r, idx) => (
              <li key={`${r.emirateCode}-${r.regionCode || 'all'}-${idx}`} className="flex flex-col">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">
                    {r.emirateCode}
                    {r.regionCode ? ` – ${r.regionCode}` : ''}
                  </span>
                  <span className="text-amber-700 font-semibold">
                    {r.averageAttendanceRate != null ? `${r.averageAttendanceRate.toFixed(1)}%` : '—'}
                  </span>
                </div>
                <span className="text-[11px] text-gray-500">
                  الاتجاه: {
                    r.trendDirection === 'improving' ? 'يتحسن' :
                    r.trendDirection === 'deteriorating' ? 'يتدهور' :
                    r.trendDirection === 'stable' ? 'مستقر' : 'غير معروف'
                  } / المخاطر: {
                    r.riskLevel === 'high' ? 'مرتفعة' :
                    r.riskLevel === 'medium' ? 'متوسطة' : 'منخفضة'
                  }
                </span>
              </li>
            ))}
            {summary.attentionRegions.length === 0 && (
              <li className="text-xs text-gray-500">
                لا توجد مناطق تحت العتبة المحددة في الفترة الحالية.
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

