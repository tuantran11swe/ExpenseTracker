import axios from "axios";

// URL cơ sở của API backend
const API_URL = "https://expensetracker-6chn.onrender.com/api";

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: API_URL,
});

/**
 * Thiết lập token xác thực cho các request API
 * @param {string} token - JWT token từ người dùng đã đăng nhập
 */
export function setAuthToken(token) {
  if (token) {
    // Thêm token vào header Authorization cho tất cả request
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    // Xóa token khỏi header khi đăng xuất
    delete api.defaults.headers.common.Authorization;
  }
}

export default api;
