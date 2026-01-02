import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";

/**
 * Hàm hash password để bảo mật mật khẩu trước khi lưu vào database
 * @param {string} userValue - Mật khẩu người dùng nhập vào
 * @returns {Promise<string>} - Mật khẩu đã được hash
 */
export const hashPassword = async (userValue) => {
  // Tạo salt với độ phức tạp là 10 rounds
  const salt = await bcrypt.genSalt(10);

  // Hash password với salt vừa tạo
  const hashedPassword = await bcrypt.hash(userValue, salt);

  return hashedPassword;
};

/**
 * Hàm so sánh password người dùng nhập với password đã hash trong database
 * @param {string} userPassword - Mật khẩu người dùng nhập vào
 * @param {string} password - Mật khẩu đã hash trong database
 * @returns {Promise<boolean>} - true nếu khớp, false nếu không khớp
 */
export const comparePassword = async (userPassword, password) => {
  try {
    // So sánh password người dùng nhập với password đã hash
    const isMatch = await bcrypt.compare(userPassword, password);

    return isMatch;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.log(error);
  }
};

/**
 * Hàm tạo JWT token để xác thực người dùng
 * @param {number} id - ID của user
 * @returns {string} - JWT token
 */
export const createJWT = (id) => {
  return JWT.sign(
    {
      userId: id, // Payload chứa userId
    },
    process.env.JWT_SECRET, // Secret key từ biến môi trường
    {
      expiresIn: "1d", // Token hết hạn sau 1 ngày
    },
  );
};

/**
 * Hàm chuyển đổi số tháng (0-11) thành tên tháng bằng tiếng Anh
 * @param {number} index - Chỉ số tháng (0 = January, 11 = December)
 * @returns {string} - Tên tháng bằng tiếng Anh
 */
export function getMonthName(index) {
  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];
  return months[index];
}
