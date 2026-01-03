import clsx from "clsx";
import React from "react";

/**
 * Component Card chính - Container cho toàn bộ card
 * @param {string} className - Class CSS tùy chỉnh bổ sung
 * @param {React.ReactNode} children - Nội dung bên trong card
 * @returns {JSX.Element} Card container
 */
export const Card = ({ className, children, ...props }) => (
  <div
    className={clsx(
      "bg-card shadow-sm border rounded-lg text-card-foreground", // Bo góc, viền, nền và bóng đổ
      className,
    )}
    {...props}
  >
    {children}
  </div>
);

/**
 * CardHeader - Phần đầu của card, thường chứa tiêu đề và mô tả
 * @param {string} className - Class CSS tùy chỉnh bổ sung
 * @param {React.ReactNode} children - Nội dung header
 * @returns {JSX.Element} Card header
 */
export const CardHeader = ({ className, children, ...props }) => (
  <div className={clsx("flex flex-col space-y-1.5 p-6", className)} {...props}>
    {children}
  </div>
);

/**
 * CardTitle - Tiêu đề của card
 * @param {string} className - Class CSS tùy chỉnh bổ sung
 * @param {React.ReactNode} children - Nội dung tiêu đề
 * @returns {JSX.Element} Card title
 */
export const CardTitle = ({ className, children, ...props }) => (
  <h3
    className={clsx(
      "font-semibold text-2xl leading-none tracking-tight", // Font size lớn, đậm và chặt chẽ
      className,
    )}
    {...props}
  >
    {children}
  </h3>
);

/**
 * CardDescription - Mô tả hoặc subtitle của card
 * @param {string} className - Class CSS tùy chỉnh bổ sung
 * @param {React.ReactNode} children - Nội dung mô tả
 * @returns {JSX.Element} Card description
 */
export const CardDescription = ({ className, children, ...props }) => (
  <p className={clsx("text-muted-foreground text-sm", className)} {...props}>
    {children}
  </p>
);

/**
 * CardContent - Nội dung chính của card
 * @param {string} className - Class CSS tùy chỉnh bổ sung
 * @param {React.ReactNode} children - Nội dung chính
 * @returns {JSX.Element} Card content
 */
export const CardContent = ({ className, children, ...props }) => (
  <div className={clsx("p-6 pt-0", className)} {...props}>
    {children}
  </div>
);

/**
 * CardFooter - Phần chân của card, thường chứa các action buttons
 * @param {string} className - Class CSS tùy chỉnh bổ sung
 * @param {React.ReactNode} children - Nội dung footer
 * @returns {JSX.Element} Card footer
 */
export const CardFooter = ({ className, children, ...props }) => (
  <div className={clsx("flex items-center p-6 pt-0", className)} {...props}>
    {children}
  </div>
);
