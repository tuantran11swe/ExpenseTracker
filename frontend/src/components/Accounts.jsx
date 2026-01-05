import { FaBtc } from "react-icons/fa";
import { RiVisaLine } from "react-icons/ri";
import { formatCurrency } from "../libs";
import Title from "./Title";

const data = [
  {
    account: "codewave@gmail.com",
    amount: "85,345.00",
    icon: (
      <div className="flex justify-center items-center bg-amber-600 rounded-full w-12 h-12 text-white">
        <FaBtc size={26} />
      </div>
    ),
    name: "Crypto",
  },
  {
    account: "2463********8473",
    amount: "15,345.00",
    icon: (
      <div className="flex justify-center items-center bg-blue-600 rounded-full w-12 h-12 text-white">
        <RiVisaLine size={26} />
      </div>
    ),
    name: "Visa Debit Card",
  },
];

// Thành phần hiển thị danh sách các tài khoản (ví dụ: Crypto, Thẻ Visa)
const Accounts = () => {
  return (
    <div className="mt-20 md:mt-0 py-5 md:py-20 md:w-1/3">
      <Title title="Tài khoản" />
      <span className="text-gray-600 text-sm">
        Xem tất cả các tài khoản của bạn
      </span>
      <div className="w-full">
        {data.map((item) => (
          <div
            className="flex justify-between items-center mt-6"
            key={item.account}
          >
            <div className="flex items-center gap-4">
              {item.icon}
              <div>
                <p className="font-medium text-black text-lg">{item.name}</p>
                <span className="text-gray-600 text-sm">{item.account}</span>
              </div>
            </div>
            <div>
              <p className="font-medium text-black text-xl">
                {formatCurrency(item.amount)}
              </p>
              <span className="text-gray-600 text-sm">Số dư tài khoản</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Accounts;
