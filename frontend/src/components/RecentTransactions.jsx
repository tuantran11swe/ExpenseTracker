import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { RiProgress3Line } from "react-icons/ri";
import { TiWarning } from "react-icons/ti";
import { formatCurrency } from "../libs";
import Title from "./Title";

// Hàm format ngày tháng theo định dạng DD/MM/YYYY
// Nhận vào: dateString (chuỗi ngày tháng)
// Trả về: chuỗi ngày tháng đã được format theo định dạng DD/MM/YYYY
const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

// Hàm chuyển đổi trạng thái từ tiếng Anh sang tiếng Việt
// Nhận vào: status (trạng thái tiếng Anh)
// Trả về: trạng thái tiếng Việt tương ứng
const translateStatus = (status) => {
  const statusMap = {
    Completed: "Hoàn thành",
    Pending: "Đang chờ",
    Rejected: "Từ chối",
  };
  return statusMap[status] || status;
};

// Thành phần hiển thị danh sách các giao dịch gần đây dưới dạng bảng
// Nhận vào: data (mảng các giao dịch từ backend)
const RecentTransactions = ({ data = [] }) => {
  // Nếu không có dữ liệu, hiển thị thông báo
  if (!data || data.length === 0) {
    return (
      <div className="py-20 w-full md:w-2/3">
        <Title title="Giao dịch mới nhất" />
        <div className="flex justify-center items-center mt-5 py-10 w-full text-gray-600 text-lg">
          <span>Không có giao dịch gần đây</span>
        </div>
      </div>
    );
  }

  return (
    <div className="py-20 w-full md:w-2/3">
      <Title title="Giao dịch mới nhất" />
      <div className="mt-5 overflow-x-auto">
        <table className="w-full">
          <thead className="border-gray-300 border-b w-full">
            <tr className="w-full text-black text-left">
              <th className="py-2">Ngày</th>
              <th className="py-2">Mô tả</th>
              <th className="py-2">Trạng thái</th>
              <th className="py-2">Nguồn</th>
              <th className="py-2">Số tiền</th>
            </tr>
          </thead>
          <tbody>
            {data.slice(0, 5).map((item, index) => (
              <tr
                className="hover:bg-gray-300 border-gray-200 border-b text-gray-600"
                key={`${item.createdat}-${item.description}-${item.amount}-${index}`}
              >
                <td className="px-2 py-2">{formatDate(item.createdat)}</td>
                <td className="px-2 py-2">
                  <div>
                    <p className="font-medium text-black text-lg">
                      {item.description}
                    </p>
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
                  <span>{translateStatus(item.status)}</span>
                </td>
                <td className="px-2 py-2">{item.source}</td>
                <td className="px-2 py-2 font-medium text-black text-base">
                  <span
                    className={`${
                      item?.type === "income"
                        ? "text-emerald-600"
                        : "text-red-600"
                    } text-lg font-bold ml-1`}
                  >
                    {item?.type === "income" ? "+" : "-"}
                  </span>
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
