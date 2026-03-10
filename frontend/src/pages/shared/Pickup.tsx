import { useState } from 'react'
import { useQuery } from 'react-query'
import { studentsAPI } from '../../api'
import { ClipboardList, Plus, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Pickup() {
  const [showForm, setShowForm] = useState(false)
  const { data: students } = useQuery('students', studentsAPI.getAll)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">الاستلام الآمن</h1>
          <p className="text-gray-600 mt-1">إدارة طلبات استلام الطلاب</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          طلب استلام جديد
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">طلب استلام جديد</h2>
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
              <label className="label">اسم المستلم</label>
              <input type="text" className="input-field" />
            </div>
            <div>
              <label className="label">رقم هاتف المستلم</label>
              <input type="tel" className="input-field" />
            </div>
            <div>
              <label className="label">صلة القرابة</label>
              <input type="text" className="input-field" placeholder="أب، أم، قريب..." />
            </div>
            <div>
              <label className="label">تاريخ الاستلام</label>
              <input type="date" className="input-field" />
            </div>
            <div>
              <label className="label">وقت الاستلام</label>
              <input type="time" className="input-field" />
            </div>
            <div>
              <label className="label">السبب</label>
              <textarea className="input-field" rows={3}></textarea>
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
        <h2 className="text-xl font-bold text-gray-900 mb-4">طلبات الاستلام</h2>
        <div className="text-center py-12 text-gray-500">
          <ClipboardList size={48} className="mx-auto mb-4 opacity-50" />
          <p>لا توجد طلبات استلام حالياً</p>
        </div>
      </div>
    </div>
  )
}

