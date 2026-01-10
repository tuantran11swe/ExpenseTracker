import { pool } from "../libs/database.js";
import { getMonthName } from "../libs/index.js";

/**
 * Controller lấy danh sách giao dịch với các bộ lọc (date range, search)
 * Route: GET /api/transaction/
 * Yêu cầu: Phải có JWT token trong header (protected route)
 * Query params:
 *   - df: Ngày bắt đầu (date from)
 *   - dt: Ngày kết thúc (date to)
 *   - s: Từ khóa tìm kiếm (search term)
 */
export const getUserTransactions = async (req, res) => {
  try {
    const today = new Date();

    // Tính toán ngày 7 ngày trước (mặc định nếu không có df)
    const _sevenDaysAgo = new Date(today);
    _sevenDaysAgo.setDate(today.getDate() - 7);
    const sevenDaysAgo = _sevenDaysAgo.toISOString().split("T")[0];

    // Lấy các query parameters từ request
    const { df, dt, s } = req.query;

    // Lấy userId từ JWT token đã được xác thực bởi middleware
    const { userId } = req.user;

    // Xác định khoảng thời gian tìm kiếm (mặc định 7 ngày gần nhất)
    const startDate = new Date(df || sevenDaysAgo);
    const endDate = new Date(dt || new Date());

    // Truy vấn giao dịch với các điều kiện:
    // - user_id khớp
    // - createdat trong khoảng thời gian
    // - description/status/source chứa từ khóa tìm kiếm (không phân biệt hoa thường)
    const transactionsResult = await pool.query({
      text: `SELECT * FROM tbltransaction WHERE user_id = $1 AND createdat BETWEEN $2 AND $3 AND (description ILIKE '%' || $4 || '%' OR status ILIKE '%' || $4 || '%' OR source ILIKE '%' || $4 || '%') ORDER BY id DESC`,
      values: [userId, startDate, endDate, s || ""],
    });

    // Trả về danh sách giao dịch
    res.status(200).json({
      data: transactionsResult.rows,
      status: "success",
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ exception nào xảy ra
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};

/**
 * Controller lấy thông tin tổng hợp cho dashboard
 * Route: GET /api/transaction/dashboard
 * Yêu cầu: Phải có JWT token trong header (protected route)
 * Trả về: Tổng thu nhập, tổng chi tiêu, số dư khả dụng, dữ liệu biểu đồ theo tháng,
 *         5 giao dịch gần nhất, 4 tài khoản gần nhất
 */
export const getDashboardData = async (req, res) => {
  try {
    // Lấy userId từ JWT token đã được xác thực bởi middleware
    const { userId } = req.user;

    let totalIncomeAmount = 0;
    let totalExpenseAmount = 0;

    // Tính tổng thu nhập và chi tiêu từ tất cả giao dịch
    const transactionSummaryResult = await pool.query({
      text: `SELECT type, SUM(amount) AS totalAmount FROM
    tbltransaction WHERE user_id = $1 GROUP BY type`,
      values: [userId],
    });

    const transactionSummary = transactionSummaryResult.rows;

    // Phân loại và tính tổng thu nhập và chi tiêu
    transactionSummary.forEach((transaction) => {
      if (transaction.type === "income") {
        totalIncomeAmount += Number(transaction.totalamount);
      } else {
        totalExpenseAmount += Number(transaction.totalamount);
      }
    });

    // Tính số dư khả dụng = tổng thu nhập - tổng chi tiêu
    const availableBalance = totalIncomeAmount - totalExpenseAmount;

    // Tính toán dữ liệu biểu đồ theo tháng trong năm hiện tại
    const year = new Date().getFullYear();
    const start_Date = new Date(year, 0, 1); // Ngày 1 tháng 1 của năm
    const end_Date = new Date(year, 11, 31, 23, 59, 59); // Ngày 31 tháng 12 của năm

    // Truy vấn tổng hợp giao dịch theo tháng và loại (income/expense)
    const monthlyDataResult = await pool.query({
      text: `
      SELECT
        EXTRACT(MONTH FROM createdat) AS month,
        type,
        SUM(amount) AS totalAmount
      FROM
        tbltransaction
      WHERE
        user_id = $1
        AND createdat BETWEEN $2 AND $3
      GROUP BY
        EXTRACT(MONTH FROM createdat), type`,
      values: [userId, start_Date, end_Date],
    });

    // Tổ chức dữ liệu thành mảng 12 tháng (Tháng 1 - Tháng 12)
    const chartData = new Array(12).fill().map((_, index) => {
      // Lọc dữ liệu cho tháng hiện tại
      const monthData = monthlyDataResult.rows.filter(
        (item) => parseInt(item.month, 10) === index + 1,
      );

      // Tìm tổng thu nhập và chi tiêu của tháng
      const monthlyIncome =
        monthData.find((item) => item.type === "income")?.totalamount || 0;

      const monthlyExpense =
        monthData.find((item) => item.type === "expense")?.totalamount || 0;

      return {
        expense: Number(monthlyExpense),
        income: Number(monthlyIncome),
        label: getMonthName(index),
      };
    });

    // Lấy 5 giao dịch gần nhất
    const recentTransactionsResult = await pool.query({
      text: `SELECT * FROM tbltransaction WHERE user_id = $1 ORDER BY id DESC LIMIT 5`,
      values: [userId],
    });

    const recentTransactions = recentTransactionsResult.rows;

    // Lấy 4 tài khoản gần nhất
    const recentAccountsResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE user_id = $1 ORDER BY id DESC LIMIT 4`,
      values: [userId],
    });

    const recentAccounts = recentAccountsResult.rows;

    // Trả về tất cả thông tin dashboard
    res.status(200).json({
      availableBalance,
      chartData: chartData,
      lastAccount: recentAccounts,
      lastTransactions: recentTransactions,
      status: "success",
      totalExpense: totalExpenseAmount,
      totalIncome: totalIncomeAmount,
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ exception nào xảy ra
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};

/**
 * Controller tạo giao dịch chi tiêu mới
 * Route: POST /api/transaction/add-transaction/:account_id
 * Yêu cầu: Phải có JWT token trong header (protected route)
 * Params: account_id - ID của tài khoản
 * Body: { description, source, amount }
 * Sử dụng database transaction để đảm bảo tính nhất quán dữ liệu
 */
export const createExpenseTransaction = async (req, res) => {
  try {
    // Lấy userId từ JWT token đã được xác thực bởi middleware
    const { userId } = req.user;
    // Lấy ID tài khoản từ params
    const { account_id } = req.params;
    // Lấy thông tin giao dịch từ request body
    const { description, source, amount } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!(description || source || amount)) {
      return res.status(403).json({
        message: "Vui lòng cung cấp đầy đủ thông tin!",
        status: "failed",
      });
    }

    // Kiểm tra số tiền phải lớn hơn 0
    if (Number(amount) <= 0)
      return res
        .status(403)
        .json({ message: "Số tiền phải lớn hơn 0.", status: "failed" });

    // Kiểm tra thông tin tài khoản có tồn tại không
    const accountQueryResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE id = $1`,
      values: [account_id],
    });

    const accountInfo = accountQueryResult.rows[0];

    if (!accountInfo) {
      return res.status(404).json({
        message: "Thông tin tài khoản không hợp lệ.",
        status: "failed",
      });
    }

    // Kiểm tra số dư tài khoản có đủ để thực hiện giao dịch không
    if (
      accountInfo.account_balance <= 0 ||
      accountInfo.account_balance < Number(amount)
    ) {
      return res.status(403).json({
        message: "Giao dịch thất bại. Số dư tài khoản không đủ.",
        status: "failed",
      });
    }

    // Bắt đầu database transaction để đảm bảo tính nhất quán
    await pool.query("BEGIN");

    // Cập nhật số dư tài khoản (trừ đi số tiền chi tiêu)
    await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance - $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [amount, account_id],
    });

    // Tạo bản ghi giao dịch mới
    await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6)`,
      values: [userId, description, "expense", "Completed", amount, source],
    });

    // Xác nhận transaction (commit)
    await pool.query("COMMIT");

    // Trả về thông báo thành công
    res.status(200).json({
      message: "Giao dịch đã được thực hiện thành công.",
      status: "success",
    });
  } catch (error) {
    // Nếu có lỗi, rollback để đảm bảo tính nhất quán dữ liệu
    await pool.query("ROLLBACK");
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};

/**
 * Controller chuyển tiền giữa các tài khoản
 * Route: PUT /api/transaction/transfer-money
 * Yêu cầu: Phải có JWT token trong header (protected route)
 * Body: { from_account, to_account, amount }
 * Sử dụng database transaction để đảm bảo tính nhất quán dữ liệu
 * Tạo 2 transaction records: expense cho tài khoản gửi, income cho tài khoản nhận
 */
export const transferBetweenAccounts = async (req, res) => {
  try {
    // Lấy userId từ JWT token đã được xác thực bởi middleware
    const { userId } = req.user;
    // Lấy thông tin chuyển tiền từ request body
    const { from_account, to_account, amount } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!(from_account || to_account || amount)) {
      return res.status(403).json({
        message: "Vui lòng cung cấp đầy đủ thông tin!",
        status: "failed",
      });
    }

    // Chuyển đổi số tiền sang số
    const transferAmount = Number(amount);

    // Kiểm tra số tiền phải lớn hơn 0
    if (transferAmount <= 0)
      return res.status(403).json({
        message: "Số tiền phải lớn hơn 0.",
        status: "failed",
      });

    // Kiểm tra thông tin và số dư của tài khoản gửi
    const fromAccountResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE id = $1`,
      values: [from_account],
    });

    const fromAccount = fromAccountResult.rows[0];

    if (!fromAccount) {
      return res.status(404).json({
        message: "Không tìm thấy thông tin tài khoản gửi.",
        status: "failed",
      });
    }

    // Kiểm tra số dư tài khoản gửi có đủ không
    if (transferAmount > fromAccount.account_balance) {
      return res.status(403).json({
        message: "Chuyển tiền thất bại. Số dư tài khoản không đủ.",
        status: "failed",
      });
    }

    // Kiểm tra tài khoản nhận có tồn tại không
    const toAccountResult = await pool.query({
      text: `SELECT * FROM tblaccount WHERE id = $1`,
      values: [to_account],
    });

    const toAccount = toAccountResult.rows[0];

    if (!toAccount) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản nhận.",
        status: "failed",
      });
    }

    // Bắt đầu database transaction để đảm bảo tính nhất quán
    await pool.query("BEGIN");

    // Trừ tiền từ tài khoản gửi
    await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance - $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2`,
      values: [transferAmount, from_account],
    });

    // Cộng tiền vào tài khoản nhận
    const _toAccountUpdateResult = await pool.query({
      text: `UPDATE tblaccount SET account_balance = account_balance + $1, updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      values: [transferAmount, to_account],
    });

    // Tạo transaction record cho tài khoản gửi (expense)
    const transferDescription = `Chuyển tiền từ ${fromAccount.account_name} đến ${toAccount.account_name}`;

    await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6)`,
      values: [
        userId,
        transferDescription,
        "expense",
        "Completed",
        amount,
        fromAccount.account_name,
      ],
    });

    // Tạo transaction record cho tài khoản nhận (income)
    const receiveDescription = `Nhận tiền từ ${fromAccount.account_name} đến ${toAccount.account_name}`;

    await pool.query({
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6)`,
      values: [
        userId,
        receiveDescription,
        "income",
        "Completed",
        amount,
        toAccount.account_name,
      ],
    });

    // Xác nhận transaction (commit)
    await pool.query("COMMIT");

    // Trả về thông báo thành công
    res.status(201).json({
      message: "Chuyển tiền thành công",
      status: "success",
    });
  } catch (error) {
    // Nếu có lỗi, rollback để đảm bảo tính nhất quán dữ liệu
    await pool.query("ROLLBACK");
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};
