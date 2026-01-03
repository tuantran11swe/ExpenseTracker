import clsx from "clsx";
import React from "react";

// Định nghĩa các class CSS cho từng loại variant của button
const variantClasses = {
  // Kiểu mặc định: nền indigo, chữ trắng
  default: "bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500",
  // Kiểu trong suốt với hiệu ứng hover
  ghost: "bg-transparent hover:bg-gray-100 text-gray-700",
  // Kiểu liên kết với gạch chân
  link: "bg-transparent underline-offset-4 hover:underline text-indigo-600 hover:text-indigo-700",
  // Kiểu viền: nền trắng với viền xám
  outline:
    "bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 border border-gray-200",
};

// Định nghĩa các class CSS cho kích thước button
const sizeClasses = {
  default: "h-10 px-4 py-2", // Kích thước mặc định
  icon: "h-10 w-10", // Kích thước cho button icon (vuông)
  lg: "h-11 px-8", // Kích thước lớn
  sm: "h-9 px-3", // Kích thước nhỏ
};

/**
 * Component Button có thể tùy chỉnh
 * @param {Object} props - Thuộc tính của component
 * @param {React.ReactNode} props.children - Nội dung bên trong button
 * @param {string} props.variant - Kiểu hiển thị của button (default, outline, ghost, link)
 * @param {string} props.size - Kích thước của button (default, sm, lg, icon)
 * @param {string} props.className - Class CSS tùy chỉnh bổ sung
 * @returns {JSX.Element} Button component
 */
export function Button({
  children,
  variant = "default",
  size = "default",
  className,
  ...props
}) {
  return (
    <button
      className={clsx(
        // Class cơ bản cho tất cả button
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant], // Thêm class theo variant
        sizeClasses[size], // Thêm class theo size
        className, // Thêm class tùy chỉnh từ props
      )}
      {...props}
    >
      {children}
    </button>
  );
}
