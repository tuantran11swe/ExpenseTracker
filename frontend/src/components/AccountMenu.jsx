import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BiTransfer } from "react-icons/bi";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import { MdMoreVert } from "react-icons/md";
import TransitionWrapper from "./wrappers/TransitionWrapper";

/**
 * Component menu thao tác trên tài khoản
 * Hiển thị menu dropdown với các tùy chọn: chuyển tiền và nạp tiền
 * @param {Function} addMoney - Callback được gọi khi người dùng chọn nạp tiền
 * @param {Function} transferMoney - Callback được gọi khi người dùng chọn chuyển tiền
 */
export default function AccountMenu({ addMoney, transferMoney }) {
  return (
    <Menu as="div" className="inline-block relative text-left">
      {/* Nút kích hoạt menu, hiển thị icon 3 chấm dọc */}
      <MenuButton className="inline-flex justify-center rounded-md w-full font-medium text-gray-600 dark:text-gray-300 text-sm">
        <MdMoreVert />
      </MenuButton>

      {/* Wrapper cho animation khi menu mở/đóng */}
      <TransitionWrapper>
        {/* Container chứa các menu items, căn phải và có shadow */}
        <MenuItems className="right-0 absolute bg-white mt-2 p-2 rounded-md divide-y divide-gray-100 w-40 origin-top-right">
          <div className="space-y-2 px-1 py-1">
            {/* Menu item: Chuyển tiền giữa các tài khoản */}
            <MenuItem>
              {() => (
                <button
                  className={`group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300`}
                  onClick={transferMoney}
                  type="button"
                >
                  <BiTransfer />
                  Chuyển tiền
                </button>
              )}
            </MenuItem>

            {/* Menu item: Nạp tiền vào tài khoản hiện tại */}
            <MenuItem>
              {() => (
                <button
                  className={`group flex gap-2 w-full items-center rounded-md px-2 py-2 text-sm text-gray-700 dark:text-gray-300`}
                  onClick={addMoney}
                  type="button"
                >
                  <FaMoneyCheckDollar />
                  Nạp tiền
                </button>
              )}
            </MenuItem>
          </div>
        </MenuItems>
      </TransitionWrapper>
    </Menu>
  );
}
