import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import Accounts from "../components/Accounts";
import { Chart } from "../components/Chart";
import DoughnutChart from "../components/DoughnutChart";
import Info from "../components/Info";
import Loading from "../components/Loading";
import RecentTransactions from "../components/RecentTransactions";
import Stats from "../components/Stats";
import api from "../libs/api";

// Trang chính của Dashboard hiển thị tổng quan về tài chính
const Dashboard = () => {
  const [data, setData] = useState(); // Trạng thái lưu trữ dữ liệu từ API
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải dữ liệu

  // Hàm gọi API để lấy thống kê cho dashboard
  const fetchDashboardStats = useCallback(async () => {
    const URL = "/transaction/dashboard";
    try {
      const { data } = await api.get(URL);
      setData(data); // Cập nhật dữ liệu khi lấy thành công
    } catch (error) {
      console.log(error);
      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra. Vui lòng thử lại sau", // Thông báo lỗi tiếng Việt
      );
      if (error?.response?.data?.status === "auth_failed") {
        localStorage.removeItem("user");
        window.location.reload();
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchDashboardStats();
  }, [fetchDashboardStats]);
  if (isLoading)
    return (
      <div className="flex justify-center items-center w-full h-[80vh]">
        <Loading />
      </div>
    );

  return (
    <div className="px-0">
      <Info />
      <Stats
        dt={{
          balance: data?.availableBalance,
          expense: data?.totalExpense,
          income: data?.totalIncome,
        }}
      />
      <div className="flex md:flex-row flex-col-reverse items-center gap-10 w-full">
        <Chart data={data?.chartData} />
        {data?.totalIncome > 0 && (
          <DoughnutChart
            dt={{
              balance: data?.availableBalance,
              expense: data?.totalExpense,
              income: data?.totalIncome,
            }}
          />
        )}
      </div>
      <div className="flex md:flex-row flex-col-reverse gap-0 md:gap-10 2xl:gap-20">
        <RecentTransactions data={data?.lastTransactions} />
        {data?.lastAccount?.length > 0 && <Accounts data={data?.lastAccount} />}
      </div>
    </div>
  );
};

export default Dashboard;
