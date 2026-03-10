# دليل البدء السريع - Quick Start Guide

## 🚀 البدء في 5 دقائق

### الخطوة 1: إعداد Backend

```bash
cd backend
npm install
cp .env.example .env
# عدّل ملف .env حسب احتياجك
npm run dev
```

### الخطوة 2: إعداد Frontend

```bash
cd frontend
npm install
npm run dev
```

### الخطوة 3: افتح المتصفح

افتح `http://localhost:3000` وسجّل حساب جديد!

## 📝 إنشاء مستخدم إداري

```bash
cd backend
npm run setup
```

سيتم إنشاء مستخدم إداري:
- Email: `admin@amantac.com`
- Password: `admin123`

⚠️ **مهم**: غيّر كلمة المرور بعد أول تسجيل دخول!

## ✅ التحقق من أن كل شيء يعمل

1. Backend يعمل على `http://localhost:5000`
2. Frontend يعمل على `http://localhost:3000`
3. MongoDB متصل

## 🎯 الخطوات التالية

1. سجّل حساب ولي أمر جديد
2. أضف طلاب (يتطلب صلاحيات إدارية)
3. استكشف الواجهات المختلفة

## 🆘 مشاكل شائعة

### MongoDB لا يتصل
```bash
# تأكد من تشغيل MongoDB
mongod
```

### Port مستخدم
```bash
# غيّر PORT في ملف .env
PORT=5001
```

### CORS Error
تأكد من أن `FRONTEND_URL` في `.env` صحيح:
```
FRONTEND_URL=http://localhost:3000
```

---

**جاهز للبدء! 🎉**
