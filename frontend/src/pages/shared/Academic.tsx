import { BookOpen, TrendingUp, Award } from 'lucide-react'

export default function Academic() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الأداء الأكاديمي</h1>
        <p className="text-gray-600 mt-1">تتبع الدرجات والامتحانات</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="text-blue-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">متوسط الدرجات</p>
              <p className="text-2xl font-bold text-gray-900">85%</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">الامتحانات القادمة</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Award className="text-yellow-600" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-600">الواجبات المعلقة</p>
              <p className="text-2xl font-bold text-gray-900">5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">الدرجات</h2>
        <div className="text-center py-12 text-gray-500">
          <BookOpen size={48} className="mx-auto mb-4 opacity-50" />
          <p>لا توجد درجات متاحة حالياً</p>
        </div>
      </div>
    </div>
  )
}

