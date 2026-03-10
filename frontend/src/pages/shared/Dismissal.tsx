import { useState } from 'react'
import { useQuery } from 'react-query'
import { studentsAPI } from '../../api'
import { FileText, Plus } from 'lucide-react'

export default function Dismissal() {
  const [showForm, setShowForm] = useState(false)
  const { data: students } = useQuery('students', studentsAPI.getAll)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إذونات المغادرة</h1>
          <p className="text-gray-600 mt-1">إدارة طلبات المغادرة المبكرة</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          طلب مغادرة جديد
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">طلب مغادرة جديد</h2>
          <form className="space-y-4">
            <div>
              <label className="label">الطالب</label>
              <select className="input-field">
                <option value="">-- اختر طالب --</option>
                {students?.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.full_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">تاريخ المغادرة</label>
              <input type="date" className="input-field" />
            </div>
            <div>
              <label className="label">وقت المغادرة</label>
              <input type="time" className="input-field" />
            </div>
            <div>
              <label className="label">نوع السبب</label>
              <select className="input-field">
                <option value="medical">طبي</option>
                <option value="family">عائلي</option>
                <option value="emergency">طوارئ</option>
                <option value="other">أخرى</option>
              </select>
            </div>
            <div>
              <label className="label">تفاصيل السبب</label>
              <textarea className="input-field" rows={4}></textarea>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn-primary">
                إرسال الطلب
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">طلبات المغادرة</h2>
        <div className="text-center py-12 text-gray-500">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <p>لا توجد طلبات مغادرة حالياً</p>
        </div>
      </div>
    </div>
  )
}

