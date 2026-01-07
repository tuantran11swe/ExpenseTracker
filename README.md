# 💰 ExpenseTracker - Hệ Thống Quản Lý Tài Chính Cá Nhân

<div align="center">

Ứng dụng web full-stack toàn diện để theo dõi chi tiêu cá nhân, quản lý nhiều tài khoản ngân hàng và trực quan hóa dữ liệu tài chính.

**Công Nghệ:** PERN (PostgreSQL + Express + React + Node.js)

</div>

---

## 📋 Mục Lục

- [Tính Năng](#-tính-năng)
- [Công Nghệ Sử Dụng](#-công-nghệ-sử-dụng)
- [Cấu Trúc Dự Án](#-cấu-trúc-dự-án)
- [Yêu Cầu](#-yêu-cầu)
- [Cài Đặt](#-cài-đặt)
- [Cấu Hình](#-cấu-hình)
- [Chạy Ứng Dụng](#-chạy-ứng-dụng)
- [Tài Liệu API](#-tài-liệu-api)
- [Cấu Trúc Cơ Sở Dữ Liệu](#-cấu-trúc-cơ-sở-dữ-liệu)
- [Scripts](#-scripts)
- [Đóng Góp](#-đóng-góp)
- [Giấy Phép](#-giấy-phép)

---

## ✨ Tính Năng

### 🔐 Xác Thực & Phân Quyền
- Xác thực truyền thống bằng email/mật khẩu
- Đăng nhập mạng xã hội (Google, GitHub) qua Firebase
- Xác thực dựa trên JWT token
- Mã hóa mật khẩu với bcrypt
- Bảo vệ routes và API endpoints

### 📊 Dashboard & Phân Tích
- Tổng quan tài chính theo thời gian thực
- Thống kê tổng số dư, thu nhập và chi tiêu
- Biểu đồ đường tương tác cho xu hướng giao dịch
- Biểu đồ tròn cho trực quan hóa thu nhập vs chi tiêu
- Tóm tắt các giao dịch gần đây
- Hiển thị các tài khoản được truy cập gần nhất

### 💳 Quản Lý Tài Khoản
- Tạo nhiều tài khoản ngân hàng
- Theo dõi số dư từng tài khoản
- Nạp tiền vào tài khoản
- Chuyển tiền giữa các tài khoản
- Xem lịch sử giao dịch tài khoản

### 💸 Quản Lý Giao Dịch
- Thêm giao dịch thu nhập và chi tiêu
- Mô tả chi tiết giao dịch
- Theo dõi trạng thái giao dịch (Đang chờ/Hoàn thành)
- Lọc giao dịch theo khoảng thời gian
- Xuất giao dịch sang CSV/Excel
- Phân loại giao dịch theo nguồn

### ⚙️ Cài Đặt Người Dùng
- Cập nhật thông tin cá nhân (tên, liên hệ)
- Đổi mật khẩu
- Thiết lập đơn vị tiền tệ ưa thích
- Cấu hình cài đặt quốc gia
- Quản lý tài khoản

---

## 🛠 Công Nghệ Sử Dụng

### Frontend
- **Framework:** React 19
- **Công Cụ Build:** Vite 7
- **Routing:** React Router DOM v7
- **Quản Lý State:** Zustand
- **Styling:** Tailwind CSS v4
- **HTTP Client:** Axios
- **Xử Lý Form:** React Hook Form + Zod validation
- **Biểu Đồ:** Recharts
- **Xác Thực:** Firebase
- **UI Components:** Headless UI, Lucide React Icons
- **Thông Báo:** Sonner
- **Chất Lượng Code:** ESLint, BiomeJS

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js v5
- **Cơ Sở Dữ Liệu:** PostgreSQL
- **Xác Thực:** JSON Web Tokens (JWT)
- **Mã Hóa Mật Khẩu:** bcrypt
- **Biến Môi Trường:** dotenv
- **CORS:** cors middleware
- **Chất Lượng Code:** BiomeJS
- **Development:** Nodemon

---

## 📁 Cấu Trúc Dự Án

```
ExpenseTracker/
├── backend/                    # Backend API server
│   ├── controllers/            # Xử lý request
│   │   ├── accountController.js
│   │   ├── authController.js
│   │   ├── transactionController.js
│   │   └── userController.js
│   ├── docs/                   # Tài liệu API
│   │   ├── API_Account.md
│   │   ├── API_Auth.md
│   │   ├── API_Transaction.md
│   │   └── API_User.md
│   ├── libs/                   # Thư viện tiện ích
│   │   ├── database.js         # Kết nối PostgreSQL
│   │   └── index.js            # Hàm helper
│   ├── middleware/             # Express middlewares
│   │   └── authMiddleware.js   # Xác thực JWT
│   ├── routes/                 # API routes
│   │   ├── accountRoutes.js
│   │   ├── authRoutes.js
│   │   ├── index.js
│   │   ├── transactionRoutes.js
│   │   └── userRoutes.js
│   ├── biome.json              # Cấu hình BiomeJS
│   ├── package.json
│   └── server.js               # Điểm khởi chạy
│
├── frontend/                   # Ứng dụng React
│   ├── src/
│   │   ├── components/         # Components tái sử dụng
│   │   │   ├── ui/             # Components UI cơ bản
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   └── Input.jsx
│   │   │   ├── wrappers/       # HOC components
│   │   │   │   ├── DialogWrapper.jsx
│   │   │   │   └── TransitionWrapper.jsx
│   │   │   ├── AccountMenu.jsx
│   │   │   ├── Accounts.jsx
│   │   │   ├── AddAccount.jsx
│   │   │   ├── AddMoney.jsx
│   │   │   ├── AddTransaction.jsx
│   │   │   ├── ChangePasswordForm.jsx
│   │   │   ├── Chart.jsx
│   │   │   ├── DataRange.jsx
│   │   │   ├── DoughnutChart.jsx
│   │   │   ├── Info.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── RecentTransactions.jsx
│   │   │   ├── Separator.jsx
│   │   │   ├── SettingsForm.jsx
│   │   │   ├── SocialAuth.jsx
│   │   │   ├── Stats.jsx
│   │   │   ├── Title.jsx
│   │   │   ├── TransferMoney.jsx
│   │   │   └── ViewTransaction.jsx
│   │   ├── libs/               # Tiện ích Frontend
│   │   │   ├── api.js          # Axios instance
│   │   │   ├── firebaseConfig.js
│   │   │   └── index.js
│   │   ├── pages/              # Trang routes
│   │   │   ├── auth/
│   │   │   │   ├── SignIn.jsx
│   │   │   │   └── SignUp.jsx
│   │   │   ├── AccountPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SettingsPage.jsx
│   │   │   └── TransactionsPage.jsx
│   │   ├── store/              # Quản lý state
│   │   │   └── index.js        # Zustand store
│   │   ├── App.css
│   │   ├── App.jsx             # Component chính
│   │   ├── index.css
│   │   └── main.jsx            # Điểm khởi chạy
│   ├── biome.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

---

## 📋 Yêu Cầu

Trước khi bắt đầu, hãy đảm bảo bạn đã cài đặt:

- **Node.js** (v18 trở lên)
- **npm** hoặc **yarn**
- **PostgreSQL** (v14 trở lên)
- **Git**

---

## 🚀 Cài Đặt

### 1. Clone repository

```bash
git clone https://github.com/yourusername/ExpenseTracker.git
cd ExpenseTracker
```

### 2. Cài Đặt Dependencies Backend

```bash
cd backend
npm install
```

### 3. Cài Đặt Dependencies Frontend

```bash
cd ../frontend
npm install
```

---

## ⚙️ Cấu Hình

### Cấu Hình Backend

1. Tạo file `.env` trong thư mục `backend/`:

```env
# Cấu Hình Server
PORT=5000

# Cấu Hình Cơ Sở Dữ Liệu
DATABASE_URL=postgresql://username:password@localhost:5432/expensetracker

# JWT Secret (sử dụng chuỗi ngẫu nhiên mạnh)
JWT_SECRET=your_super_secret_jwt_key_here

# Node Environment
NODE_ENV=development
```

2. **Thiết Lập Cơ Sở Dữ Liệu PostgreSQL:**

```bash
# Tạo database mới
createdb expensetracker

# Hoặc sử dụng psql
psql -U postgres
CREATE DATABASE expensetracker;
```

> **Lưu ý:** Ứng dụng sẽ tự động tạo tất cả các bảng cần thiết khi chạy lần đầu.

### Cấu Hình Frontend

1. Cập nhật API URL trong `frontend/src/libs/api.js`:

```javascript
// Cho môi trường phát triển local
const API_URL = "http://localhost:5000/api";

// Cho môi trường production
// const API_URL = "https://your-production-api.com/api";
```

2. **Cấu Hình Firebase (cho đăng nhập mạng xã hội):**

Tạo file `frontend/src/libs/firebaseConfig.js`:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "your-api-key",
  authDomain: "your-auth-domain",
  projectId: "your-project-id",
  storageBucket: "your-storage-bucket",
  messagingSenderId: "your-sender-id",
  appId: "your-app-id"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
```

### Cấu Hình CORS

Cập nhật CORS origin trong `backend/server.js` nếu cần:

```javascript
app.use(
  cors({
    origin: "http://localhost:5173", // URL frontend của bạn
    credentials: true,
    methods: "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
  }),
);
```

---

## 🏃 Chạy Ứng Dụng

### Chế Độ Development

**Cách 1: Chạy riêng biệt**

```bash
# Terminal 1 - Backend
cd backend
npm run dev
# Server chạy tại http://localhost:5000

# Terminal 2 - Frontend
cd frontend
npm run dev
# App chạy tại http://localhost:5173
```

**Cách 2: Chế Độ Production**

```bash
# Backend
cd backend
npm start

# Frontend (build trước)
cd frontend
npm run build
npm run preview
```

### Truy Cập Ứng Dụng

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:5000
- **Kiểm Tra API:** http://localhost:5000/

---

## 📚 Tài Liệu API

Tài liệu API chi tiết có sẵn trong thư mục `backend/docs/`:

- [API Xác Thực](backend/docs/API_Auth.md)
- [API Người Dùng](backend/docs/API_User.md)
- [API Tài Khoản](backend/docs/API_Account.md)
- [API Giao Dịch](backend/docs/API_Transaction.md)

### Tham Khảo API Nhanh

#### Xác Thực
```
POST   /api/auth/sign-up           # Đăng ký người dùng mới
POST   /api/auth/sign-in           # Đăng nhập
POST   /api/auth/social-sign-in    # Đăng nhập mạng xã hội
```

#### Người Dùng
```
GET    /api/user                   # Lấy thông tin người dùng
PUT    /api/user                   # Cập nhật thông tin người dùng
PUT    /api/user/change-password   # Đổi mật khẩu
```

#### Tài Khoản
```
GET    /api/account                # Lấy tất cả tài khoản
POST   /api/account                # Tạo tài khoản
PUT    /api/account/:id            # Cập nhật tài khoản
DELETE /api/account/:id            # Xóa tài khoản
POST   /api/account/add-money      # Nạp tiền vào tài khoản
POST   /api/account/transfer       # Chuyển tiền giữa các tài khoản
```

#### Giao Dịch
```
GET    /api/transaction            # Lấy tất cả giao dịch
POST   /api/transaction            # Tạo giao dịch
GET    /api/transaction/:id        # Lấy một giao dịch
PUT    /api/transaction/:id        # Cập nhật giao dịch
DELETE /api/transaction/:id        # Xóa giao dịch
GET    /api/transaction/dashboard  # Lấy thống kê dashboard
```

---

## 🗄️ Cấu Trúc Cơ Sở Dữ Liệu

### tbluser
```sql
CREATE TABLE tbluser (
  id SERIAL PRIMARY KEY,
  email VARCHAR(120) UNIQUE NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50),
  contact VARCHAR(15),
  accounts TEXT[],
  password TEXT,
  provider VARCHAR(10) NULL,
  country TEXT,
  currency VARCHAR(5) NOT NULL DEFAULT 'USD',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### tblaccount
```sql
CREATE TABLE tblaccount (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES tbluser(id),
  account_name VARCHAR(50) NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  account_balance NUMERIC(10, 2) NOT NULL,
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

### tbltransaction
```sql
CREATE TABLE tbltransaction (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES tbluser(id),
  description TEXT NOT NULL,
  status VARCHAR(10) NOT NULL DEFAULT 'Pending',
  source VARCHAR(100) NOT NULL,
  amount NUMERIC(10, 2) NOT NULL,
  type VARCHAR(10) NOT NULL DEFAULT 'income',
  createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

---

## 📜 Scripts

### Scripts Backend

```bash
npm start              # Chạy server production
npm run dev            # Chạy server development với nodemon
npm run format         # Format code với BiomeJS
npm run lint           # Lint code với BiomeJS
npm run check          # Format và lint code
npm run check2         # Format và lint với unsafe fixes
```

### Scripts Frontend

```bash
npm run dev            # Chạy development server
npm run build          # Build cho production
npm run preview        # Xem trước bản build production
npm run lint           # Lint với ESLint
npm run lint2          # Lint với BiomeJS
npm run format         # Format code với BiomeJS
npm run check          # Format và lint code
npm run check2         # Format và lint với unsafe fixes
```

---

## 🎨 Giải Thích Các Tính Năng Chính

### Luồng Xác Thực

1. **Đăng Ký:**
   - Người dùng cung cấp email, mật khẩu và tên
   - Mật khẩu được mã hóa bằng bcrypt
   - Dữ liệu người dùng lưu trong PostgreSQL
   - Tạo tài khoản thành công

2. **Đăng Nhập:**
   - Người dùng cung cấp thông tin đăng nhập
   - Mật khẩu được xác thực với hash
   - JWT token được tạo và trả về
   - Token lưu trong localStorage
   - Token được gửi kèm trong tất cả các API request tiếp theo

3. **Đăng Nhập Mạng Xã Hội:**
   - Người dùng xác thực với Firebase (Google/GitHub)
   - Firebase token gửi đến backend
   - Backend tìm hoặc tạo người dùng
   - JWT token được tạo và trả về

### Quản Lý State

- **Zustand** cho global state (xác thực người dùng)
- **React Hook Form** cho state form
- **localStorage** cho lưu trữ dữ liệu
- Component-level state với `useState` cho tương tác UI

### Trực Quan Hóa Dữ Liệu

- **Biểu Đồ Đường:** Hiển thị xu hướng giao dịch theo thời gian
- **Biểu Đồ Tròn:** So sánh thu nhập vs chi tiêu
- **Thẻ Thống Kê:** Hiển thị các chỉ số chính (số dư, thu nhập, chi tiêu)
- **Giao Dịch Gần Đây:** Tổng quan nhanh các hoạt động mới nhất

---

## 🔒 Tính Năng Bảo Mật

- Mã hóa mật khẩu với bcrypt (10 vòng salt)
- Xác thực dựa trên JWT token
- Bảo vệ API routes với middleware
- Cấu hình CORS cho cross-origin requests
- Ngăn chặn SQL injection với parameterized queries
- Biến môi trường cho dữ liệu nhạy cảm
- Xử lý hết hạn token
- Xác thực mật khẩu an toàn

---

## 🌐 Triển Khai

### Triển Khai Backend (Ví dụ: Render/Railway)

1. Thiết lập biến môi trường trong nền tảng hosting
2. Kết nối cơ sở dữ liệu PostgreSQL
3. Deploy từ Git repository
4. Cập nhật CORS origin sang URL frontend production

### Triển Khai Frontend (Ví dụ: Vercel/Netlify)

1. Cập nhật `API_URL` trong `frontend/src/libs/api.js`
2. Thiết lập cấu hình Firebase
3. Build ứng dụng: `npm run build`
4. Deploy thư mục `dist`

### Biến Môi Trường cho Production

**Backend:**
```
DATABASE_URL=your_production_database_url
JWT_SECRET=your_production_jwt_secret
PORT=5000
NODE_ENV=production
```

**Frontend:**
- Cập nhật API URL trong code
- Thiết lập cấu hình Firebase production

---

## 🐛 Khắc Phục Sự Cố

### Các Vấn Đề Thường Gặp

**Lỗi Kết Nối Database:**
```bash
# Kiểm tra PostgreSQL đang chạy
pg_ctl status

# Xác minh DATABASE_URL trong .env
# Đảm bảo database tồn tại
```

**Lỗi CORS:**
- Xác minh URL frontend trong cấu hình CORS backend
- Kiểm tra backend server đang chạy
- Đảm bảo credentials: true ở cả frontend và backend

**Xác Thực Thất Bại:**
- Xóa localStorage
- Kiểm tra JWT_SECRET đã được thiết lập
- Xác minh token được gửi trong Authorization header

**Port Đang Được Sử Dụng:**
```bash
# Tìm và dừng process đang sử dụng port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

---

## 🤝 Đóng Góp

Rất hoan nghênh các đóng góp! Vui lòng làm theo các bước sau:

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/TinhNangMoi`)
3. Commit thay đổi (`git commit -m 'Thêm tính năng mới'`)
4. Push lên branch (`git push origin feature/TinhNangMoi`)
5. Mở Pull Request

### Phong Cách Code

- Sử dụng BiomeJS cho formatting và linting
- Tuân theo cấu trúc code hiện có
- Viết commit message có ý nghĩa
- Thêm comments cho logic phức tạp

---

## 📝 Giấy Phép

Dự án này được cấp phép theo ISC License.

---

## 👤 Tác Giả

**Trần Anh Tuấn**

---

<div align="center">

**Được xây dựng với ❤️ bằng PERN Stack**

⭐ Đánh dấu sao cho repository này nếu bạn thấy hữu ích!

</div>
