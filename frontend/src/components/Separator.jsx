/**
 * Component Separator - Tạo đường phân cách với chữ "Or" ở giữa
 * Thường dùng giữa các phương thức đăng nhập/đăng ký
 * @returns {JSX.Element} Separator component
 */
export const Separator = () => {
  return (
    <div className="relative">
      {/* Đường kẻ ngang */}
      <div className="absolute inset-0 flex items-center">
        <div className="border-gray-300 border-t w-full"></div>
      </div>
      {/* Chữ "Hoặc" ở giữa */}
      <div className="relative flex justify-center text-sm">
        <span className="bg-white px-2 rounded text-gray-500">Hoặc</span>
      </div>
    </div>
  );
};
