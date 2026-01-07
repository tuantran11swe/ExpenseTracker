import { useCallback, useEffect, useState } from "react";
import { FaBtc, FaPaypal } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { MdAdd, MdVerifiedUser } from "react-icons/md";
import { RiVisaLine } from "react-icons/ri";
import { toast } from "sonner";
import AccountMenu from "../components/AccountMenu";
import AddAccount from "../components/AddAccount";
import AddMoney from "../components/AddMoney";
import Loading from "../components/Loading";
import Title from "../components/Title";
import TransferMoney from "../components/TransferMoney";
import { formatCurrency, maskAccountNumber } from "../libs";
import api from "../libs/api";

/**
 * Object chứa các icon tương ứng với từng loại tài khoản
 * Mỗi icon được render trong một div tròn với màu nền và icon riêng biệt
 */
const ICONS = {
  cash: (
    <div className="flex justify-center items-center bg-rose-600 rounded-full w-12 h-12 text-white">
      <GiCash size={26} />
    </div>
  ),
  crypto: (
    <div className="flex justify-center items-center bg-amber-600 rounded-full w-12 h-12 text-white">
      <FaBtc size={26} />
    </div>
  ),
  paypal: (
    <div className="flex justify-center items-center bg-blue-700 rounded-full w-12 h-12 text-white">
      <FaPaypal size={26} />
    </div>
  ),
  "visa debit card": (
    <div className="flex justify-center items-center bg-blue-600 rounded-full w-12 h-12 text-white">
      <RiVisaLine size={26} />
    </div>
  ),
};

// Hàm lấy icon tương ứng với tên tài khoản
// Nhận vào: accountName (tên tài khoản từ backend)
// Trả về: icon component hoặc null nếu không tìm thấy
const getAccountIcon = (accountName) => {
  if (!accountName) return null;

  // Chuyển thành lowercase và loại bỏ khoảng trắng thừa
  const normalizedName = accountName.toLowerCase().trim();

  // Tìm kiếm từ khóa trong tên tài khoản
  if (normalizedName.includes("cash")) {
    return ICONS.cash;
  }
  if (normalizedName.includes("crypto")) {
    return ICONS.crypto;
  }
  if (normalizedName.includes("paypal")) {
    return ICONS.paypal;
  }
  if (normalizedName.includes("visa") || normalizedName.includes("debit")) {
    return ICONS["visa debit card"];
  }

  // Thử tìm trực tiếp trong ICONS
  return ICONS[normalizedName] || null;
};

/**
 * Component trang quản lý tài khoản
 * Hiển thị danh sách tất cả tài khoản của người dùng và các chức năng:
 * - Thêm tài khoản mới
 * - Nạp tiền vào tài khoản
 * - Chuyển tiền giữa các tài khoản
 */
