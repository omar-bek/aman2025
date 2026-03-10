# دليل الإعداد - Setup Guide

## المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:
- Node.js (الإصدار 16 أو أحدث)
- MongoDB (محلي أو MongoDB Atlas)
- npm أو yarn

## خطوات الإعداد

### 1. إعداد Backend

```bash
# انتقل إلى مجلد Backend
cd backend

# ثبت الحزم
npm install

# أنشئ ملف البيئة
cp .env.example .env
```

عدّل ملف `.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
MONGODB_URI=mongodb://localhost:27017/amantac
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
```

### 2. إعداد MongoDB

#### خيار 1: MongoDB محلي
```bash
# تأكد من تشغيل MongoDB
mongod
```

#### خيار 2: MongoDB Atlas (سحابي)
1. أنشئ حساب على [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. أنشئ Cluster جديد
3. احصل على Connection String
4. ضع الـ Connection String في `MONGODB_URI`

### 3. تشغيل Backend

```bash
cd backend
npm run dev
```

الخادم سيعمل على `http://localhost:5000`

### 4. إعداد Frontend

```bash
# في terminal جديد، انتقل إلى مجلد Frontend
cd frontend

# ثبت الحزم
npm install

# شغّل التطبيق
npm run dev
```

التطبيق سيعمل على `http://localhost:3000`

## إنشاء مستخدم إداري

يمكنك إنشاء مستخدم إداري عبر API:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@example.com",
    "phone": "1234567890",
    "password": "password123",
    "role": "admin"
  }'
```

## اختبار النظام

1. افتح المتصفح على `http://localhost:3000`
2. سجّل حساب جديد أو سجّل الدخول
3. استكشف الواجهات المختلفة

## استكشاف الأخطاء

### مشكلة: MongoDB connection error
- تأكد من تشغيل MongoDB
- تحقق من `MONGODB_URI` في ملف `.env`

### مشكلة: Port already in use
- غيّر `PORT` في ملف `.env`
- أو أوقف العملية التي تستخدم المنفذ

### مشكلة: CORS error
- تأكد من `FRONTEND_URL` في ملف `.env`
- تأكد من أن Frontend يعمل على نفس الـ URL

## الإنتاج (Production)

1. غيّر `NODE_ENV=production`
2. استخدم `JWT_SECRET` قوي وآمن
3. استخدم MongoDB Atlas أو قاعدة بيانات محمية
4. فعّل HTTPS
5. استخدم متغيرات البيئة الآمنة

## الدعم

إذا واجهت أي مشاكل، راجع:
- `README.md` للوثائق الكاملة
- ملفات `package.json` للـ dependencies
- ملفات `.env.example` للإعدادات
