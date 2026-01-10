import express from "express";
import {
  createExpenseTransaction,
  getDashboardData,
  getUserTransactions,
  transferBetweenAccounts,
} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Tạo Express Router instance cho các routes liên quan đến giao dịch
const router = express.Router();

// GET /api/transaction/ - Lấy danh sách giao dịch với filters (date range, search)
router.get("/", authMiddleware, getUserTransactions);

// GET /api/transaction/dashboard - Lấy thông tin tổng hợp cho dashboard
router.get("/dashboard", authMiddleware, getDashboardData);

// POST /api/transaction/add-transaction/:account_id - Tạo giao dịch chi tiêu mới
router.post(
  "/add-transaction/:account_id",
  authMiddleware,
  createExpenseTransaction,
);

// PUT /api/transaction/transfer-money - Chuyển tiền giữa các tài khoản
router.put("/transfer-money", authMiddleware, transferBetweenAccounts);

export default router;
