import { DialogPanel, DialogTitle } from "@headlessui/react";
import { PiSealCheckFill } from "react-icons/pi";
import { formatCurrency } from "../libs";
import DialogWrapper from "./wrappers/DialogWrapper";

// Component hiển thị chi tiết giao dịch trong dialog
// Nhận props: data (thông tin giao dịch), isOpen (trạng thái mở/đóng), setIsOpen (hàm set trạng thái)
const ViewTransaction = ({ data, isOpen, setIsOpen }) => {
  // Hàm đóng dialog
  function closeModal() {
    setIsOpen(false);
  }

  // Chuyển đổi ngày tạo giao dịch sang định dạng đầy đủ (ví dụ: "Thứ Hai, 1 tháng 1, 2024")
  const longDateString = new Date(data?.createdat).toLocaleDateString("vi-VN", {
    dateStyle: "full",
  });

  // Chuyển đổi thời gian tạo giao dịch sang định dạng giờ:phút:giây
  const longTimeString = new Date(data?.createdat).toLocaleTimeString("vi-VN");

  return (
    <DialogWrapper closeModal={closeModal} isOpen={isOpen}>
      <DialogPanel className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-md min-h-[280px] overflow-hidden text-left transform">
        <DialogTitle
          as="h3"
          className="mb-4 font-medium text-gray-900 dark:text-gray-300 text-lg uppercase leading-6"
        >
          Chi Tiết Giao Dịch
        </DialogTitle>

        <div className="space-y-2">
          {/* Hiển thị tên tài khoản nguồn với icon xác nhận */}
          <div className="flex items-center gap-2 py-2 border-gray-300 border-y dark:border-gray-700 text-gray-600 dark:text-gray-500">
            <p>{data?.source}</p>
            <PiSealCheckFill className="ml-4 text-emerald-500" size={30} />
          </div>
        </div>

        {/* Hiển thị mô tả và thời gian giao dịch */}
        <div className="mt-3 mb-10">
          <p className="mb-1 text-black dark:text-white text-xl">
            {data?.description}
          </p>
          <span className="text-gray-600 text-xs">
            {longDateString} {longTimeString}
          </span>
        </div>

        {/* Hiển thị số tiền và nút đóng */}
        <div className="flex justify-between items-end mt-6 mb-3">
          <p className="font-bold text-black dark:text-gray-400 text-2xl">
            {/* Hiển thị dấu + cho thu nhập (màu xanh) hoặc - cho chi tiêu (màu đỏ) */}
            <span
              className={`${
                data?.type === "income" ? "text-emerald-600" : "text-red-600"
              } font-bold ml-1`}
            >
              {data?.type === "income" ? "+" : "-"}
            </span>{" "}
            {formatCurrency(data?.amount)}
          </p>
          <button
            className="bg-violet-800 px-4 py-2 rounded-md outline-none font-medium text-white text-sm"
            onClick={closeModal}
            type="button"
          >
            Đã hiểu, cảm ơn!
          </button>
        </div>
      </DialogPanel>
    </DialogWrapper>
  );
};

export default ViewTransaction;
