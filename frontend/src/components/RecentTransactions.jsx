import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RiProgress3Line } from "react-icons/ri";
import { TiWarning } from "react-icons/ti";
import { formatCurrency } from "../libs";
import Title from "./Title";

const data = [
  {
    amount: 150,
    date: "2024-01-05",
    name: "Online_Store",
    source: "Credit Card",
    status: "Completed",
  },
  {
    amount: 75,
    contact: "+1987654321",
    date: "2024-01-12",
    name: "Grocery Store",
    source: "Debit Card",
    status: "Rejected",
  },
  {
    amount: 120,
    contact: "+1122334455",
    date: "2024-01-20",
    name: "Utility Bill",
    source: "Bank Transfer",
    status: "Pending",
  },
];
// Thành phần hiển thị danh sách các giao dịch gần đây dưới dạng bảng
const RecentTransactions = () => {
  return (
    <div className="py-20 w-full md:w-2/3">
      <Title title="Giao dịch mới nhất" />
      <div className="mt-5 overflow-x-auto">
        <table className="w-full">
          <thead className="border-gray-300 border-b w-full">
            <tr className="w-full text-black text-left">
              <th className="py-2">Ngày</th>
              <th className="py-2">Tên</th>
              <th className="py-2">Trạng thái</th>
              <th className="py-2">Nguồn</th>
              <th className="py-2">Số tiền</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((item) => (
              <tr
                className="hover:bg-gray-300 border-gray-200 border-b text-gray-600"
                key={item.name + item.date + item.amount}
              >
                <td className="px-2 py-2">{item.date}</td>
                <td className="px-2 py-2">
                  <div>
                    <p className="font-medium text-black text-lg">
                      {item.name}
                    </p>
                    <span className="text-gray-600 text-sm">
                      {item.contact}
                    </span>
                  </div>
                </td>
                <td className="flex items-center gap-2 px-2 py-2">
                  {/* Hiển thị icon theo trạng thái */}
                  {item.status === "Pending" && (
                    <RiProgress3Line className="text-amber-600" size={22} />
                  )}
                  {item.status === "Completed" && (
                    <IoCheckmarkDoneCircle
                      className="text-emerald-600"
                      size={22}
                    />
                  )}
                  {item.status === "Rejected" && (
                    <TiWarning className="text-red-600" size={22} />
                  )}
                  <span>
                    {item.status === "Completed"
                      ? "Hoàn thành"
                      : item.status === "Pending"
                        ? "Đang chờ"
                        : "Từ chối"}
                  </span>
                </td>
                <td className="px-2 py-2">{item.source}</td>
                <td className="px-2 py-2 font-medium text-black text-base">
                  {formatCurrency(item.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
