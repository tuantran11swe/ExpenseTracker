import { DialogPanel, DialogTitle } from "@headlessui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { formatCurrency } from "../libs";
import api from "../libs/api";
import { Button } from "./ui/Button";
import Input from "./ui/Input";
import DialogWrapper from "./wrappers/DialogWrapper";

/**
 * Component dialog để nạp tiền vào tài khoản
 * Cho phép người dùng nhập số tiền muốn nạp và cập nhật số dư tài khoản
 * @param {boolean} isOpen - Trạng thái mở/đóng dialog
 * @param {Function} setIsOpen - Hàm để thay đổi trạng thái dialog
 * @param {string|number} id - ID của tài khoản cần nạp tiền
 * @param {Function} refetch - Hàm để làm mới danh sách tài khoản sau khi nạp thành công
 */
const AddMoney = ({ isOpen, setIsOpen, id, refetch }) => {
  // Khởi tạo react-hook-form để quản lý form nhập số tiền
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch, // Dùng để theo dõi giá trị input real-time để hiển thị trong button
  } = useForm();

  // State quản lý trạng thái loading khi đang gửi request nạp tiền
  const [loading, setLoading] = useState(false);

  /**
   * Xử lý submit form nạp tiền
   * Gửi request đến API để cập nhật số dư tài khoản với số tiền đã nhập
   * @param {Object} data - Dữ liệu từ form (amount)
   */
  const submitHandler = async (data) => {
    try {
      setLoading(true);

      // Gọi API PUT để nạp tiền vào tài khoản theo ID
      const { data: res } = await api.put(`/account/add-money/${id}`, data);

      if (res?.data) {
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
   * Hàm đóng modal dialog
   */
  function closeModal() {
    setIsOpen(false);
  }
  return (
    <DialogWrapper closeModal={closeModal} isOpen={isOpen}>
      <DialogPanel className="bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-md overflow-hidden text-left transform">
        <DialogTitle
          as="h3"
          className="mb-4 font-medium text-gray-900 dark:text-gray-300 text-lg uppercase leading-6"
        >
          Nạp tiền vào tài khoản
        </DialogTitle>

        <form className="space-y-6" onSubmit={handleSubmit(submitHandler)}>
          {/* Input nhập số tiền muốn nạp vào tài khoản */}
          <Input
            error={errors.amount ? errors.amount.message : ""}
            label="Số tiền"
            name="amount"
            placeholder="10.56"
            {...register("amount", {
              required: "Số tiền là bắt buộc!",
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
              {/* Hiển thị "Gửi $X" với X là số tiền đã format, nếu chưa nhập thì chỉ hiển thị "Gửi $" */}
              {"Gửi $" +
                (watch("amount") ? formatCurrency(watch("amount")) : "")}
            </Button>
          </div>
        </form>
      </DialogPanel>
    </DialogWrapper>
  );
};

export default AddMoney;
