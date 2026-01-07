import { saveAs } from "file-saver";
import { useCallback, useEffect, useState } from "react";
import { CiExport } from "react-icons/ci";
import { IoCheckmarkCircle, IoSearchOutline } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import { RiProgress3Line } from "react-icons/ri";
import { TiWarning } from "react-icons/ti";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import AddTransaction from "../components/AddTransaction";
import DataRange from "../components/DataRange";
import Loading from "../components/Loading";
import Title from "../components/Title";
import ViewTransaction from "../components/ViewTransaction";
import { formatCurrency } from "../libs";
import api from "../libs/api";

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

// Hàm xuất dữ liệu giao dịch ra file Excel
// Nhận vào: data (mảng dữ liệu giao dịch), filename (tên file)
const exportToExcel = (data, filename) => {
  try {
    // Chuyển đổi dữ liệu thành định dạng phù hợp cho Excel
    // Map từng giao dịch thành object với các trường cần thiết
    const excelData = data.map((item) => ({
      Amount: item.amount,
      Date: formatDate(item.createdat),
      Description: item.description,
      Source: item.source,
      Status: translateStatus(item.status),
      Type: item.type,
    }));

    // Tạo worksheet từ dữ liệu đã chuyển đổi
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    // Tạo workbook mới
    const workbook = XLSX.utils.book_new();
    // Thêm worksheet vào workbook với tên "Transactions"
    XLSX.utils.book_append_sheet(workbook, worksheet, "Giao dịch");

    // Xuất file Excel dưới dạng buffer
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    // Tạo Blob từ buffer với MIME type của Excel
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Tải file xuống với tên đã chỉ định
    saveAs(blob, `${filename}.xlsx`);
    toast.success("Đã xuất file Excel thành công!");
  } catch (error) {
    console.error("Lỗi khi xuất file Excel:", error);
    toast.error("Có lỗi xảy ra khi xuất file Excel");
  }
};

