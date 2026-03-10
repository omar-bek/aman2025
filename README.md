# أمانتاك (Amantac) - نظام إدارة المدرسة

نظام متكامل لإدارة المدرسة وتتبع سلامة الطلاب مبني على **Express.js** و **React.js**

## 📋 نظرة عامة

أمانتاك هو نظام شامل يربط بين البيت والمدرسة لتتبع ومراقبة سلامة الطلاب وإدارة جميع العمليات المدرسية.

## ✨ الميزات الرئيسية

### 1. تتبع ومراقبة سلامة الطالب
- تتبع حركة الطالب (صعود الحافلة، دخول/خروج المدرسة، الوصول للمنزل)
- نظام تتبع الحافلات مع الموقع اللحظي
- تكامل مع RFID readers و GPS trackers

### 2. نظام الاستلام الآمن
- طلبات استلام من ولي الأمر
- نظام الموافقة الإلكترونية
- توليد QR Code للتحقق
- نظام التحقق عبر QR/NFC/Bluetooth

### 3. إدارة إذونات المغادرة
- طلبات مغادرة من ولي الأمر
- نظام الموافقة على مرحلتين (معلم ثم إدارة)
- توثيق كامل للطلبات

### 4. منظومة الأداء الأكاديمي والسلوكي
- إدارة الدرجات والامتحانات والواجبات
- تسجيل الملاحظات السلوكية
- نظام إشعارات للسلوك

### 5. إدارة الأنشطة والفعاليات المدرسية
- إدارة الأنشطة المدرسية
- تسجيل مشاركة الطلاب

### 6. نظام الإشعارات
- إشعارات فورية للأحداث المهمة
- إشعارات حسب الدور (ولي أمر، معلم، إدارة)

## 🛠️ التقنيات المستخدمة

### Backend
- **Node.js** & **Express.js** - إطار عمل الخادم
- **MongoDB** & **Mongoose** - قاعدة البيانات
- **JWT** - المصادقة والتوثيق
- **Socket.io** - التحديثات الفورية
- **bcryptjs** - تشفير كلمات المرور

### Frontend
- **React.js** - مكتبة واجهة المستخدم
- **React Router** - التوجيه
- **React Query** - إدارة البيانات
- **Tailwind CSS** - التصميم
- **Vite** - أداة البناء
- **Axios** - طلبات HTTP

## 📁 بنية المشروع

```
amantac/
├── backend/                 # Backend Express.js
│   ├── config/              # إعدادات قاعدة البيانات
│   ├── controllers/         # منطق العمل
│   ├── middleware/         # Middleware (Auth, Error handling)
│   ├── models/             # نماذج MongoDB
│   ├── routes/             # Routes API
│   ├── utils/             # Utilities
│   ├── server.js          # نقطة البداية
│   └── package.json       # Dependencies
│
├── frontend/              # Frontend React.js
│   ├── src/
│   │   ├── components/    # Components
│   │   ├── context/       # Context API
│   │   ├── pages/         # Pages
│   │   ├── services/      # API Services
│   │   ├── App.jsx        # App Component
│   │   └── main.jsx       # Entry Point
│   ├── package.json       # Dependencies
│   └── vite.config.js     # Vite Config
│
└── README.md              # هذا الملف
```

## 🚀 البدء السريع

### المتطلبات الأساسية
- Node.js (v16 أو أحدث)
- MongoDB (محلي أو MongoDB Atlas)
- npm أو yarn

### إعداد Backend

1. **انتقل إلى مجلد Backend**
   ```bash
   cd backend
   ```

2. **ثبت الحزم**
   ```bash
   npm install
   ```

3. **أنشئ ملف `.env`**
   ```bash
   cp .env.example .env
   ```

4. **عدّل ملف `.env`**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/amantac
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3000
   ```

5. **شغّل الخادم**
   ```bash
   npm run dev
   ```

   الخادم سيعمل على `http://localhost:5000`

### إعداد Frontend

1. **انتقل إلى مجلد Frontend**
   ```bash
   cd frontend
   ```

2. **ثبت الحزم**
   ```bash
   npm install
   ```

3. **شغّل التطبيق**
   ```bash
   npm run dev
   ```

   التطبيق سيعمل على `http://localhost:3000`

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - تسجيل مستخدم جديد
- `POST /api/auth/login` - تسجيل الدخول
- `GET /api/auth/me` - معلومات المستخدم الحالي
- `PUT /api/auth/profile` - تحديث الملف الشخصي
- `PUT /api/auth/change-password` - تغيير كلمة المرور

