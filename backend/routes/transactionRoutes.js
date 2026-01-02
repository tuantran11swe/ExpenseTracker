import express from "express";
import {
  addTransaction,
  getDashboardInformation,
  getTransactions,
  transferMoneyToAccount,
} from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Tạo Express Router instance cho các routes liên quan đến giao dịch
const router = express.Router();

// GET /api/transaction/ - Lấy danh sách giao dịch với filters (date range, search)
router.get("/", authMiddleware, getTransactions);

// GET /api/transaction/dashboard - Lấy thông tin tổng hợp cho dashboard
router.get("/dashboard", authMiddleware, getDashboardInformation);

// POST /api/transaction/add-transaction/:account_id - Tạo giao dịch chi tiêu mới
router.post("/add-transaction/:account_id", authMiddleware, addTransaction);

// PUT /api/transaction/transfer-money - Chuyển tiền giữa các tài khoản
router.put("/transfer-money", authMiddleware, transferMoneyToAccount);

export default router;
