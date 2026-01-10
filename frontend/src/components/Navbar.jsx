import { Menu, Popover } from "@headlessui/react";
import { signOut } from "firebase/auth";
import { useState } from "react";
import { IoIosMenu } from "react-icons/io";
import { MdOutlineClose, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { RiCurrencyFill } from "react-icons/ri";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth } from "../libs/firebaseConfig";
import useStore from "../store";
import TransitionWrapper from "./wrappers/TransitionWrapper";

// Danh sách các liên kết điều hướng trên thanh Navbar
const links = [
  { label: "Tổng quan", link: "/overview" }, // Dashboard -> Tổng quan
  { label: "Giao dịch", link: "/transactions" }, // Transactions -> Giao dịch
  { label: "Tài khoản", link: "/accounts" }, // Accounts -> Tài khoản
  { label: "Cài đặt", link: "/settings" }, // Settings -> Cài đặt
];

// Component hiển thị menu người dùng (Avatar, Email, Nút Đăng xuất)
const UserMenu = () => {
  const { user, setUserCredentials } = useStore((state) => state);
  const navigate = useNavigate();

  // Hàm xử lý đăng xuất người dùng
  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("user");
      setUserCredentials(null);
      navigate("/sign-in");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
    }
  };

  return (
    <Menu as="div" className="z-50 relative">
      <div>
        <Menu.Button className="">
          <div className="flex items-center gap-2">
            {/* Hiển thị chữ cái đầu tiên của tên người dùng làm Avatar */}
            <div className="flex justify-center items-center bg-violet-600 rounded-full w-10 2xl:w-12 h-10 2xl:h-12 text-white cursor-pointer">
              <p className="font-bold text-2xl">{user?.firstname?.charAt(0)}</p>
            </div>
            {/* Hiển thị Tên và Email của người dùng (chỉ hiện trên màn hình md trở lên) */}
            <div className="hidden md:block text-left">
              <p className="font-medium text-black text-lg">
                {user?.firstname} {user?.lastname}
              </p>
              <span className="text-gray-700 text-sm">{user?.email}</span>
            </div>
            <MdOutlineKeyboardArrowDown className="hidden md:block text-gray-600 text-2xl cursor-pointer" />
          </div>
        </Menu.Button>
      </div>
      <TransitionWrapper>
        <Menu.Items className="right-0 z-50 absolute bg-white shadow-lg mt-2 rounded-md focus:outline-none divide-y divide-gray-100 ring-1 ring-black/5 w-56 origin-top-right">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? "bg-violet-500/10 text-gray-900" : "text-gray-900"
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm cursor-pointer`}
                  onClick={handleLogout}
                  type="button"
                >
                  Đăng xuất
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </TransitionWrapper>
    </Menu>
  );
};

// Component thanh điều hướng phụ cho thiết bị di động
const MobileSidebar = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="">
      <Popover className="">
        {({ open }) => (
          <>
            <Popover.Button
              className={`
               flex md:hidden items-center rounded-md font-medium focus:outline-none text-gray-600`}
            >
              {open ? <MdOutlineClose size={26} /> : <IoIosMenu size={26} />}
            </Popover.Button>
            <TransitionWrapper>
              <Popover.Panel className="left-1/2 z-50 absolute bg-white mt-3 px-4 py-6 w-screen max-w-sm -translate-x-1/2 transform">
                <div className="flex flex-col space-y-2">
                  {/* Hiển thị các liên kết điều hướng trong menu mobile */}
                  {links.map(({ label, link }) => (
                    <Link key={link} to={link}>
                      <Popover.Button
                        className={`${
                          link === path
                            ? "bg-black text-white"
                            : "text-gray-700"
                        } w-1/2 px-6 py-2 rounded-full text-left`}
                      >
                        {label}
                      </Popover.Button>
                    </Link>
                  ))}

                  <div className="flex justify-between items-center px-4 py-6">
                    <UserMenu />
                  </div>
                </div>
              </Popover.Panel>
            </TransitionWrapper>
          </>
        )}
      </Popover>
    </div>
  );
};

// Component chính Navbar
const Navbar = () => {
  const location = useLocation();
  const path = location.pathname;
  const [_openSidebar, _setOpenSidebar] = useState(false);

  return (
    <div className="flex justify-between items-center py-6 w-full">
      {/* Phần Logo và Tên Thương Hiệu */}
      <Link to="/">
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="flex justify-center items-center bg-violet-700 rounded-xl w-10 md:w-12 h-10 md:h-12">
            <RiCurrencyFill className="text-white text-3xl hover:animate-spin" />
          </div>
          <span className="font-bold text-black text-xl">Quản lý chi tiêu</span>
        </div>
      </Link>

      {/* Danh sách điều hướng cho màn hình Desktop (md trở lên) */}
      <div className="hidden md:flex items-center gap-4">
        {links.map(({ label, link }) => (
          <div
            className={`${
              link === path ? "bg-black text-white" : "text-gray-700"
            } px-6 py-2 rounded-full`}
            key={link}
          >
            <Link to={link}>{label}</Link>
          </div>
        ))}
      </div>

      {/* Các tiện ích: Menu người dùng */}
      <div className="hidden md:flex items-center gap-10 2xl:gap-20">
        <UserMenu />
      </div>

      {/* Menu cho thiết bị di động */}
      <div className="md:hidden flex">
        <MobileSidebar />
      </div>
    </div>
  );
};

export default Navbar;