### Students
- `GET /api/students` - قائمة الطلاب
- `GET /api/students/:id` - تفاصيل طالب
- `POST /api/students` - إضافة طالب جديد
- `PUT /api/students/:id` - تحديث طالب
- `DELETE /api/students/:id` - حذف طالب
- `GET /api/students/:id/attendance` - سجل حضور الطالب
- `GET /api/students/:id/grades` - درجات الطالب
- `GET /api/students/:id/behavior` - سجل سلوك الطالب

### Buses
- `GET /api/buses` - قائمة الحافلات
- `GET /api/buses/:id` - تفاصيل حافلة
- `POST /api/buses` - إضافة حافلة جديدة
- `PUT /api/buses/:id` - تحديث حافلة
- `PUT /api/buses/:id/location` - تحديث موقع الحافلة
- `GET /api/buses/:id/students` - طلاب الحافلة

### Attendance
- `GET /api/attendance` - سجلات الحضور
- `POST /api/attendance` - تسجيل حضور
- `GET /api/attendance/date/:date` - الحضور حسب التاريخ
- `GET /api/attendance/stats` - إحصائيات الحضور

### Pickup
- `GET /api/pickup` - قائمة طلبات الاستلام
- `POST /api/pickup` - إنشاء طلب استلام
- `PUT /api/pickup/:id/approve` - الموافقة على طلب
- `PUT /api/pickup/:id/verify` - التحقق من الاستلام

### Dismissal
- `GET /api/dismissal` - قائمة إذونات المغادرة
- `POST /api/dismissal` - إنشاء طلب مغادرة
- `PUT /api/dismissal/:id/approve-teacher` - موافقة المعلم
- `PUT /api/dismissal/:id/approve-admin` - موافقة الإدارة

### Academic
- `GET /api/academic/grades` - قائمة الدرجات
- `POST /api/academic/grades` - إضافة درجة
- `GET /api/academic/exams` - قائمة الامتحانات
- `POST /api/academic/exams` - إضافة امتحان
- `GET /api/academic/assignments` - قائمة الواجبات
- `POST /api/academic/assignments` - إضافة واجب

### Behavior
- `GET /api/behavior` - قائمة السجل السلوكي
- `POST /api/behavior` - إضافة ملاحظة سلوكية

### Activities
- `GET /api/activities` - قائمة الأنشطة
- `POST /api/activities` - إضافة نشاط
- `POST /api/activities/:id/register` - تسجيل طالب في نشاط

### Notifications
- `GET /api/notifications` - قائمة الإشعارات
- `PUT /api/notifications/:id/read` - تحديد كمقروء
- `PUT /api/notifications/read-all` - تحديد الكل كمقروء

## 👥 الأدوار (Roles)

- **parent** - ولي الأمر: يمكنه عرض معلومات أطفاله فقط
- **teacher** - المعلم: يمكنه إدارة فصله
- **admin** - الإدارة: صلاحيات كاملة
- **staff** - الموظفين: صلاحيات محدودة
- **driver** - السائق: يمكنه تحديث موقع الحافلة

## 🔒 الأمان

- تشفير كلمات المرور باستخدام bcrypt
- JWT للمصادقة
- حماية Routes حسب الدور
- التحقق من البيانات (Validation)

## 📝 ملاحظات مهمة

1. **قاعدة البيانات**: تأكد من تشغيل MongoDB قبل تشغيل Backend
2. **JWT Secret**: غيّر `JWT_SECRET` في الإنتاج
3. **CORS**: تأكد من إعداد CORS بشكل صحيح
4. **Environment Variables**: لا تشارك ملف `.env`

## 🚧 التطوير المستقبلي

- [ ] تطبيق موبايل (React Native)
- [ ] تكامل SMS/Email notifications
- [ ] لوحة تحكم تحليلية متقدمة
- [ ] تقارير PDF
- [ ] تكامل كاميرات الحافلات
- [ ] Real-time map tracking

## 📄 الترخيص

هذا المشروع مفتوح المصدر.

## 🤝 المساهمة

نرحب بالمساهمات! يرجى فتح Issue أو Pull Request.

---

**تم إنشاء النظام بنجاح! 🎉**
