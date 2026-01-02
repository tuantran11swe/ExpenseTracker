# API Documentation - Transaction Routes

## Base URL

```
http://localhost:5000/api
```

## Authentication

Tất cả các Transaction endpoints yêu cầu JWT token trong header:

```
Authorization: Bearer <token>
```

---

## Transaction Routes (Protected)

### 1. Lấy danh sách giao dịch với filters

**GET** `/transaction/`

**Headers:**

```
Authorization: Bearer <token>
```

**Query Parameters:**

- `df` (optional): Ngày bắt đầu (date from) - Format: YYYY-MM-DD
- `dt` (optional): Ngày kết thúc (date to) - Format: YYYY-MM-DD
- `s` (optional): Từ khóa tìm kiếm (search term) - Tìm trong description, status, source

**Ví dụ:**

```
GET /transaction/?df=2024-01-01&dt=2024-01-31&s=PayPal
```

**Response Success (200):**

```json
{
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "description": "Cash - Tiền gửi ban đầu",
      "type": "income",
      "status": "Completed",
      "amount": 1000000,
      "source": "Cash",
      "createdat": "2024-01-01T00:00:00.000Z"
    },
    {
      "id": 2,
      "user_id": 1,
      "description": "Mua đồ ăn",
      "type": "expense",
      "status": "Completed",
      "amount": 50000,
      "source": "Cash",
      "createdat": "2024-01-02T00:00:00.000Z"
    }
  ],
  "status": "success"
}
```

**Lưu ý:**

- Nếu không có `df`, mặc định sẽ lấy 7 ngày gần nhất
- Nếu không có `dt`, mặc định sẽ lấy đến ngày hiện tại
- Tìm kiếm không phân biệt hoa thường (case-insensitive)
- Kết quả được sắp xếp theo ID giảm dần (mới nhất trước)

---

### 2. Lấy thông tin Dashboard

**GET** `/transaction/dashboard`

**Headers:**

```
Authorization: Bearer <token>
```

**Response Success (200):**

```json
{
  "availableBalance": 1450000,
  "chartData": [
    {
      "expense": 0,
      "income": 1000000,
      "label": "Tháng 1"
    },
    {
      "expense": 50000,
      "income": 500000,
      "label": "Tháng 2"
    },
    {
      "expense": 0,
      "income": 0,
      "label": "Tháng 3"
    }
    // ... các tháng còn lại
  ],
  "lastAccount": [
    {
      "id": 2,
      "user_id": 1,
      "account_name": "PayPal",
      "account_number": "PP001",
      "account_balance": 500000,
      "createdat": "2024-01-02T00:00:00.000Z",
      "updatedat": "2024-01-02T00:00:00.000Z"
    }
    // ... 3 tài khoản khác
  ],
  "lastTransactions": [
    {
      "id": 2,
      "user_id": 1,
      "description": "Mua đồ ăn",
      "type": "expense",
      "status": "Completed",
      "amount": 50000,
      "source": "Cash",
      "createdat": "2024-01-02T00:00:00.000Z"
    }
    // ... 4 giao dịch khác
  ],
  "status": "success",
  "totalExpense": 50000,
  "totalIncome": 1500000
}
```

**Giải thích Response:**

- `availableBalance`: Số dư khả dụng = tổng thu nhập - tổng chi tiêu
- `totalIncome`: Tổng thu nhập từ tất cả giao dịch
- `totalExpense`: Tổng chi tiêu từ tất cả giao dịch
- `chartData`: Mảng 12 tháng với income và expense cho mỗi tháng trong năm hiện tại
- `lastTransactions`: 5 giao dịch gần nhất
- `lastAccount`: 4 tài khoản gần nhất

---

### 3. Tạo giao dịch chi tiêu mới

**POST** `/transaction/add-transaction/:account_id`

**Headers:**

```
Authorization: Bearer <token>
```

**URL Parameters:**

- `account_id`: ID của tài khoản để thực hiện giao dịch chi tiêu

**Request Body:**

```json
{
  "description": "Mua đồ ăn",
  "source": "Cash",
  "amount": 50000
}
```

**Response Success (200):**

```json
{
  "message": "Giao dịch đã được thực hiện thành công.",
  "status": "success"
}
```

**Response Error (403):**

```json
{
  "message": "Vui lòng cung cấp đầy đủ thông tin!",
  "status": "failed"
}
```

**Response Error (403):**

```json
{
  "message": "Số tiền phải lớn hơn 0.",
  "status": "failed"
}
```

