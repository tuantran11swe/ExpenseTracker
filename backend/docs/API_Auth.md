# API Documentation - Auth Routes

## Base URL
```
http://localhost:5000/api
```

---

## Auth Routes

### 1. Đăng ký User mới
**POST** `/auth/sign-up`

**Request Body:**
```json
{
  "firstName": "Nguyễn Văn",
  "email": "nguyenvan@example.com",
  "password": "password123"
}
```

**Response Success (201):**
```json
{
  "message": "Tạo tài khoản thành công",
  "status": "success",
  "user": {
    "id": 1,
    "firstname": "Nguyễn Văn",
    "email": "nguyenvan@example.com",
    "currency": "USD",
    "createdat": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (409):**
```json
{
  "message": "Email đã tồn tại. Vui lòng đăng nhập",
  "status": "failed"
}
```

---

### 2. Đăng nhập
**POST** `/auth/sign-in`

**Request Body:**
```json
{
  "email": "nguyenvan@example.com",
  "password": "password123"
}
```

**Response Success (200):**
```json
{
  "message": "Đăng nhập thành công",
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstname": "Nguyễn Văn",
    "email": "nguyenvan@example.com",
    "currency": "USD"
  }
}
```

**Response Error (404):**
```json
{
  "message": "Email hoặc mật khẩu không hợp lệ",
  "status": "failed"
}
```

---

## Hướng dẫn Test với Postman

### Bước 1: Đăng ký User
1. Tạo request mới: **POST** `http://localhost:5000/api/auth/sign-up`
2. Chọn tab **Body** → **raw** → **JSON**
3. Nhập request body như ví dụ trên
4. Click **Send**
5. Lưu lại email và password để test đăng nhập

### Bước 2: Đăng nhập
1. Tạo request mới: **POST** `http://localhost:5000/api/auth/sign-in`
2. Chọn tab **Body** → **raw** → **JSON**
3. Nhập email và password đã đăng ký
4. Click **Send**
5. **Copy token** từ response để dùng cho các User endpoints

---

## Status Codes

- **200**: Success
- **201**: Created
- **404**: Not Found (thiếu thông tin hoặc email/password không đúng)
- **409**: Conflict (email đã tồn tại)
- **500**: Server Error

