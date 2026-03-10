import { Award, Calendar } from 'lucide-react'

export default function Activities() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">الأنشطة المدرسية</h1>
        <p className="text-gray-600 mt-1">الفعاليات والأنشطة</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">الأنشطة القادمة</h2>
        <div className="text-center py-12 text-gray-500">
          <Calendar size={48} className="mx-auto mb-4 opacity-50" />
          <p>لا توجد أنشطة قادمة حالياً</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">مشاركات الطالب</h2>
        <div className="text-center py-12 text-gray-500">
          <Award size={48} className="mx-auto mb-4 opacity-50" />
          <p>لا توجد مشاركات حالياً</p>
        </div>
      </div>
    </div>
  )
}

