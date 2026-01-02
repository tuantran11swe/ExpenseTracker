import express from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";

// Tạo Express Router instance
const router = express.Router();

// Đăng ký các routes với prefix
// Tất cả routes trong authRoutes sẽ có prefix /auth
router.use("/auth", authRoutes);
// Tất cả routes trong userRoutes sẽ có prefix /user
router.use("/user", userRoutes);

// Export router để sử dụng trong server.js
export default router;
