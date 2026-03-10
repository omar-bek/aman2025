import { FileText, Download, Share2, Eye, Loader2, AlertCircle } from 'lucide-react'

interface ReportCardProps {
  title: string
  titleEn: string
  description: string
  descriptionEn: string
  type: 'template' | 'generated'
  status?: 'ready' | 'generating' | 'failed'
  formats?: string[]
  generatedAt?: Date
  onView?: () => void
  onDownload?: () => void
  onShare?: () => void
}

export default function ReportCard({
  title,
  titleEn,
  description,
  descriptionEn,
  type,
  status = 'ready',
  formats = ['PDF', 'Excel'],
  generatedAt,
  onView,
  onDownload,
  onShare,
}: ReportCardProps) {
  const isTemplate = type === 'template'
  const isGenerating = status === 'generating'
  const isFailed = status === 'failed'

  return (
    <div
      className={`
        bg-white rounded-2xl p-6 border-2 transition-all
        ${isGenerating ? 'border-amber-300 bg-amber-50' : isFailed ? 'border-red-200 bg-red-50' : 'border-gray-200 shadow-lg hover:shadow-xl'}
      `}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
            ${isGenerating ? 'bg-amber-100' : isFailed ? 'bg-red-100' : 'bg-teal-100'}
          `}>
            {isGenerating ? (
              <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
            ) : isFailed ? (
              <AlertCircle className="w-6 h-6 text-red-600" />
            ) : (
              <FileText className="w-6 h-6 text-teal-600" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 mb-1">{title}</h3>
            <p className="text-sm text-gray-500 mb-1">{titleEn}</p>
            <p className="text-sm text-gray-600">{description}</p>
            <p className="text-xs text-gray-500">{descriptionEn}</p>
            {generatedAt && (
              <p className="text-xs text-gray-400 mt-2">
                تم الإنشاء: {generatedAt.toLocaleDateString('ar-AE')} | Generated: {generatedAt.toLocaleDateString('en-US')}
              </p>
            )}
          </div>
        </div>
        {status && (
          <div className={`
            px-3 py-1 rounded-lg text-xs font-semibold
            ${isGenerating ? 'bg-amber-200 text-amber-800' : isFailed ? 'bg-red-200 text-red-800' : 'bg-emerald-100 text-emerald-700'}
          `}>
            {isGenerating ? 'جاري الإنشاء...' : isFailed ? 'فشل' : 'جاهز'}
          </div>
        )}
      </div>

      {formats.length > 0 && (
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs text-gray-500">الصيغ المتاحة / Formats:</span>
          {formats.map((format) => (
            <span
              key={format}
              className="px-2 py-1 bg-sand-100 text-gray-700 rounded-lg text-xs font-medium"
            >
              {format}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2">
        {isTemplate ? (
          <button
            onClick={onView}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold text-sm"
          >
            <Eye className="w-4 h-4" />
            معاينة / Preview
          </button>
        ) : (
          <>
            {status === 'ready' && (
              <>
                <button
                  onClick={onView}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition-colors font-semibold text-sm"
                >
                  <Eye className="w-4 h-4" />
                  عرض / View
                </button>
                <button
                  onClick={onDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm"
                >
                  <Download className="w-4 h-4" />
                  تحميل / Download
                </button>
                <button
                  onClick={onShare}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold text-sm"
                >
                  <Share2 className="w-4 h-4" />
                  مشاركة / Share
                </button>
              </>
            )}
            {status === 'generating' && (
              <div className="text-sm text-amber-700 font-medium">
                جاري إنشاء التقرير... | Generating report...
              </div>
            )}
            {status === 'failed' && (
              <button
                onClick={onDownload}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold text-sm"
              >
                إعادة المحاولة / Retry
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}