**Response Error (403):**

```json
{
  "message": "Giao dịch thất bại. Số dư tài khoản không đủ.",
  "status": "failed"
}
```

**Response Error (404):**

```json
{
  "message": "Thông tin tài khoản không hợp lệ.",
  "status": "failed"
}
```

**Lưu ý:**

- Hệ thống sử dụng database transaction để đảm bảo tính nhất quán
- Số dư tài khoản sẽ được tự động trừ đi số tiền chi tiêu
- Giao dịch sẽ được tạo với type: "expense" và status: "Completed"
- Nếu số dư không đủ, giao dịch sẽ bị từ chối

---

### 4. Chuyển tiền giữa các tài khoản

**PUT** `/transaction/transfer-money`

**Headers:**

```
Authorization: Bearer <token>
```

**Request Body:**

```json
{
  "from_account": 1,
  "to_account": 2,
  "amount": 200000
}
```

**Giải thích:**

- `from_account`: ID của tài khoản gửi
- `to_account`: ID của tài khoản nhận
- `amount`: Số tiền cần chuyển

**Response Success (201):**

```json
{
  "message": "Chuyển tiền thành công",
  "status": "success"
}
```

**Response Error (403):**

```json
{
  "message": "Vui lòng cung cấp đầy đủ thông tin!",
  "status": "failed"
}
```

**Response Error (403):**

```json
{
  "message": "Số tiền phải lớn hơn 0.",
  "status": "failed"
}
```

**Response Error (403):**

```json
{
  "message": "Chuyển tiền thất bại. Số dư tài khoản không đủ.",
  "status": "failed"
}
```

**Response Error (404):**

```json
{
  "message": "Không tìm thấy thông tin tài khoản gửi.",
  "status": "failed"
}
```

**Response Error (404):**

```json
{
  "message": "Không tìm thấy tài khoản nhận.",
  "status": "failed"
}
```

**Lưu ý:**

- Hệ thống sử dụng database transaction để đảm bảo tính nhất quán
- Số dư tài khoản gửi sẽ được trừ đi
- Số dư tài khoản nhận sẽ được cộng thêm
- Tạo 2 transaction records:
  - Tài khoản gửi: type "expense" với description "Chuyển tiền từ..."
  - Tài khoản nhận: type "income" với description "Nhận tiền từ..."
- Nếu có lỗi xảy ra, tất cả thay đổi sẽ được rollback

---

## Hướng dẫn Test với Postman

### Lưu ý: Cần có JWT token từ đăng nhập (xem API_Auth.md)

### Bước 1: Lấy Token

1. Đăng nhập qua endpoint `/auth/sign-in` (xem API_Auth.md)
2. Copy token từ response

### Bước 2: Test Transaction Endpoints

#### Test GET /transaction/

1. Tạo request mới: **GET** `http://localhost:5000/api/transaction/`
2. Vào tab **Headers**
3. Thêm header:
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`
4. (Optional) Vào tab **Params** để thêm query parameters:
   - `df`: 2024-01-01
   - `dt`: 2024-01-31
   - `s`: PayPal
5. Click **Send**

#### Test GET /transaction/dashboard

1. Tạo request mới: **GET** `http://localhost:5000/api/transaction/dashboard`
2. Vào tab **Headers**
3. Thêm header:
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`
4. Click **Send**

#### Test POST /transaction/add-transaction/:account_id

1. Tạo request mới: **POST** `http://localhost:5000/api/transaction/add-transaction/1`
   (Thay `1` bằng ID tài khoản thực tế)
2. Vào tab **Headers**
3. Thêm header:
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`
4. Vào tab **Body** → **raw** → **JSON**
5. Nhập request body như ví dụ trên
6. Click **Send**

#### Test PUT /transaction/transfer-money

1. Tạo request mới: **PUT** `http://localhost:5000/api/transaction/transfer-money`
2. Vào tab **Headers**
3. Thêm header:
   - Key: `Authorization`
   - Value: `Bearer <paste_token_here>`
4. Vào tab **Body** → **raw** → **JSON**
5. Nhập request body với `from_account`, `to_account`, và `amount`
6. Click **Send**

---

## Status Codes

- **200**: Success
- **201**: Created
- **401**: Unauthorized (thiếu hoặc token không hợp lệ)
- **403**: Forbidden (thiếu thông tin, số tiền không hợp lệ, hoặc số dư không đủ)
- **404**: Not Found (tài khoản không tồn tại)
- **500**: Server Error