// Component trang hiển thị danh sách giao dịch
const TransactionsPage = () => {
  // Sử dụng useSearchParams để lấy và cập nhật query params trong URL
  const [searchParams, setSearchParams] = useSearchParams();

  // State quản lý trạng thái mở/đóng dialog thêm giao dịch
  const [isOpen, setIsOpen] = useState(false);
  // State quản lý trạng thái mở/đóng dialog xem chi tiết giao dịch
  const [isOpenView, setIsOpenView] = useState(false);
  // State lưu giao dịch được chọn để xem chi tiết
  const [selected, setSelected] = useState(null);
  // State quản lý trạng thái loading khi fetch dữ liệu
  const [isLoading, setIsLoading] = useState(false);
  // State lưu danh sách giao dịch
  const [data, setData] = useState([]);

  // State lưu từ khóa tìm kiếm
  const [search, setSearch] = useState("");
  // Lấy ngày bắt đầu và kết thúc từ URL params
  const startDate = searchParams.get("df") || "";
  const endDate = searchParams.get("dt") || "";

  // Hàm xử lý khi người dùng click xem chi tiết giao dịch
  const handleViewTransaction = (el) => {
    setSelected(el);
    setIsOpenView(true);
  };

  // Hàm fetch danh sách giao dịch từ API
  // Sử dụng useCallback để tránh re-render không cần thiết
  const fetchTransactions = useCallback(async () => {
    try {
      // Tạo URL với các query params: ngày bắt đầu, ngày kết thúc, và từ khóa tìm kiếm
      const URL = `/transaction?df=${startDate}&dt=${endDate}&s=${search}`;
      const { data: res } = await api.get(URL);

      setData(res?.data);
    } catch (error) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại sau.",
      );
      // Nếu lỗi xác thực, xóa thông tin user và reload trang
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, search]);

  // Hàm xử lý khi người dùng submit form tìm kiếm
  const handleSearch = async (e) => {
    e.preventDefault();

    // Cập nhật URL params với ngày bắt đầu và kết thúc
    setSearchParams({
      df: startDate,
      dt: endDate,
    });

    setIsLoading(true);
    await fetchTransactions();
  };

  // Fetch dữ liệu khi component mount hoặc khi fetchTransactions thay đổi
  useEffect(() => {
    setIsLoading(true);
    fetchTransactions();
  }, [fetchTransactions]);

  // Hiển thị loading nếu đang fetch dữ liệu
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="py-10 w-full">
        <div className="flex md:flex-row flex-col justify-between md:items-center mb-10">
          <Title />
          <div className="flex md:flex-row flex-col md:items-center gap-4">
            <DataRange />
            {/* Form tìm kiếm giao dịch */}
            <form action="" onSubmit={(e) => handleSearch(e)}>
              <div className="flex items-center gap-2 px-2 py-2 border border-gray-300 rounded-md w-full">
                <IoSearchOutline className="text-gray-600 text-xl" />
                <input
                  className="group bg-transparent outline-none text-gray-700 placeholder:text-gray-600"
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Tìm kiếm ngay..."
                  type="text"
                  value={search}
                />
              </div>
            </form>
            {/* Nút mở dialog thêm giao dịch */}
            <button
              className="flex justify-center items-center gap-2 bg-black px-2 py-1.5 border rounded text-white"
              onClick={() => setIsOpen(true)}
              type="button"
            >
              <MdAdd className="" size={22} />
              <span>Thanh Toán</span>
            </button>
            {/* Nút xuất dữ liệu ra file Excel */}
            <button
              className="flex items-center gap-2 text-black dark:text-gray-300"
              onClick={() =>
                exportToExcel(data, `Giao dịch ${startDate}-${endDate}`)
              }
              type="button"
            >
              Xuất File <CiExport size={24} />
            </button>
          </div>
        </div>
        {/* Bảng hiển thị danh sách giao dịch */}
        <div className="mt-5 overflow-x-auto">
          {data?.length === 0 ? (
            <div className="flex justify-center items-center py-10 w-full text-gray-600 text-lg">
              <span>Không có lịch sử giao dịch</span>
            </div>
          ) : (
            <div>
              <table className="w-full">
                <thead className="border-gray-300 border-b w-full">
                  <tr className="w-full text-black text-left">
                    <th className="p-2">Ngày</th>
                    <th className="p-2">Mô Tả</th>
                    <th className="p-2">Trạng Thái</th>
                    <th className="p-2">Nguồn</th>
                    <th className="p-2">Số Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.map((item, index) => (
                    <tr
                      className="border-gray-200 dark:border-gray-700 border-b w-full text-gray-600 dark:text-gray-500"
                      key={`${item.createdat}-${item.description}-${item.amount}-${index}`}
                    >
                      {/* Cột hiển thị ngày giao dịch */}
                      <td className="py-4">
                        <p className="w-24 md:w-auto">
                          {formatDate(item.createdat)}
                        </p>
                      </td>
                      {/* Cột hiển thị mô tả giao dịch */}
                      <td className="px-2 py-4">
                        <div className="flex flex-col w-56 md:w-auto">
                          <p className="text-black dark:text-gray-400 text-base 2xl:text-lg line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </td>
                      {/* Cột hiển thị trạng thái giao dịch với icon tương ứng */}
                      <td className="px-2 py-4">
                        <div className="flex items-center gap-2">
                          {/* Icon cho trạng thái Đang chờ */}
                          {item.status === "Pending" && (
                            <RiProgress3Line
                              className="text-amber-600"
                              size={24}
                            />
                          )}
                          {/* Icon cho trạng thái Từ chối */}
                          {item.status === "Rejected" && (
                            <TiWarning className="text-red-600" size={24} />
                          )}
                          {/* Icon cho trạng thái Hoàn thành */}
                          {item.status === "Completed" && (
                            <IoCheckmarkCircle
                              className="text-emerald-600"
                              size={24}
                            />
                          )}
                          <span>{translateStatus(item?.status)}</span>
                        </div>
                      </td>
                      {/* Cột hiển thị tài khoản nguồn */}
                      <td className="px-2 py-4">{item?.source}</td>
                      {/* Cột hiển thị số tiền với màu sắc theo loại (thu nhập/chi tiêu) */}
                      <td className="py-4 font-medium text-black dark:text-gray-400 text-base">
                        <span
                          className={`${
                            item?.type === "income"
                              ? "text-emerald-600"
                              : "text-red-600"
                          } text-lg font-bold ml-1`}
                        >
                          {item?.type === "income" ? "+" : "-"}
                        </span>
                        {formatCurrency(item?.amount)}
                      </td>
                      {/* Cột nút xem chi tiết */}
                      <td className="px-2 py-4">
                        <button
                          className="outline-none text-violet-600 hover:underline"
                          onClick={() => handleViewTransaction(item)}
                          type="button"
                        >
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Dialog thêm giao dịch mới */}
      <AddTransaction
        isOpen={isOpen}
        key={Date.now()}
        refetch={fetchTransactions}
        setIsOpen={setIsOpen}
      />

      {/* Dialog xem chi tiết giao dịch */}
      <ViewTransaction
        data={selected}
        isOpen={isOpenView}
        setIsOpen={setIsOpenView}
      />
    </div>
  );
};

export default TransactionsPage;
