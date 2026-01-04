import { Transition } from "@headlessui/react";
import { Fragment } from "react";

/**
 * TransitionWrapper cung cấp các hiệu ứng chuyển cảnh (animation) khi xuất hiện hoặc biến mất
 * cho các component con bên trong nó.
 */
const TransitionWrapper = ({ children }) => {
  return (
    <Transition
      as={Fragment}
      // Khi bắt đầu xuất hiện: thời gian 100ms, hiệu ứng ease-out
      enter="transition ease-out duration-100"
      // Trạng thái bắt đầu: biến đổi kích thước nhỏ lại và mờ đi
      enterFrom="transform opacity-0 scale-95"
      // Trạng thái kết thúc: kích thước bình thường và hiển thị rõ
      enterTo="transform opacity-100 scale-100"
      // Khi bắt đầu biến mất: thời gian 75ms, hiệu ứng ease-in
      leave="transition ease-in duration-75"
      // Trạng thái bắt đầu khi biến mất: hiển thị rõ
      leaveFrom="transform opacity-100 scale-100"
      // Trạng thái kết thúc khi biến mất: mờ dần và nhỏ lại
      leaveTo="transform opacity-0 scale-95"
    >
      {children}
    </Transition>
  );
};

export default TransitionWrapper;
