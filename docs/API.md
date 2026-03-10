# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

جميع الـ endpoints (عدا `/auth/register` و `/auth/login`) تتطلب مصادقة عبر Bearer Token في Header:
```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "1234567890",
  "password": "password123",
  "role": "parent"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "parent"
  }
}
```

#### Get Current User
```http
GET /auth/me
Authorization: Bearer <token>
```

### Students

#### Get All Students
```http
GET /students?page=1&limit=25&grade=5
Authorization: Bearer <token>
```

#### Get Student by ID
```http
GET /students/:id
Authorization: Bearer <token>
```

#### Create Student
```http
POST /students
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "STU001",
  "name": "Student Name",
  "arabicName": "اسم الطالب",
  "dateOfBirth": "2010-01-01",
  "grade": "5",
  "class": "A",
  "parentIds": ["parent_id_1", "parent_id_2"],
  "rfidTag": "RFID123"
}
```

### Buses

#### Get All Buses
```http
GET /buses
Authorization: Bearer <token>
```

#### Update Bus Location
```http
PUT /buses/:id/location
Authorization: Bearer <token>
Content-Type: application/json

{
  "lat": 24.7136,
  "lng": 46.6753
}
```

### Attendance

#### Get Attendance Records
```http
GET /attendance?studentId=student_id&date=2024-01-01&type=school_entry
Authorization: Bearer <token>
```

#### Create Attendance Record
```http
POST /attendance
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "student_id",
  "type": "school_entry",
  "location": "school",
  "method": "rfid",
  "coordinates": {
    "lat": 24.7136,
    "lng": 46.6753
  }
}
```

### Pickup

#### Create Pickup Request
```http
POST /pickup
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "student_id",
  "pickupDate": "2024-01-15",
  "pickupTime": "14:30",
  "authorizedPerson": {
    "name": "Parent Name",
    "relationship": "Father",
    "phone": "1234567890"
  }
}
```

#### Approve Pickup
```http
PUT /pickup/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "approved": true
}
```

### Dismissal

#### Create Dismissal Request
```http
POST /dismissal
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "student_id",
  "dismissalDate": "2024-01-15",
  "dismissalTime": "12:00",
  "reason": "Medical appointment"
}
```

### Academic

#### Get Grades
```http
GET /academic/grades?studentId=student_id&subject=Math
Authorization: Bearer <token>
```

#### Create Grade
```http
POST /academic/grades
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "student_id",
  "subject": "Math",
  "grade": 95,
  "maxGrade": 100,
  "type": "exam"
}
```

### Behavior

#### Create Behavior Record
```http
POST /behavior
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "student_id",
  "type": "positive",
  "category": "respect",
  "description": "Helped a classmate",
  "severity": "medium"
}
```

### Activities

#### Get Activities
```http
GET /activities?type=sports&status=upcoming
Authorization: Bearer <token>
```

#### Register Student for Activity
```http
POST /activities/:id/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "studentId": "student_id"
}
```

### Notifications

#### Get Notifications
```http
GET /notifications?isRead=false&type=attendance
Authorization: Bearer <token>
```

#### Mark as Read
```http
PUT /notifications/:id/read
Authorization: Bearer <token>
```

## Error Responses

جميع الأخطاء تعيد نفس الصيغة:

```json
{
  "success": false,
  "message": "Error message here"
}
```

### Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Server Error

## Roles & Permissions

- **parent**: يمكنه عرض معلومات أطفاله فقط
- **teacher**: يمكنه إدارة فصله والطلاب
- **admin**: صلاحيات كاملة
- **staff**: صلاحيات محدودة للإدارة
- **driver**: يمكنه تحديث موقع الحافلة فقط