const AccountPage = () => {
  // State quản lý trạng thái mở/đóng modal thêm tài khoản
  const [isOpen, setIsOpen] = useState(false);

  // State quản lý trạng thái mở/đóng modal nạp tiền
  const [isOpenTopup, setIsOpenTopup] = useState(false);

  // State quản lý trạng thái mở/đóng modal chuyển tiền
  const [isOpenTransfer, setIsOpenTransfer] = useState(false);

  // State lưu ID của tài khoản được chọn để thực hiện các thao tác (nạp tiền, chuyển tiền)
  const [selectedAccount, setSelectedAccount] = useState("");

  // State lưu danh sách tất cả tài khoản của người dùng
  const [data, setData] = useState([]);

  // State quản lý trạng thái loading khi đang tải danh sách tài khoản
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Hàm fetch danh sách tất cả tài khoản của người dùng từ API
   * Sử dụng useCallback để tránh re-render không cần thiết
   * Xử lý lỗi xác thực: nếu auth_failed thì xóa user khỏi localStorage và reload trang
   */
  const fetchAccounts = useCallback(async () => {
    try {
      // Gọi API GET để lấy danh sách tài khoản
      const { data: res } = await api.get("/account");
      // Lưu danh sách tài khoản vào state
      setData(res?.data);
    } catch (error) {
      console.log(error);
      // Hiển thị thông báo lỗi từ API
      toast.error(error?.response?.data?.message);
      // Nếu lỗi là do xác thực thất bại, xóa thông tin user và reload trang
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Hàm mở modal nạp tiền cho tài khoản đã chọn
   * Lưu ID của tài khoản vào state và mở modal nạp tiền
   * @param {Object} el - Object chứa thông tin tài khoản (có thuộc tính id)
   */
  const handleOpenAddMoney = (el) => {
    setSelectedAccount(el?.id);
    setIsOpenTopup(true);
  };

  /**
   * Hàm mở modal chuyển tiền
   * Lưu ID của tài khoản nguồn vào state và mở modal chuyển tiền
   * @param {Object} el - Object chứa thông tin tài khoản (có thuộc tính id)
   */
  const handleTransferMoney = (el) => {
    setSelectedAccount(el?.id);
    setIsOpenTransfer(true);
  };

  // Effect chạy khi component mount để tải danh sách tài khoản
  useEffect(() => {
    setIsLoading(true);
    fetchAccounts();
  }, [fetchAccounts]);

  // Hiển thị loading component khi đang tải dữ liệu
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="py-10 w-full">
        {/* Header: Tiêu đề và nút thêm tài khoản */}
        <div className="flex justify-between items-center">
          <Title title="Thông tin tài khoản" />
          <div className="flex items-center gap-4">
            {/* Nút mở modal thêm tài khoản mới */}
            <button
              className="flex justify-center items-center gap-2 bg-black dark:bg-violet-700 px-2 py-1.5 border border-gray-500 rounded text-white dark:text-white"
              onClick={() => setIsOpen(true)}
              type="button"
            >
              <MdAdd size={22} />
              <span className="">Thêm tài khoản</span>
            </button>
          </div>
        </div>

        {/* Hiển thị thông báo nếu không có tài khoản nào */}
        {data?.length === 0 ? (
          <div className="flex justify-center items-center py-10 w-full text-gray-600 text-lg">
            <span>Không có tài khoản</span>
          </div>
        ) : (
          /* Grid hiển thị danh sách tài khoản*/
          <div className="gap-6 grid grid-cols-1 md:grid-cols-3 2xl:grid-cols-4 py-10 w-full">
            {data?.map((acc) => (
              /* Card hiển thị thông tin từng tài khoản */
              <div
                className="flex gap-4 bg-gray-50 shadow p-3 rounded w-full h-48"
                key={acc.id}
              >
                {/* Icon tương ứng với loại tài khoản */}
                <div>{getAccountIcon(acc?.account_name)}</div>
                <div className="space-y-2 w-full">
                  {/* Header card: Tên tài khoản, icon verified, menu thao tác */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <p className="font-bold text-black text-2xl">
                        {acc?.account_name}
                      </p>
                      {/* Icon xác thực tài khoản */}
                      <MdVerifiedUser
                        className="ml-1 text-emerald-600"
                        size={26}
                      />
                    </div>
                    {/* Menu dropdown với các tùy chọn: chuyển tiền, nạp tiền */}
                    <AccountMenu
                      addMoney={() => handleOpenAddMoney(acc)}
                      transferMoney={() => handleTransferMoney(acc)}
                    />
                  </div>

                  {/* Số tài khoản đã được mask*/}
                  <span className="font-light text-gray-600 dark:text-gray-400 leading-loose">
                    {maskAccountNumber(acc?.account_number)}
                  </span>

                  {/* Ngày tạo tài khoản, format theo kiểu Việt Nam: ngày/tháng/năm */}
                  <p className="text-gray-600 dark:text-gray-500 text-xs">
                    {new Date(acc?.createdat).toLocaleDateString("vi-VN", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>

                  {/* Footer card: Số dư tài khoản và nút nạp tiền nhanh */}
                  <div className="flex justify-between items-center">
                    <p className="font-medium text-gray-600 dark:text-gray-400 text-xl">
                      {formatCurrency(acc?.account_balance)}
                    </p>
                    {/* Nút nạp tiền nhanh */}
                    <button
                      className="outline-none text-violet-600 text-sm hover:underline"
                      onClick={() => handleOpenAddMoney(acc)}
                      type="button"
                    >
                      Nạp tiền
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Component dialog thêm tài khoản mới - key để reset form khi mở lại */}
      <AddAccount
        isOpen={isOpen}
        key={Date.now()}
        refetch={fetchAccounts}
        setIsOpen={setIsOpen}
      />

      {/* Component dialog nạp tiền vào tài khoản - key để reset form khi mở lại */}
      <AddMoney
        id={selectedAccount}
        isOpen={isOpenTopup}
        key={Date.now() + 1}
        refetch={fetchAccounts}
        setIsOpen={setIsOpenTopup}
      />

      {/* Component dialog chuyển tiền giữa các tài khoản - key để reset form khi mở lại */}
      <TransferMoney
        id={selectedAccount}
        isOpen={isOpenTransfer}
        key={Date.now() + 2}
        refetch={fetchAccounts}
        setIsOpen={setIsOpenTransfer}
      />
    </div>
  );
};

export default AccountPage;
