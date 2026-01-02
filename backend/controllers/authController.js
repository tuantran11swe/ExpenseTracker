import { pool } from "../libs/database.js";
import { comparePassword, createJWT, hashPassword } from "../libs/index.js";

/**
 * Controller xử lý đăng ký user mới
 * Route: POST /api/auth/sign-up
 */
export const signupUser = async (req, res) => {
  try {
    // Lấy thông tin từ request body
    const { firstName, email, password } = req.body;

    // Kiểm tra các trường bắt buộc có được cung cấp không
    if (!(firstName || email || password)) {
      return res.status(404).json({
        message: "Vui lòng cung cấp đầy đủ thông tin!",
        status: "failed",
      });
    }

    // Kiểm tra email đã tồn tại trong database chưa
    const userExist = await pool.query({
      text: "SELECT EXISTS (SELECT * FROM tbluser WHERE email = $1)",
      values: [email],
    });

    // Nếu email đã tồn tại, trả về lỗi 409 (Conflict)
    if (userExist.rows[0].exists) {
      return res.status(409).json({
        message: "Email đã tồn tại. Vui lòng đăng nhập",
        status: "failed",
      });
    }

    // Hash password trước khi lưu vào database để bảo mật
    const hashedPassword = await hashPassword(password);

    // Thêm user mới vào database và trả về thông tin user vừa tạo
    const user = await pool.query({
      text: `INSERT INTO tbluser (firstname, email, password) VALUES ($1, $2, $3) RETURNING *`,
      values: [firstName, email, hashedPassword],
    });

    // Xóa password khỏi response để không gửi về client
    user.rows[0].password = undefined;

    // Trả về response thành công với mã 201 (Created)
    res.status(201).json({
      message: "Tạo tài khoản thành công",
      status: "success",
      user: user.rows[0],
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ exception nào xảy ra
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};

/**
 * Controller xử lý đăng nhập user
 * Route: POST /api/auth/sign-in
 */
export const signinUser = async (req, res) => {
  try {
    // Lấy email và password từ request body
    const { email, password } = req.body;

    // Kiểm tra các trường bắt buộc có được cung cấp không
    if (!(email || password)) {
      return res.status(404).json({
        message: "Vui lòng cung cấp đầy đủ thông tin!",
        status: "failed",
      });
    }

    // Tìm user trong database theo email
    const result = await pool.query({
      text: `SELECT * FROM tbluser WHERE email = $1`,
      values: [email],
    });

    const user = result.rows[0];

    // Nếu không tìm thấy user, trả về lỗi 404
    if (!user) {
      return res.status(404).json({
        message: "Email hoặc mật khẩu không hợp lệ.",
        status: "failed",
      });
    }

    // So sánh password người dùng nhập với password đã hash trong database
    const isMatch = await comparePassword(password, user?.password);

    // Nếu password không khớp, trả về lỗi 404
    if (!isMatch) {
      return res.status(404).json({
        message: "Email hoặc mật khẩu không hợp lệ",
        status: "failed",
      });
    }

    // Tạo JWT token với user ID để xác thực các request sau này
    const token = createJWT(user.id);

    // Xóa password khỏi response để không gửi về client
    user.password = undefined;

    // Trả về response thành công với token và thông tin user
    res.status(200).json({
      message: "Đăng nhập thành công",
      status: "success",
      token,
      user,
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ exception nào xảy ra
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};
