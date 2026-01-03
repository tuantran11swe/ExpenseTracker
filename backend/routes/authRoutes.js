import express from "express";
import {
  signinUser,
  signupUser,
  socialSignIn,
} from "../controllers/authController.js";

// Tạo Express Router instance
const router = express.Router();

// Route đăng ký user mới
// Endpoint: POST /api/auth/sign-up
router.post("/sign-up", signupUser);

// Route đăng nhập user
// Endpoint: POST /api/auth/sign-in
router.post("/sign-in", signinUser);

// Route đăng nhập bằng mạng xã hội (Google, Github, etc.)
// Endpoint: POST /api/auth/social-sign-in
router.post("/social-sign-in", socialSignIn);

// Export router để sử dụng trong routes/index.js
export default router;
