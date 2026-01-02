# API Documentation - User Routes

## Base URL
```
http://localhost:5000/api
```

## Authentication
Tất cả các User endpoints yêu cầu JWT token trong header:
```
Authorization: Bearer <token>
```

---

## User Routes (Protected)

### 1. Lấy thông tin User hiện tại
**GET** `/user/`

**Headers:**
```
Authorization: Bearer <token>
```

**Response Success (201):**
```json
{
  "status": "success",
  "user": {
    "id": 1,
    "firstname": "Nguyễn Văn",
    "lastname": "A",
    "email": "nguyenvan@example.com",
    "country": "Vietnam",
    "currency": "USD",
    "contact": "0123456789",
    "createdat": "2024-01-01T00:00:00.000Z",
    "updatedat": "2024-01-01T00:00:00.000Z"
  }
}
```

**Response Error (401):**
```json
{
  "message": "Xác thực thất bại",
  "status": "auth_failed"
}
```

---

### 2. Đổi mật khẩu
**PUT** `/user/change-password`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "currentPassword": "password123",
  "newPassword": "newpassword456",
  "confirmPassword": "newpassword456"
}
```

**Response Success (200):**
```json
{
  "message": "Đổi mật khẩu thành công",
  "status": "success"
}
```

**Response Error (401):**
```json
{
  "message": "Mật khẩu hiện tại không đúng.",
  "status": "failed"
}
```

---

### 3. Cập nhật thông tin User
**PUT** `/user/`

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "firstname": "Nguyễn Văn",
  "lastname": "B",
  "country": "Vietnam",
  "currency": "VND",
  "contact": "0987654321"
}
```

**Response Success (200):**
```json
{
  "message": "Cập nhật thông tin người dùng thành công",
  "status": "success",
  "user": {
    "id": 1,
    "firstname": "Nguyễn Văn",
    "lastname": "B",
    "email": "nguyenvan@example.com",
    "country": "Vietnam",
    "currency": "VND",
    "contact": "0987654321",
    "updatedat": "2024-01-01T12:00:00.000Z"
  }
}
```

**Response Error (404):**
```json
{
  "message": "Không tìm thấy người dùng.",
  "status": "failed"
}
```

---

## Hướng dẫn Test với Postman

### Lưu ý: Cần có JWT token từ đăng nhập (xem API_Auth.md)

### Bước 1: Lấy Token
1. Đăng nhập qua endpoint `/auth/sign-in` (xem API_Auth.md)
2. Copy token từ response

### Bước 2: Test User Endpoints
1. Tạo request mới cho bất kỳ User endpoint nào
2. Vào tab **Headers**
3. Thêm header:
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`
4. Nếu là PUT request, thêm Body (JSON) như ví dụ trên
5. Click **Send**

---

## Status Codes

- **200**: Success
- **201**: Created
- **401**: Unauthorized (thiếu hoặc token không hợp lệ)
- **404**: Not Found
- **500**: Server Error

