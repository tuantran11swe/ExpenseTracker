import clsx from "clsx";
import React, { forwardRef } from "react";

// Định nghĩa các class CSS cho kích thước input
const sizeClasses = {
  default: "h-10 px-3 py-2", // Kích thước mặc định
  lg: "h-11 px-4 py-3", // Kích thước lớn
  sm: "h-9 px-3 py-1", // Kích thước nhỏ
};

/**
 * Component Input với khả năng forward ref
 * @param {Object} props - Thuộc tính của component
 * @param {string} props.id - ID của input element
 * @param {string} props.label - Nhãn hiển thị phía trên input
 * @param {string} props.error - Thông báo lỗi hiển thị dưới input
 * @param {string} props.size - Kích thước input (default, sm, lg)
 * @param {string} props.className - Class CSS tùy chỉnh bổ sung
 * @param {React.Ref} ref - Ref được forward từ component cha
 * @returns {JSX.Element} Input component
 */
const Input = forwardRef(
  (
    { id, label, error, size = "default", className, rightIcon, ...props },
    ref,
  ) => {
    return (
      <div className="space-y-2 w-full">
        {/* Hiển thị label nếu có */}
        {label && (
          <label
            className="block font-medium text-gray-700 text-sm"
            htmlFor={id}
          >
            {label}
          </label>
        )}
        {/* Container tương đối để chứa icon bên phải */}
        <div className="relative">
          <input
            className={clsx(
              // Style cơ bản: viền, bo góc, bóng đổ
              "block w-full rounded-md border-gray-300 shadow-sm",
              // Style khi focus: viền xanh, ring effect
              "focus:border-indigo-300 focus:ring focus:ring-blue-400 focus:ring-opacity-50",
              // Màu placeholder
              "placeholder-gray-400",
              // Style khi disabled: nền xám, con trỏ không cho phép
              "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed",
              sizeClasses[size], // Áp dụng kích thước
              rightIcon && "pr-10", // Thêm padding phải nếu có icon
              className, // Class tùy chỉnh từ props
            )}
            id={id}
            ref={ref}
            {...props}
          />
          {/* Render icon bên phải nếu được cung cấp */}
          {rightIcon && (
            <div className="right-0 absolute inset-y-0 flex items-center p-3">
              {rightIcon}
            </div>
          )}
        </div>
        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p className="mt-2 text-red-600 text-sm">{error}</p>}
      </div>
    );
  },
);

// Đặt displayName để dễ debug trong React DevTools
Input.displayName = "Input";

export default Input;
