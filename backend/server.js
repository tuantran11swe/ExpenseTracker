import dotenv from "dotenv";
import express from "express";
import { pool } from "./libs/database.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Hàm khởi tạo database
async function initDB() {
  const client = await pool.connect();

  try {
    console.log("Đang khởi tạo database...");

    // Tạo bảng tbluser
    await client.query(`
      CREATE TABLE IF NOT EXISTS tbluser (
        id SERIAL NOT NULL PRIMARY KEY,
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
      )
    `);
    console.log("Bảng tbluser đã sẵn sàng");

    // Tạo bảng tblaccount
    await client.query(`
      CREATE TABLE IF NOT EXISTS tblaccount (
        id SERIAL NOT NULL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES tbluser(id),
        account_name VARCHAR(50) NOT NULL,
        account_number VARCHAR(50) NOT NULL,
        account_balance NUMERIC(10, 2) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Bảng tblaccount đã sẵn sàng");

    // Tạo bảng tbltransaction
    await client.query(`
      CREATE TABLE IF NOT EXISTS tbltransaction(
        id SERIAL NOT NULL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES tbluser(id),
        description TEXT NOT NULL,
        status VARCHAR(10) NOT NULL DEFAULT 'Pending',
        source VARCHAR(100) NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        type VARCHAR(10) NOT NULL DEFAULT 'income',
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("Bảng tbltransaction đã sẵn sàng");

    console.log("Khởi tạo database hoàn tất!");
  } catch (error) {
    console.error("Lỗi khởi tạo database:", error);
    throw error;
  } finally {
    client.release();
  }
}

// Route test
app.get("/", (_req, res) => {
  res.json({ message: "Server đang chạy!" });
});

// Khởi động server
async function startServer() {
  try {
    // Khởi tạo database trước
    await initDB();

    // Sau đó mới start server
    app.listen(PORT, () => {
      console.log(`Server đang chạy tại http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Lỗi khởi động server:", error);
    process.exit(1);
  }
}

startServer();
