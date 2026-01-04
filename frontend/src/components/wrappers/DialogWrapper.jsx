import { Dialog, Transition, TransitionChild } from "@headlessui/react";
import { Fragment } from "react";

/**
 * DialogWrapper là một wrapper component sử dụng Headless UI để tạo các cửa sổ modal (hộp thoại)
 * với các hiệu ứng chuyển cảnh mượt mà.
 */
const DialogWrapper = ({ isOpen, closeModal, children }) => {
  return (
    // Transition quản lý trạng thái hiển thị của toàn bộ Modal
    <Transition appear as={Fragment} show={isOpen}>
      <Dialog as="div" className="z-50 relative" onClose={closeModal}>
        {/* Lớp nền mờ (Backdrop) với hiệu ứng fade in/out */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60" />
        </TransitionChild>

        {/* Thùng chứa căn giữa nội dung Dialog */}
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex justify-center items-center p-4 min-h-full text-center">
            {/* Nội dung chính của Dialog với hiệu ứng scale và fade */}
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              {children}
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DialogWrapper;
