import { DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { BiLoader } from "react-icons/bi";
import { MdOutlineWarning } from "react-icons/md";
import { toast } from "sonner";
import DialogWrapper from "../components/wrappers/DialogWrapper";
import { generateAccountNumber } from "../libs";
import api from "../libs/api";
import useStore from "../store";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";

// Danh sách các loại tài khoản có sẵn trong hệ thống
const accounts = ["Cash", "Crypto", "Paypal", "Visa Debit Card"];

/**
 * Component dialog để thêm tài khoản mới
 * Cho phép người dùng chọn loại tài khoản, nhập số tài khoản và số dư khởi tạo
 * @param {boolean} isOpen - Trạng thái mở/đóng dialog
 * @param {Function} setIsOpen - Hàm để thay đổi trạng thái dialog
 * @param {Function} refetch - Hàm để làm mới danh sách tài khoản sau khi tạo thành công
 */
const AddAccount = ({ isOpen, setIsOpen, refetch }) => {
  // Lấy thông tin user từ store để kiểm tra tài khoản đã tồn tại
  const { user } = useStore((state) => state);

  // Khởi tạo react-hook-form với giá trị mặc định: số tài khoản được tự động generate
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { account_number: generateAccountNumber() } });

  // State lưu loại tài khoản đã chọn, mặc định là tài khoản đầu tiên trong danh sách
  const [selectedAccount, setSelectedAccount] = useState(accounts[0]);

  // State quản lý trạng thái loading khi đang gửi request tạo tài khoản
  const [loading, setLoading] = useState(false);

  /**
   * Xử lý submit form tạo tài khoản mới
   * Hợp nhất dữ liệu form với loại tài khoản đã chọn và gửi request đến API
   * @param {Object} data - Dữ liệu từ form (account_number, amount)
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Kết hợp dữ liệu form với tên loại tài khoản đã chọn
      const newData = { ...data, name: selectedAccount };
      // Gọi API tạo tài khoản mới
      const { data: res } = await api.post("/account/create", newData);
      if (res?.data) {
        // Hiển thị thông báo thành công
        toast.success(res?.message);
        // Đóng dialog
        setIsOpen(false);
        // Làm mới danh sách tài khoản
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
   * Hàm đóng modal dialog
   */
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <DialogWrapper closeModal={closeModal} isOpen={isOpen}>
      <DialogPanel className="bg-white shadow-xl p-6 rounded-2xl w-full max-w-md overflow-hidden text-left align-middle transition-all transform">
        <DialogTitle
          as="h3"
          className="mb-4 font-medium text-gray-900 text-lg uppercase leading-6"
        >
          Thêm tài khoản
        </DialogTitle>
        <form action="" className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Dropdown chọn loại tài khoản */}
          <div className="flex flex-col gap-2">
            <label
              className="font-medium text-gray-700 text-sm"
              htmlFor="account-select"
            >
              Chọn tài khoản
            </label>
            <select
              className="bg-white focus:ring-opacity-50 shadow-sm px-3 py-2 border-gray-300 focus:border-indigo-300 rounded-md outline-none focus:ring focus:ring-blue-400 w-full h-10 text-gray-900"
              id="account-select"
              onChange={(e) => setSelectedAccount(e.target.value)}
              value={selectedAccount}
            >
              {/* Render danh sách các loại tài khoản với tên tiếng Việt */}
              {accounts.map((acc) => (
                <option className="text-gray-900" key={acc} value={acc}>
                  {acc === "Cash"
                    ? "Tiền mặt"
                    : acc === "Crypto"
                      ? "Tiền số"
                      : acc === "Paypal"
                        ? "Paypal"
                        : "Thẻ ghi nợ Visa"}
                </option>
              ))}
            </select>
          </div>

          {/* Hiển thị cảnh báo nếu loại tài khoản đã được kích hoạt */}
          {user?.accounts?.includes(selectedAccount) && (
            <div className="flex items-center gap-2 bg-yellow-400 p-2 rounded text-black">
              <MdOutlineWarning size={30} />
              <span className="text-sm">
                Tài khoản này đã được kích hoạt. Vui lòng chọn tài khoản khác.
              </span>
            </div>
          )}

          {/* Chỉ hiển thị form nhập liệu nếu loại tài khoản chưa được kích hoạt */}
          {!user?.accounts?.includes(selectedAccount) && (
            <div className="flex flex-col gap-6">
              {/* Input số tài khoản - tự động generate nhưng có thể chỉnh sửa */}
              <Input
                label="Số tài khoản"
                name="account_number"
                placeholder="3864736573648"
                {...register("account_number", {
                  required: "Số tài khoản là bắt buộc!",
                })}
                error={
                  errors.account_number ? errors.account_number.message : ""
                }
              />

              {/* Input số dư khởi tạo cho tài khoản mới */}
              <Input
                error={errors.amount ? errors.amount.message : ""}
                label="Số dư khởi tạo"
                name="amount"
                placeholder="10.56"
                {...register("amount", {
                  required: "Số dư khởi tạo là bắt buộc!",
                })}
                type="number"
              />

              {/* Nút submit - hiển thị spinner khi đang xử lý */}
              <Button
                className="bg-violet-700 hover:bg-violet-800 py-2.5 rounded-md w-full font-medium text-white transition-colors"
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <BiLoader className="mx-auto text-white text-xl animate-spin" />
                ) : (
                  "Tạo tài khoản"
                )}
              </Button>
            </div>
          )}
        </form>
      </DialogPanel>
    </DialogWrapper>
  );
};

export default AddAccount;
