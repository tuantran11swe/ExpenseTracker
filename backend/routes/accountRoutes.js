import express from "express";
import {
  createUserAccount,
  depositToAccount,
  getUserAccounts,
} from "../controllers/accountController.js";
import authMiddleware from "../middleware/authMiddleware.js";

// Tạo Express Router instance cho các routes liên quan đến tài khoản
const router = express.Router();

// GET /api/account - Lấy tất cả tài khoản của user hiện tại
router.get("/", authMiddleware, getUserAccounts);

// GET /api/account/:id - Lấy một tài khoản theo ID
router.get("/:id", authMiddleware, getUserAccounts);

// POST /api/account/create - Tạo tài khoản mới (cash, crypto, PayPal, debit card)
router.post("/create", authMiddleware, createUserAccount);

// PUT /api/account/add-money/:id - Nạp tiền vào tài khoản
router.put("/add-money/:id", authMiddleware, depositToAccount);

export default router;
