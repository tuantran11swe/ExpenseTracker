import { DialogPanel, DialogTitle } from "@headlessui/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { MdOutlineWarning } from "react-icons/md";
import { toast } from "sonner";
import { formatCurrency } from "../libs";
import api from "../libs/api";
import Loading from "./Loading";
import { Button } from "./ui/Button";
import Input from "./ui/Input";
import DialogWrapper from "./wrappers/DialogWrapper";

/**
 * Component dialog để chuyển tiền giữa các tài khoản
 * Cho phép người dùng chọn tài khoản nguồn, tài khoản đích và số tiền cần chuyển
 * @param {boolean} isOpen - Trạng thái mở/đóng dialog
 * @param {Function} setIsOpen - Hàm để thay đổi trạng thái dialog
 * @param {Function} refetch - Hàm để làm mới danh sách tài khoản sau khi chuyển thành công
 */
const TransferMoney = ({ isOpen, setIsOpen, refetch }) => {
  // Khởi tạo react-hook-form để quản lý form nhập số tiền chuyển
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // Dùng để theo dõi giá trị input real-time để hiển thị trong button
  } = useForm();

  // State quản lý trạng thái loading khi đang tải danh sách tài khoản
  const [isLoading, setIsLoading] = useState(false);

  // State quản lý trạng thái loading khi đang gửi request chuyển tiền
  const [loading, setLoading] = useState(false);

  // State lưu danh sách tất cả tài khoản của người dùng
  const [accountData, setAccountData] = useState([]);

  // State lưu thông tin tài khoản nguồn (tài khoản chuyển tiền đi)
  const [fromAccountInfo, setFromAccountInfo] = useState({});

  // State lưu thông tin tài khoản đích (tài khoản nhận tiền)
  const [toAccountInfo, setToAccountInfo] = useState({});

  /**
   * Xử lý submit form chuyển tiền
   * Hợp nhất dữ liệu form với ID của 2 tài khoản đã chọn và gửi request đến API
   * @param {Object} data - Dữ liệu từ form (amount)
   */
  const submitHandler = async (data) => {
    try {
      setLoading(true);
      // Kết hợp số tiền với ID của tài khoản nguồn và đích
      const newData = {
        ...data,
        from_account: fromAccountInfo.id,
        to_account: toAccountInfo.id,
      };

      // Gọi API PUT để thực hiện giao dịch chuyển tiền
      const { data: res } = await api.put(
        "/transaction/transfer-money",
        newData,
      );

      if (res?.status === "success") {
        // Hiển thị thông báo thành công
        toast.success(res?.message);
        // Đóng dialog
        setIsOpen(false);
        // Làm mới danh sách tài khoản để cập nhật số dư mới nhất
        refetch();
      }
    } catch (error) {
      console.error("Something went wrong:", error);
      // Hiển thị thông báo lỗi từ API hoặc lỗi mặc định
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Lấy thông tin chi tiết của tài khoản dựa trên tên hiển thị
   * Tìm tài khoản trong danh sách và cập nhật state với thông tin đầy đủ (bao gồm số dư)
   * @param {Function} setAccount - Hàm setState để cập nhật thông tin tài khoản (fromAccountInfo hoặc toAccountInfo)
   * @param {string} val - Tên hiển thị của tài khoản được chọn từ dropdown
   */
  const getAccountBalance = (setAccount, val) => {
    // Tìm tài khoản trong danh sách có tên trùng khớp
    const filteredAccount = accountData?.find(
      (account) => account.account_name === val,
    );

    // Cập nhật state với thông tin tài khoản đã tìm được
    setAccount(filteredAccount);
  };

  /**
   * Hàm đóng modal dialog
   */
  function closeModal() {
    setIsOpen(false);
  }

  /**
   * Hàm fetch danh sách tất cả tài khoản của người dùng từ API
   * Sử dụng useCallback để tránh re-render không cần thiết
   */
  const fetchAccounts = useCallback(async () => {
    try {
      // Gọi API GET để lấy danh sách tài khoản
      const { data: res } = await api.get(`/account`);

      // Lưu danh sách tài khoản vào state
      setAccountData(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Effect chạy khi component mount để tải danh sách tài khoản
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <DialogWrapper closeModal={closeModal} isOpen={isOpen}>
      <DialogPanel className="bg-white p-6 rounded-2xl w-full max-w-md overflow-hidden text-left transform">
        <DialogTitle
          as="h3"
          className="mb-4 font-medium text-gray-900 text-lg uppercase leading-6"
        >
          Chuyển tiền
        </DialogTitle>
        {/* Hiển thị loading khi đang tải danh sách tài khoản */}
        {isLoading ? (
          <Loading />
        ) : (
          <form action="" onSubmit={handleSubmit(submitHandler)}>
            {/* Dropdown chọn tài khoản nguồn (tài khoản chuyển tiền đi) */}
            <div className="flex flex-col gap-1 mb-2">
              <p className="mb-2 text-gray-700 text-sm">Từ tài khoản</p>
              <select
                className="block focus:ring-opacity-50 shadow-sm px-3 py-2 border-gray-300 focus:border-indigo-300 rounded-md focus:ring focus:ring-blue-400 w-full h-10 text-gray-700"
                defaultValue=""
                onChange={(e) =>
                  getAccountBalance(setFromAccountInfo, e.target.value)
                }
              >
                <option
                  className="flex justify-center items-center w-full"
                  disabled
                  value=""
                >
                  Chọn tài khoản
                </option>
                {/* Render danh sách tài khoản để người dùng chọn */}
                {accountData?.map((acc, index) => (
                  <option
                    className="flex justify-center items-center w-full"
                    key={acc?.id || index}
                    value={acc?.account_name}
                  >
                    {acc?.account_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dropdown chọn tài khoản đích (tài khoản nhận tiền) */}
            <div className="flex flex-col gap-1 mb-2">
              <p className="mb-2 text-gray-700 text-sm">Đến tài khoản</p>
              <select
                className="block focus:ring-opacity-50 shadow-sm px-3 py-2 border-gray-300 focus:border-indigo-300 rounded-md focus:ring focus:ring-blue-400 w-full h-10 text-gray-700"
                defaultValue=""
                onChange={(e) =>
                  getAccountBalance(setToAccountInfo, e.target.value)
                }
              >
                <option
                  className="flex justify-center items-center w-full"
                  disabled
                  value=""
                >
                  Chọn tài khoản
                </option>
                {/* Render danh sách tài khoản để người dùng chọn */}
                {accountData?.map((acc, index) => (
                  <option
                    className="flex justify-center items-center w-full"
                    key={acc?.id || index}
                    value={acc?.account_name}
                  >
                    {acc?.account_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Hiển thị cảnh báo nếu tài khoản nguồn không có số dư (<= 0) */}
            {fromAccountInfo?.account_balance <= 0 && (
              <div className="flex items-center gap-2 bg-yellow-400 mt-6 p-2 rounded text-black">
                <MdOutlineWarning size={30} />
                <span className="text-sm">
                  Không thể chuyển tiền từ tài khoản này. Số dư không đủ.
                </span>
              </div>
            )}

            {/* Chỉ hiển thị form nhập số tiền khi:
                - Tài khoản nguồn có số dư > 0
                - Đã chọn tài khoản đích (có ID) */}
            {fromAccountInfo.account_balance > 0 && toAccountInfo.id && (
              <>
                <div></div>

                {/* Input nhập số tiền muốn chuyển */}
                <Input
                  error={errors.amount ? errors.amount.message : ""}
                  label="Số tiền"
                  name="amount"
                  placeholder="10.56"
                  {...register("amount", {
                    required: "Số tiền giao dịch là bắt buộc!",
                  })}
                  type="number"
                />

                {/* Nút submit - hiển thị số tiền đã nhập trong text button */}
                <div className="mt-8 w-full">
                  <Button
                    className="bg-violet-700 w-full text-white"
                    disabled={loading}
                    type="submit"
                  >
                    {/* Hiển thị "Chuyển $X" với X là số tiền đã format, nếu chưa nhập thì chỉ hiển thị "Chuyển $" */}
                    {"Chuyển " +
                      (watch("amount") ? formatCurrency(watch("amount")) : "")}
                  </Button>
                </div>
              </>
            )}
          </form>
        )}
      </DialogPanel>
    </DialogWrapper>
  );
};

export default TransferMoney;
