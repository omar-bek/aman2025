import { Award, ThumbsUp, ThumbsDown } from 'lucide-react'

export default function Behavior() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">السلوك</h1>
        <p className="text-gray-600 mt-1">تتبع السلوك والملاحظات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <ThumbsUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">ملاحظات إيجابية</p>
              <p className="text-2xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-100 rounded-lg">
              <ThumbsDown className="text-red-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">ملاحظات سلبية</p>
              <p className="text-2xl font-bold text-gray-900">2</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">سجل السلوك</h2>
        <div className="text-center py-12 text-gray-500">
          <Award size={48} className="mx-auto mb-4 opacity-50" />
          <p>لا توجد ملاحظات سلوكية حالياً</p>
        </div>
      </div>
    </div>
  )
}

