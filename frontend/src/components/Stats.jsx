import { BsCashCoin, BsCurrencyDollar } from "react-icons/bs";
import { SiCashapp } from "react-icons/si";
import { formatCurrency } from "../libs";
import { Card } from "./ui/Card";

const ICON_STYLES = [
  "bg-blue-300 text-blue-800",
  "bg-emerald-300 text-emerald-800",
  "bg-rose-300 text-rose-800",
];
// Thành phần hiển thị các thẻ thống kê (Số dư, Thu nhập, Chi phí)
// Nhận vào: dt (object chứa balance, income, expense từ backend)
const FinancialStats = ({ dt }) => {
  const data = [
    {
      amount: dt?.balance,
      icon: <BsCurrencyDollar size={26} />,
      label: "Tổng số dư",
    },
    {
      amount: dt?.income,
      icon: <BsCashCoin size={26} />,
      label: "Tổng thu nhập",
    },
    {
      amount: dt?.expense,
      icon: <SiCashapp size={26} />,
      label: "Tổng chi phí",
    },
  ];

  // Thành phần con hiển thị từng thẻ thống kê
  const ItemCard = ({ item, index }) => {
    return (
      <Card className="flex justify-between items-center gap-5 shadow-lg px-4 2xl:px-8 py-12 w-full 2xl:min-w-96 h-48">
        <div className="flex items-center gap-4 w-full h-full">
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full ${ICON_STYLES[index]}`}
          >
            {item.icon}
          </div>
          <div className="space-y-3">
            <span className="text-gray-600 text-base md:text-lg">
              {item.label}
            </span>
            <p className="font-medium text-black text-2xl 2xl:text-3xl">
              {formatCurrency(item?.amount || 0.0)}
            </p>
            <span className="text-gray-600 text-xs md:text-sm 2xl:text-base">
              Tổng quan {item.label}
            </span>
          </div>
        </div>
      </Card>
    );
  };
  return (
    <div className="flex md:flex-row flex-col justify-between items-center gap-8 2xl:gap-x-40 mb-20">
      <div className="flex md:flex-row flex-col justify-between items-center gap-10 2xl:gap-20 w-full">
        {data?.map((item, index) => (
          <ItemCard index={index} item={item} key={item.label} />
        ))}
      </div>
    </div>
  );
};

export default FinancialStats;
