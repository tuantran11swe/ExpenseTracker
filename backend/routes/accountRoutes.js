import express from "express";
import {
  addMoneyToAccount,
  createAccount,
  getAccounts,
} from "../controllers/accountController.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Tạo Express Router instance cho các routes liên quan đến tài khoản
const router = express.Router();

// GET /api/account - Lấy tất cả tài khoản của user hiện tại
router.get("/", authMiddleware, getAccounts);

// GET /api/account/:id - Lấy một tài khoản theo ID
router.get("/:id", authMiddleware, getAccounts);

// POST /api/account/create - Tạo tài khoản mới (cash, crypto, PayPal, debit card)
router.post("/create", authMiddleware, createAccount);

// PUT /api/account/add-money/:id - Nạp tiền vào tài khoản
router.put("/add-money/:id", authMiddleware, addMoneyToAccount);

export default router;
