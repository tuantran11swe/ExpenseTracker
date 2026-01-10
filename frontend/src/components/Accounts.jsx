import { FaBtc, FaPaypal } from "react-icons/fa";
import { GiCash } from "react-icons/gi";
import { RiVisaLine } from "react-icons/ri";
import { formatCurrency, maskAccountNumber } from "../libs";
import Title from "./Title";

// Object chứa các icon tương ứng với từng loại tài khoản
// Mỗi icon được render trong một div tròn với màu nền và icon riêng biệt
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

// Thành phần hiển thị danh sách các tài khoản từ backend
// Nhận vào: data (mảng các tài khoản từ backend)
const AccountList = ({ data = [] }) => {
  // Nếu không có dữ liệu, hiển thị thông báo
  if (!data || data.length === 0) {
    return (
      <div className="mt-20 md:mt-0 py-5 md:py-20 md:w-1/3">
        <Title title="Tài khoản" />
        <span className="text-gray-600 text-sm">
          Xem tất cả các tài khoản của bạn
        </span>
        <div className="flex justify-center items-center mt-5 py-10 w-full text-gray-600 text-lg">
          <span>Không có tài khoản</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20 md:mt-0 py-5 md:py-20 md:w-1/3">
      <Title title="Tài khoản" />
      <span className="text-gray-600 text-sm">
        Xem tất cả các tài khoản của bạn
      </span>
      <div className="w-full">
        {data.map((item) => (
          <div className="flex justify-between items-center mt-6" key={item.id}>
            <div className="flex items-center gap-4">
              {getAccountIcon(item?.account_name)}
              <div>
                <p className="font-medium text-black text-lg">
                  {item.account_name}
                </p>
                <span className="text-gray-600 text-sm">
                  {maskAccountNumber(item.account_number)}
                </span>
              </div>
            </div>
            <div>
              <p className="font-medium text-black text-xl">
                {formatCurrency(item.account_balance)}
              </p>
              <span className="text-gray-600 text-sm">Số dư tài khoản</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountList;
