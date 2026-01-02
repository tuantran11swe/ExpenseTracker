import { pool } from "../libs/database.js";

/**
 * Controller lấy tất cả tài khoản của user hiện tại
 * Route: GET /api/account/:id?
 * Yêu cầu: Phải có JWT token trong header (protected route)
 */
export const getAccounts = async (req, res) => {
  try {
    // Lấy userId từ JWT token đã được xác thực bởi middleware
    const { userId } = req.user;

    // Truy vấn tất cả tài khoản của user từ database
    const accounts = await pool.query({
      text: `SELECT * FROM tblaccount WHERE user_id = $1`,
      values: [userId],
    });

    // Trả về danh sách tài khoản
    res.status(200).json({
      data: accounts.rows,
      status: "success",
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ exception nào xảy ra
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};

/**
 * Controller tạo tài khoản mới cho user
 * Route: POST /api/account/create
 * Yêu cầu: Phải có JWT token trong header (protected route)
 * Body: { name, amount, account_number }
 */
export const createAccount = async (req, res) => {
  try {
    // Lấy userId từ JWT token đã được xác thực bởi middleware
    const { userId } = req.user;

    // Lấy thông tin tài khoản từ request body
    const { name, amount, account_number } = req.body;

    // Kiểm tra tài khoản đã tồn tại chưa (theo tên và user_id)
    const accountExistQuery = {
      text: `SELECT * FROM tblaccount WHERE account_name = $1 AND user_id = $2`,
      values: [name, userId],
    };

    const accountExistResult = await pool.query(accountExistQuery);

    const accountExist = accountExistResult.rows[0];

    // Nếu tài khoản đã tồn tại, trả về lỗi 409 (Conflict)
    if (accountExist) {
      return res
        .status(409)
        .json({ message: "Tài khoản này đã được tạo.", status: "failed" });
    }

    // Tạo tài khoản mới trong database
    const createAccountResult = await pool.query({
      text: `INSERT INTO tblaccount(user_id, account_name, account_number, account_balance) VALUES($1, $2, $3, $4) RETURNING *`,
      values: [userId, name, account_number, amount],
    });
    const account = createAccountResult.rows[0];

    // Chuẩn hóa tên tài khoản thành array để thêm vào user.accounts
    const userAccounts = Array.isArray(name) ? name : [name];

    // Cập nhật mảng accounts của user trong database
    const updateUserAccountQuery = {
      text: `UPDATE tbluser SET accounts = array_cat(accounts, $1), updatedat = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
      values: [userAccounts, userId],
    };
    await pool.query(updateUserAccountQuery);

    // Tạo transaction record cho khoản tiền gửi ban đầu
    const description = `${account.account_name} - Tiền gửi ban đầu`;

    const initialDepositQuery = {
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [
        userId,
        description,
        "income",
        "Completed",
        amount,
        account.account_name,
      ],
    };
    await pool.query(initialDepositQuery);

    // Trả về thông tin tài khoản vừa tạo
    res.status(201).json({
      data: account,
      message: `Tài khoản ${account.account_name} đã được tạo thành công`,
      status: "success",
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ exception nào xảy ra
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};

/**
 * Controller nạp tiền vào tài khoản
 * Route: PUT /api/account/add-money/:id
 * Yêu cầu: Phải có JWT token trong header (protected route)
 * Params: id - ID của tài khoản
 * Body: { amount } - Số tiền cần nạp
 */
export const addMoneyToAccount = async (req, res) => {
  try {
    // Lấy userId từ JWT token đã được xác thực bởi middleware
    const { userId } = req.user;
    // Lấy ID tài khoản từ params
    const { id } = req.params;
    // Lấy số tiền cần nạp từ request body
    const { amount } = req.body;

    // Chuyển đổi amount sang số
    const newAmount = Number(amount);

    // Cập nhật số dư tài khoản (cộng thêm số tiền nạp vào)
    const result = await pool.query({
      text: `UPDATE tblaccount SET account_balance =(account_balance + $1), updatedat = CURRENT_TIMESTAMP  WHERE id = $2 RETURNING *`,
      values: [newAmount, id],
    });

    const accountInformation = result.rows[0];

    // Tạo mô tả cho transaction
    const description = `${accountInformation.account_name} - Nạp tiền`;

    // Tạo transaction record để ghi lại việc nạp tiền
    const transQuery = {
      text: `INSERT INTO tbltransaction(user_id, description, type, status, amount, source) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [
        userId,
        description,
        "income",
        "Completed",
        amount,
        accountInformation.account_name,
      ],
    };
    await pool.query(transQuery);

    // Trả về thông tin tài khoản đã được cập nhật
    res.status(200).json({
      data: accountInformation,
      message: "Nạp tiền thành công",
      status: "success",
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ exception nào xảy ra
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};
