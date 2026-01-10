import { pool } from "../libs/database.js";
import { comparePassword, createJWT, hashPassword } from "../libs/index.js";

/**
 * Controller xử lý đăng ký user mới
 * Route: POST /api/auth/sign-up
 */
export const registerUser = async (req, res) => {
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
    const userExists = await pool.query({
      text: "SELECT EXISTS (SELECT * FROM tbluser WHERE email = $1)",
      values: [email],
    });

    // Nếu email đã tồn tại, trả về lỗi 409 (Conflict)
    if (userExists.rows[0].exists) {
      return res.status(409).json({
        message: "Email đã tồn tại. Vui lòng đăng nhập",
        status: "failed",
      });
    }

    // Hash password trước khi lưu vào database để bảo mật
    const hashedPassword = await hashPassword(password);

    // Thêm user mới vào database và trả về thông tin user vừa tạo
    const queryResult = await pool.query({
      text: `INSERT INTO tbluser (firstname, email, password) VALUES ($1, $2, $3) RETURNING *`,
      values: [firstName, email, hashedPassword],
    });

    // Xóa password khỏi response để không gửi về client
    queryResult.rows[0].password = undefined;

    // Trả về response thành công với mã 201 (Created)
    res.status(201).json({
      message: "Tạo tài khoản thành công",
      status: "success",
      user: queryResult.rows[0],
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
export const authenticateUser = async (req, res) => {
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
    const queryResult = await pool.query({
      text: `SELECT * FROM tbluser WHERE email = $1`,
      values: [email],
    });

    const userProfile = queryResult.rows[0];

    // Nếu không tìm thấy user, trả về lỗi 404
    if (!userProfile) {
      return res.status(404).json({
        message: "Email hoặc mật khẩu không hợp lệ.",
        status: "failed",
      });
    }

    // So sánh password người dùng nhập với password đã hash trong database
    const isPasswordMatch = await comparePassword(
      password,
      userProfile?.password,
    );

    // Nếu password không khớp, trả về lỗi 404
    if (!isPasswordMatch) {
      return res.status(404).json({
        message: "Email hoặc mật khẩu không hợp lệ",
        status: "failed",
      });
    }

    // Tạo JWT token với user ID để xác thực các request sau này
    const authToken = createJWT(userProfile.id);

    // Xóa password khỏi response để không gửi về client
    userProfile.password = undefined;

    // Trả về response thành công với token và thông tin user
    res.status(200).json({
      message: "Đăng nhập thành công",
      status: "success",
      token: authToken,
      user: userProfile,
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ exception nào xảy ra
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};

/**
 * Controller xử lý đăng nhập bằng mạng xã hội (Google, Github, etc.)
 * Route: POST /api/auth/social-sign-in
 * Tự động tạo user mới nếu chưa tồn tại (find-or-create)
 */
export const socialSignIn = async (req, res) => {
  try {
    // Lấy thông tin từ request body
    const { name, email, provider, uid } = req.body;

    // Kiểm tra các trường bắt buộc có được cung cấp không
    if (!(email || provider || uid)) {
      return res.status(400).json({
        message: "Vui lòng cung cấp đầy đủ thông tin!",
        status: "failed",
      });
    }

    // Tìm user trong database theo email
    const queryResult = await pool.query({
      text: `SELECT * FROM tbluser WHERE email = $1`,
      values: [email],
    });

    let userProfile = queryResult.rows[0];

    // Nếu user chưa tồn tại, tạo mới
    if (!userProfile) {
      const newUserResult = await pool.query({
        text: `INSERT INTO tbluser (firstname, email, provider) VALUES ($1, $2, $3) RETURNING *`,
        values: [name || "User", email, provider],
      });
      userProfile = newUserResult.rows[0];
    }

    // Tạo JWT token với user ID để xác thực các request sau này
    const authToken = createJWT(userProfile.id);

    // Xóa password khỏi response để không gửi về client
    userProfile.password = undefined;

    // Trả về response thành công với token và thông tin user
    res.status(200).json({
      message:
        userProfile.id === queryResult.rows[0]?.id
          ? "Đăng nhập thành công"
          : "Tạo tài khoản thành công",
      status: "success",
      token: authToken,
      user: userProfile,
    });
  } catch (error) {
    // Xử lý lỗi nếu có bất kỳ exception nào xảy ra
    console.log(error);
    res.status(500).json({ message: error.message, status: "failed" });
  }
};
