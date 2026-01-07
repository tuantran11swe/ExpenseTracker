import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getDateSevenDaysAgo } from "../libs/index";

// Component chọn khoảng thời gian để lọc dữ liệu giao dịch
const DataRange = () => {
  // Lấy ngày cách đây 7 ngày làm giá trị mặc định
  const sevenDaysAgo = getDateSevenDaysAgo();

  // Sử dụng useSearchParams để lấy và cập nhật query params trong URL
  const [searchParams, setSearchParams] = useSearchParams();

  // State lưu ngày bắt đầu
  // Khởi tạo từ URL params hoặc dùng giá trị mặc định (7 ngày trước hoặc hôm nay)
  const [dateFrom, setDateFrom] = useState(() => {
    const df = searchParams.get("df");
    // Kiểm tra nếu ngày từ URL hợp lệ (không quá hiện tại)
    return df && new Date(df).getTime() <= Date.now()
      ? df
      : sevenDaysAgo || new Date().toISOString().split("T")[0];
  });

  // State lưu ngày kết thúc
  // Khởi tạo từ URL params hoặc dùng giá trị mặc định (hôm nay)
  const [dateTo, setDateTo] = useState(() => {
    const dt = searchParams.get("dt");
    // Kiểm tra nếu ngày từ URL hợp lệ (không nhỏ hơn ngày bắt đầu)
    return dt && new Date(dt).getTime() >= new Date(dateFrom).getTime()
      ? dt
      : new Date().toISOString().split("T")[0];
  });

  // Cập nhật URL params khi dateFrom hoặc dateTo thay đổi
  useEffect(() => {
    setSearchParams({ df: dateFrom, dt: dateTo });
  }, [dateFrom, dateTo, setSearchParams]);

  // Hàm xử lý khi người dùng thay đổi ngày bắt đầu
  const handleDateFromChange = (e) => {
    const df = e.target.value;
    setDateFrom(df);
    // Nếu ngày bắt đầu lớn hơn ngày kết thúc, tự động cập nhật ngày kết thúc
    if (new Date(df).getTime() > new Date(dateTo).getTime()) {
      setDateTo(df);
    }
  };

  // Hàm xử lý khi người dùng thay đổi ngày kết thúc
  const handleDateToChange = (e) => {
    const dt = e.target.value;
    setDateTo(dt);
    // Nếu ngày kết thúc nhỏ hơn ngày bắt đầu, tự động cập nhật ngày bắt đầu
    if (new Date(dt).getTime() < new Date(dateFrom).getTime()) {
      setDateFrom(dt);
    }
  };

  return (
    <div className="flex flex-row items-center gap-2">
      <div className="flex flex-row items-center gap-2">
        <label
          className="text-gray-700 dark:text-gray-400 text-base whitespace-nowrap"
          htmlFor="dateFrom"
        >
          Từ Ngày
        </label>

        <input
          className="inputStyles text-base"
          max={dateTo}
          name="dateFrom"
          onChange={handleDateFromChange}
          type="date"
          value={dateFrom}
        />
      </div>

      <div className="flex flex-row items-center gap-2">
        <label
          className="text-gray-700 dark:text-gray-400 text-base whitespace-nowrap"
          htmlFor="dateTo"
        >
          Đến Ngày
        </label>

        <input
          className="inputStyles text-base"
          min={dateFrom}
          name="dateTo"
          onChange={handleDateToChange}
          type="date"
          value={dateTo}
        />
      </div>
    </div>
  );
};

export default DataRange;
