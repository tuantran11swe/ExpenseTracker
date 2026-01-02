# API Documentation - Account Routes

## Base URL

```
http://localhost:5000/api
```

## Authentication

Tất cả các Account endpoints yêu cầu JWT token trong header:

```
Authorization: Bearer <token>
```

---

## Account Routes (Protected)

### 1. Lấy tất cả tài khoản của user

**GET** `/account`

**Headers:**

```
Authorization: Bearer <token>
```

**Response Success (200):**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "account_name": "Cash",
      "account_number": "CASH001",
      "account_balance": 1000000,
      "createdat": "2024-01-01T00:00:00.000Z",
      "updatedat": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "user_id": 1,
      "account_name": "PayPal",
      "account_number": "PP001",
      "account_balance": 500000,
      "createdat": "2024-01-02T00:00:00.000Z",
      "updatedat": "2024-01-02T00:00:00.000Z"
    }
  ],
  "status": "success"
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

### 2. Lấy một tài khoản theo ID

**GET** `/account/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `id`: ID của tài khoản cần lấy

**Response Success (200):**

```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "account_name": "Cash",
    "account_number": "CASH001",
    "account_balance": 1000000,
    "createdat": "2024-01-01T00:00:00.000Z",
    "updatedat": "2024-01-01T00:00:00.000Z"
  },
  "status": "success"
}
```

**Response Error (401):**

```json
{
  "message": "Xác thực thất bại",
  "status": "auth_failed"
}
```

**Response Error (404):**

```json
{
  "message": "Tài khoản không tồn tại",
  "status": "failed"
}
```

---

### 3. Tạo tài khoản mới

**POST** `/account/create`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "name": "Cash",
  "amount": 1000000,
  "account_number": "CASH001"
}
```

**Lưu ý:**

- `name`: Tên tài khoản (Cash, Crypto, PayPal, Debit Card, v.v.)
- `amount`: Số tiền ban đầu (initial balance)
- `account_number`: Số tài khoản (tùy chọn)

**Response Success (201):**

```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "account_name": "Cash",
    "account_number": "CASH001",
    "account_balance": 1000000,
    "createdat": "2024-01-01T00:00:00.000Z",
    "updatedat": "2024-01-01T00:00:00.000Z"
  },
  "message": "Tài khoản Cash đã được tạo thành công",
  "status": "success"
}
```

**Response Error (409):**

```json
{
  "message": "Tài khoản này đã được tạo.",
  "status": "failed"
}
```

**Lưu ý:**

- Khi tạo tài khoản mới, hệ thống sẽ tự động:
  - Thêm tài khoản vào mảng `accounts` của user
  - Tạo transaction record cho khoản tiền gửi ban đầu (type: "income")

---

### 4. Nạp tiền vào tài khoản

**PUT** `/account/add-money/:id`

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `id`: ID của tài khoản cần nạp tiền

**Request Body:**

```json
{
  "amount": 500000
}
```

**Response Success (200):**

```json
{
  "data": {
    "id": 1,
    "user_id": 1,
    "account_name": "Cash",
    "account_number": "CASH001",
    "account_balance": 1500000,
    "createdat": "2024-01-01T00:00:00.000Z",
    "updatedat": "2024-01-01T12:00:00.000Z"
  },
  "message": "Nạp tiền thành công",
  "status": "success"
}
```

**Response Error (500):**

```json
{
  "message": "Error message",
  "status": "failed"
}
```

**Lưu ý:**

- Khi nạp tiền, hệ thống sẽ tự động tạo transaction record (type: "income")
- Số dư tài khoản sẽ được cập nhật tự động

---

## Hướng dẫn Test với Postman

### Lưu ý: Cần có JWT token từ đăng nhập (xem API_Auth.md)

### Bước 1: Lấy Token

1. Đăng nhập qua endpoint `/auth/sign-in` (xem API_Auth.md)
2. Copy token từ response

### Bước 2: Test Account Endpoints

#### Test GET /account (Lấy tất cả tài khoản)

1. Tạo request mới: **GET** `http://localhost:5000/api/account`
2. Vào tab **Headers**
3. Thêm header:
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`
4. Click **Send**

#### Test GET /account/:id (Lấy một tài khoản)

1. Tạo request mới: **GET** `http://localhost:5000/api/account/1`
   (Thay `1` bằng ID tài khoản thực tế)
2. Vào tab **Headers**
3. Thêm header:
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`
4. Click **Send**

#### Test POST /account/create

1. Tạo request mới: **POST** `http://localhost:5000/api/account/create`
2. Vào tab **Headers**
3. Thêm header:
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`
4. Vào tab **Body** → **raw** → **JSON**
5. Nhập request body như ví dụ trên
6. Click **Send**

#### Test PUT /account/add-money/:id

1. Tạo request mới: **PUT** `http://localhost:5000/api/account/add-money/1`
   (Thay `1` bằng ID tài khoản thực tế)
2. Vào tab **Headers**
3. Thêm header:
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`
4. Vào tab **Body** → **raw** → **JSON**
5. Nhập request body với `amount`
6. Click **Send**

---

## Status Codes

- **200**: Success
- **201**: Created
- **401**: Unauthorized (thiếu hoặc token không hợp lệ)
- **409**: Conflict (tài khoản đã tồn tại)
- **500**: Server Error
