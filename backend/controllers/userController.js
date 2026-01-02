import { pool } from "../libs/database.js";
import { comparePassword, hashPassword } from "../libs/index.js";

/**
 * Controller lấy thông tin user hiện tại
 * Route: GET /api/user/
 * Yêu cầu: Phải có JWT token trong header (protected route)
 */
export const getUser = async (req, res) => {
  try {
    // Lấy userId từ JWT token đã được xác thực bởi middleware
    const { userId } = req.user;

    // Tìm user trong database theo ID
    const userExist = await pool.query({
      text: `SELECT * FROM tbluser WHERE id = $1`,
      values: [userId],
    });

    const user = userExist.rows[0];

    // Nếu không tìm thấy user, trả về lỗi 404
    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng.", status: "failed" });
    }

    // Xóa password khỏi response để không gửi về client
    user.password = undefined;

    // Trả về thông tin user
    res.status(201).json({
      status: "success",
      user,
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ exception nào xảy ra
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};

/**
 * Controller đổi mật khẩu của user
 * Route: PUT /api/user/change-password
 * Yêu cầu: Phải có JWT token trong header (protected route)
 */
export const changePassword = async (req, res) => {
  try {
    // Lấy userId từ JWT token đã được xác thực bởi middleware
    const { userId } = req.user;

    // Lấy thông tin mật khẩu từ request body
    const { currentPassword, newPassword, confirmPassword } = req.body;

    // Tìm user trong database theo ID
    const userExist = await pool.query({
      text: `SELECT * FROM tbluser WHERE id = $1`,
      values: [userId],
    });

    const user = userExist.rows[0];

    // Nếu không tìm thấy user, trả về lỗi 404
    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng.", status: "failed" });
    }

    // Kiểm tra mật khẩu mới và xác nhận mật khẩu có khớp nhau không
    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        message: "Mật khẩu mới không khớp.",
        status: "failed",
      });
    }

    // So sánh mật khẩu hiện tại với mật khẩu trong database
    const isMatch = await comparePassword(currentPassword, user?.password);

    // Nếu mật khẩu hiện tại không khớp, trả về lỗi 401
    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Mật khẩu hiện tại không đúng.", status: "failed" });
    }

    // Hash mật khẩu mới trước khi lưu vào database
    const hashedPassword = await hashPassword(newPassword);

    // Cập nhật mật khẩu mới vào database
    await pool.query({
      text: `UPDATE tbluser SET password = $1 WHERE id = $2`,
      values: [hashedPassword, userId],
    });

    // Trả về response thành công
    res.status(200).json({
      message: "Đổi mật khẩu thành công",
      status: "success",
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ exception nào xảy ra
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};

/**
 * Controller cập nhật thông tin user
 * Route: PUT /api/user/
 * Yêu cầu: Phải có JWT token trong header (protected route)
 */
export const updateUser = async (req, res) => {
  try {
    // Lấy userId từ JWT token đã được xác thực bởi middleware
    const { userId } = req.user;
    // Lấy thông tin cần cập nhật từ request body
    const { firstname, lastname, country, currency, contact } = req.body;

    // Kiểm tra user có tồn tại trong database không
    const userExist = await pool.query({
      text: `SELECT * FROM tbluser WHERE id = $1`,
      values: [userId],
    });

    const user = userExist.rows[0];

    // Nếu không tìm thấy user, trả về lỗi 404
    if (!user) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy người dùng.", status: "failed" });
    }

    // Cập nhật thông tin user và tự động cập nhật updatedAt
    const updatedUser = await pool.query({
      text: `UPDATE tbluser SET firstname = $1, lastname = $2, country = $3, currency = $4, contact = $5, updatedat = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *`,
      values: [firstname, lastname, country, currency, contact, userId],
    });

    // Xóa password khỏi response để không gửi về client
    updatedUser.rows[0].password = undefined;

    // Trả về response thành công với thông tin user đã cập nhật
    res.status(200).json({
      message: "Cập nhật thông tin người dùng thành công",
      status: "success",
      user: updatedUser.rows[0],
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ exception nào xảy ra
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};
