import JWT from "jsonwebtoken";

/**
 * Middleware xác thực JWT token
 * Kiểm tra token trong header Authorization và xác thực tính hợp lệ
 * Nếu token hợp lệ, thêm userId vào req.user để các controller sử dụng
 */
const authMiddleware = async (req, res, next) => {
  // Lấy header Authorization từ request
  const authHeader = req?.headers?.authorization;

  // Kiểm tra header Authorization có tồn tại và bắt đầu bằng "Bearer" không
  if (!authHeader || !authHeader?.startsWith("Bearer")) {
    return res
      .status(401)
      .json({ message: "Xác thực thất bại", status: "auth_failed" });
  }

  // Tách token từ header (format: "Bearer <token>")
  const token = authHeader?.split(" ")[1];

  try {
    // Xác thực token với secret key từ biến môi trường
    const userToken = JWT.verify(token, process.env.JWT_SECRET);

    // Thêm userId vào req.user để các controller có thể sử dụng
    req.user = {
      userId: userToken.userId,
    };

    // Chuyển sang middleware/controller tiếp theo
    next();
  } catch (error) {
    // Nếu token không hợp lệ hoặc đã hết hạn, trả về lỗi 401
    console.log(error);
    return res
      .status(401)
      .json({ message: "Xác thực thất bại", status: "auth_failed" });
  }
};

export default authMiddleware;
