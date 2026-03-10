import type { AttendanceAggregateSummary, AttendanceTrendFilter } from '../../api'

interface AttendancePolicySummaryProps {
  summary: AttendanceAggregateSummary
  filters: AttendanceTrendFilter
}

function describeTimeframe(filters: AttendanceTrendFilter) {
  switch (filters.timeframe) {
    case 'last_30_days':
      return 'آخر 30 يوماً'
    case 'current_term':
      return 'الفصل الدراسي الحالي'
    case 'current_year':
      return 'العام الدراسي الحالي'
    case 'custom':
      if (filters.startDate && filters.endDate) {
        return `من ${filters.startDate} إلى ${filters.endDate}`
      }
      return 'نطاق زمني مخصص'
    default:
      return ''
  }
}

export default function AttendancePolicySummary({
  summary,
  filters,
}: AttendancePolicySummaryProps) {
  const timeframeLabel = describeTimeframe(filters)

  const improving = (summary.nationalChangeVsPrevious ?? 0) > 0.5
  const deteriorating = (summary.nationalChangeVsPrevious ?? 0) < -0.5

  const highRiskRegions = summary.attentionRegions.filter((r) => r.riskLevel === 'high')
  const mediumRiskRegions = summary.attentionRegions.filter((r) => r.riskLevel === 'medium')

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">
            ملخص سياساتي للحضور / Policy-Level Attendance Summary
          </h2>
          <p className="text-sm text-gray-500">
            للفترة: {timeframeLabel} – بيانات مجمعة وطنياً وإقليمياً، بدون أي معرفات فردية أو مدرسية.
          </p>
        </div>
      </div>

      {/* Key findings */}
      <section className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Key findings</h3>
        <ul className="list-disc pr-5 space-y-1 text-sm text-gray-700">
          <li>
            متوسط الحضور الوطني في الفترة المحددة هو{' '}
            {summary.nationalAverageRate != null ? `${summary.nationalAverageRate.toFixed(1)}%` : 'غير متوفر'}، مع
            مقارنة مبنية على بيانات مجمعة فقط.
          </li>
          {summary.nationalChangeVsPrevious != null && (
            <li>
              مقارنة بالفترة المماثلة السابقة، سجل النظام تغيّراً قدره{' '}
              {summary.nationalChangeVsPrevious >= 0 ? '+' : ''}
              {summary.nationalChangeVsPrevious.toFixed(1)} نقطة مئوية على المستوى الوطني.
            </li>
          )}
          {summary.topEmirates.length > 0 && (
            <li>
              تظهر أفضل معدلات الحضور في عدد محدود من الإمارات (مثل{' '}
              {summary.topEmirates
                .slice(0, 3)
                .map((e) => e.emirateCode)
                .join(', ')}
              ) دون عرض بيانات تفصيلية على مستوى المدرسة.
            </li>
          )}
          {summary.attentionRegions.length > 0 ? (
            <li>
              توجد {summary.attentionRegions.length} إمارة/منطقة تحت عتبة السياسة المعتمدة للحضور (
              {summary.policyThreshold}%)، مصنّفة حسب مستوى المخاطر (منخفض، متوسط، مرتفع).
            </li>
          ) : (
            <li>لا توجد مناطق حالياً تحت عتبة السياسة المعتمدة للحضور في الفترة المحددة.</li>
          )}
        </ul>
      </section>

      {/* Policy implications */}
      <section className="mb-4">
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Policy implications</h3>
        <ul className="list-disc pr-5 space-y-1 text-sm text-gray-700">
          {improving && (
            <li>
              الاتجاه العام للحضور يتحسن على المستوى الوطني، ما يدعم الاستمرار في السياسات الحالية مع تعزيزها
              في المناطق ذات الأداء الأضعف.
            </li>
          )}
          {deteriorating && (
            <li>
              الاتجاه العام للحضور يتراجع على المستوى الوطني، ما يستدعي مراجعة برامج الدعم والتحفيز في جميع
              الإمارات مع تركيز خاص على المناطق ذات المخاطر المرتفعة.
            </li>
          )}
          {!improving && !deteriorating && (
            <li>
              استقرار معدلات الحضور الوطنية يشير إلى حاجة لاستثمارات سياساتية موجّهة للمناطق ذات المخاطر
              المتوسطة والمرتفعة بدلاً من تدخلات عامة واسعة.
            </li>
          )}
          {highRiskRegions.length > 0 && (
            <li>
              المناطق المصنّفة بمستوى مخاطر مرتفع تستدعي تدخلات سياساتية مركّزة (برامج متابعة الحضور،
              إشراف مشترك مع الجهات التعليمية المحلية، ودعم اجتماعي إضافي للأسر) مع احترام الضوابط
              القانونية للبيانات.
            </li>
          )}
          {mediumRiskRegions.length > 0 && (
            <li>
              المناطق ذات المخاطر المتوسطة يمكن إدراجها في برامج وقائية (حملات توعوية، أدوات رقمية للمتابعة
              المبكرة) لمنع تدهور المؤشرات إلى مستوى المخاطر المرتفعة.
            </li>
          )}
        </ul>
      </section>

      {/* Suggested measures */}
      <section>
        <h3 className="text-sm font-semibold text-gray-800 mb-2">Suggested measures</h3>
        <ul className="list-disc pr-5 space-y-1 text-sm text-gray-700">
          <li>
            اعتماد برنامج وطني موحّد لمتابعة الحضور على مستوى الإمارة/المنطقة فقط، مع مؤشرات أداء واضحة
            للمديريات التعليمية، بدون تتبّع فردي على مستوى الطالب في هذا المستوى من التقارير.
          </li>
          <li>
            توجيه فرق الإشراف والدعم التربوي إلى الإمارات/المناطق ذات المخاطر المرتفعة والمتوسطة، بناءً على
            المؤشرات المجمعة، لتطوير خطط عمل مشتركة مع السلطات المحلية.
          </li>
          <li>
            ربط نتائج الحضور المجمعة ببرامج تحفيزية على مستوى النظام (مثل دعم إضافي للمديريات التي تحسّن
            معدلات الحضور لفترتين متتاليتين) مع ضمان عدم استخدام البيانات في تقييمات فردية للطلاب.
          </li>
          <li>
            مراجعة دورية لعتبة السياسة المعتمدة للحضور ({summary.policyThreshold}%) للتأكد من اتساقها مع
            الأهداف الوطنية ومعايير المقارنة الدولية، مع الإبقاء على قواعد إخفاء الهوية وعدم إظهار أي خلايا
            بأعداد صغيرة.
          </li>
        </ul>
      </section>
    </div>
  )
}

