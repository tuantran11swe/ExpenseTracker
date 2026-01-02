import express from "express";
import {
  changePassword,
  getUser,
  updateUser,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Tạo Express Router instance
const router = express.Router();

// Route lấy thông tin user hiện tại (protected - yêu cầu JWT token)
// Endpoint: GET /api/user/
router.get("/", authMiddleware, getUser);

// Route đổi mật khẩu (protected - yêu cầu JWT token)
// Endpoint: PUT /api/user/change-password
router.put("/change-password", authMiddleware, changePassword);

// Route cập nhật thông tin user (protected - yêu cầu JWT token)
// Endpoint: PUT /api/user/
router.put("/", authMiddleware, updateUser);

// Export router để sử dụng trong routes/index.js
export default router;
