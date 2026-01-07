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

// Component thêm giao dịch mới
// Nhận props: isOpen (trạng thái mở/đóng dialog), setIsOpen (hàm set trạng thái), refetch (hàm làm mới dữ liệu)
const AddTransaction = ({ isOpen, setIsOpen, refetch }) => {
  // Sử dụng react-hook-form để quản lý form
  const {
    register, // Đăng ký các input field
    handleSubmit, // Xử lý submit form
    formState: { errors }, // Lỗi validation của form
    watch, // Theo dõi giá trị của các field trong form
  } = useForm();

  // State lưu số dư tài khoản hiện tại
  const [accountBalance, setAccountBalance] = useState(0);
  // State quản lý trạng thái loading khi fetch danh sách tài khoản
  const [isLoading, setIsLoading] = useState(false);
  // State quản lý trạng thái loading khi submit form
  const [loading, setLoading] = useState(false);
  // State lưu danh sách tất cả tài khoản
  const [accountData, setAccountData] = useState([]);
  // State lưu thông tin tài khoản được chọn
  const [accountInfo, setAccountInfo] = useState({});

  // Hàm xử lý khi submit form thêm giao dịch
  const submitHandler = async (data) => {
    try {
      setLoading(true);
      // Thêm thông tin tài khoản nguồn vào dữ liệu giao dịch
      const newData = { ...data, source: accountInfo.account_name };

      // Gọi API để thêm giao dịch mới
      const { data: res } = await api.post(
        `/transaction/add-transaction/${accountInfo.id}`,
        newData,
      );
      if (res?.status === "success") {
        toast.success(res?.message);
        setIsOpen(false); // Đóng dialog
        refetch(); // Làm mới danh sách giao dịch
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  // Hàm lấy số dư của tài khoản khi người dùng chọn tài khoản
  const getAccountBalance = (val) => {
    // Tìm tài khoản trong danh sách theo tên
    const filteredAccount = accountData?.find(
      (account) => account.account_name === val,
    );
    // Cập nhật số dư và thông tin tài khoản được chọn
    setAccountBalance(filteredAccount ? filteredAccount.account_balance : 0);
    setAccountInfo(filteredAccount);
  };

  // Hàm đóng dialog
  function closeModal() {
    setIsOpen(false);
  }

  // Hàm fetch danh sách tài khoản từ API
  // Sử dụng useCallback để tránh re-render không cần thiết
  const fetchAccounts = useCallback(async () => {
    try {
      const { data: res } = await api.get(`/account`);
      setAccountData(res?.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch danh sách tài khoản khi component mount
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  return (
    <DialogWrapper closeModal={closeModal} isOpen={isOpen}>
      <DialogPanel className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-md overflow-hidden text-left transform">
        <DialogTitle
          as="h3"
          className="mb-4 font-medium text-gray-900 dark:text-gray-300 text-lg uppercase leading-6"
        >
          Thêm Giao Dịch
        </DialogTitle>

        {isLoading ? (
          <Loading />
        ) : (
          <form onSubmit={handleSubmit(submitHandler)}>
            <div className="flex flex-col gap-1 mb-2">
              <p className="mb-2 text-gray-700 dark:text-gray-400 text-sm">
                Chọn Tài Khoản
              </p>
              <select
                className="inputStyles"
                onChange={(e) => getAccountBalance(e.target.value)}
              >
                <option disabled selected>
                  Chọn Tài Khoản
                </option>
                {accountData?.map((acc) => (
                  <option
                    className="flex justify-center items-center dark:bg-slate-900 w-full"
                    key={acc.id}
                    value={acc?.account_name}
                  >
                    {acc?.account_name} {" - "}
                    {formatCurrency(acc?.account_balance)}
                  </option>
                ))}
              </select>
            </div>

            {/* Hiển thị cảnh báo nếu số dư tài khoản không đủ */}
            {accountBalance <= 0 && (
              <div className="flex items-center gap-2 bg-yellow-400 mt-6 p-2 rounded text-black">
                <MdOutlineWarning size={30} />
                <span className="text-sm">
                  Bạn không thể thực hiện giao dịch từ tài khoản này. Số dư tài
                  khoản không đủ.
                </span>
              </div>
            )}

            {/* Chỉ hiển thị form nhập liệu khi số dư > 0 */}
            {accountBalance > 0 && (
              <>
                <Input
                  label="Mô Tả"
                  name="description"
                  placeholder="Cửa hàng tạp hóa"
                  {...register("description", {
                    required: "Mô tả giao dịch là bắt buộc!",
                  })}
                  error={errors.description ? errors.description.message : ""}
                />

                <Input
                  label="Số Tiền"
                  name="amount"
                  placeholder="10.56"
                  type="number"
                  {...register("amount", {
                    required: "Số tiền giao dịch là bắt buộc!",
                  })}
                  error={errors.amount ? errors.amount.message : ""}
                />

                <div className="mt-8 w-full">
                  <Button
                    className="bg-violet-700 w-full text-white"
                    disabled={loading}
                    type="submit"
                  >
                    {`Xác Nhận ${
                      watch("amount") ? formatCurrency(watch("amount")) : ""
                    }`}
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

export default AddTransaction;
