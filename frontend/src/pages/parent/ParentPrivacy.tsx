import { useNavigate } from 'react-router-dom'
import { ArrowRight, Shield, Lock, Eye, EyeOff, Database, Trash2, Download, Bell } from 'lucide-react'
import ParentBottomNav from '../../components/ParentBottomNav'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ParentPrivacy() {
  const navigate = useNavigate()
  const [showDataPreview, setShowDataPreview] = useState(false)

  const handleExportData = () => {
    toast.success('سيتم إرسال بياناتك إلى بريدك الإلكتروني')
  }

  const handleDeleteData = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع بياناتك؟ هذا الإجراء لا يمكن التراجع عنه.')) {
      toast.success('تم إرسال طلب حذف البيانات')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/parent/profile')} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
              <ArrowRight size={24} className="text-white" />
            </button>
            <h1 className="text-2xl font-bold text-white">الخصوصية والبيانات</h1>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Privacy Settings */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Shield className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">إعدادات الخصوصية</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <Eye className="text-gray-600" size={20} />
                <div>
                  <p className="font-bold text-gray-900">إظهار الموقع</p>
                  <p className="text-xs text-gray-600">السماح للمدرسة برؤية موقع طفلك</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <Bell className="text-gray-600" size={20} />
                <div>
                  <p className="font-bold text-gray-900">الإشعارات الفورية</p>
                  <p className="text-xs text-gray-600">تلقي إشعارات فورية عن حالة طفلك</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <Database className="text-gray-600" size={20} />
                <div>
                  <p className="font-bold text-gray-900">مشاركة البيانات</p>
                  <p className="text-xs text-gray-600">السماح بمشاركة البيانات للتحليلات</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-['] after:absolute after:top-[2px] after:right-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border-2 border-gray-200 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <Database className="text-white" size={24} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">إدارة البيانات</h2>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => setShowDataPreview(!showDataPreview)}
              className="w-full p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:border-blue-300 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <Eye className="text-blue-600" size={20} />
                <div className="text-right">
                  <p className="font-bold text-gray-900">معاينة البيانات</p>
                  <p className="text-xs text-gray-600">عرض البيانات المحفوظة عنك</p>
                </div>
              </div>
              <ArrowRight className="text-blue-600" size={20} />
            </button>

            {showDataPreview && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm text-gray-700 mb-2">البيانات المحفوظة:</p>
                <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                  <li>معلومات الحساب الشخصي</li>
                  <li>معلومات الأطفال</li>
                  <li>سجل الحضور والغياب</li>
                  <li>سجل الرسائل</li>
                  <li>سجل الأنشطة</li>
                </ul>
              </div>
            )}

            <button
              onClick={handleExportData}
              className="w-full p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 hover:border-green-300 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <Download className="text-green-600" size={20} />
                <div className="text-right">
                  <p className="font-bold text-gray-900">تصدير البيانات</p>
                  <p className="text-xs text-gray-600">تحميل نسخة من جميع بياناتك</p>
                </div>
              </div>
              <ArrowRight className="text-green-600" size={20} />
            </button>

            <button
              onClick={handleDeleteData}
              className="w-full p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200 hover:border-red-300 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="text-red-600" size={20} />
                <div className="text-right">
                  <p className="font-bold text-gray-900">حذف الحساب</p>
                  <p className="text-xs text-gray-600">حذف جميع بياناتك بشكل دائم</p>
                </div>
              </div>
              <ArrowRight className="text-red-600" size={20} />
            </button>
          </div>
        </div>

        {/* Security Info */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl p-6 border-2 border-purple-200 shadow-lg">
          <div className="flex items-start gap-3">
            <Lock className="text-purple-600 mt-1" size={20} />
            <div>
              <p className="font-bold text-gray-900 mb-2">حماية بياناتك</p>
              <p className="text-sm text-gray-700 leading-relaxed">
                نحن نستخدم تشفير SSL/TLS لحماية بياناتك. جميع البيانات محمية وفقاً لقوانين حماية البيانات الشخصية.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <ParentBottomNav />
    </div>
  )
}

