import { useState } from "react"; // Hook quản lý state của React
import { useForm } from "react-hook-form"; // Thư viện quản lý form
import { BiLoader } from "react-icons/bi"; // Icon loading
import { PiEye, PiEyeSlash } from "react-icons/pi"; // Icon hiện/ẩn mật khẩu
import { toast } from "sonner"; // Thư viện hiển thị thông báo
import api from "../libs/api"; // Instance axios đã được cấu hình
import { Button } from "./ui/Button"; // Component Button tái sử dụng
import Input from "./ui/Input"; // Component Input tái sử dụng

const ChangePasswordForm = () => {
  // Khởi tạo các hàm và state từ react-hook-form
  const {
    register, // Hàm đăng ký input vào form
    handleSubmit, // Hàm xử lý khi submit form
    formState: { errors }, // Đối tượng chứa lỗi validation
    getValues, // Hàm lấy giá trị hiện tại của các field
  } = useForm();

  // State quản lý trạng thái loading khi đang gọi API
  const [loading, setLoading] = useState(false);
  // State quản lý việc hiển thị/ẩn mật khẩu cho từng trường
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Hàm xử lý khi người dùng ấn nút "Đổi mật khẩu"
  const submitPasswordHandler = async (data) => {
    try {
      setLoading(true); // Bắt đầu loading

      // Gọi API PUT để đổi mật khẩu
      const { data: res } = await api.put("/user/change-password", data);

      // Nếu thành công, hiển thị thông báo
      if (res?.status === "success") {
        toast.success(res?.message);
      }
    } catch (error) {
      // Nếu có lỗi, hiển thị thông báo lỗi từ server hoặc lỗi mặc định
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false); // Kết thúc loading dù thành công hay thất bại
    }
  };
  return (
    <div className="py-20">
      <form onSubmit={handleSubmit(submitPasswordHandler)}>
        <div className="">
          {/* Tiêu đề form đổi mật khẩu */}
          <p className="mb-1 font-bold text-black dark:text-white text-xl">
            Đổi Mật Khẩu
          </p>
          {/* Mô tả về mục đích của việc đổi mật khẩu */}
          <span className="labelStyles">
            Mật khẩu này sẽ được sử dụng để đăng nhập vào tài khoản của bạn và
            thực hiện các hành động quan trọng.
          </span>

          <div className="space-y-6 mt-6">
            {/* Trường nhập mật khẩu hiện tại */}
            <Input
              disabled={loading}
              error={
                errors.currentPassword ? errors.currentPassword.message : ""
              }
              label="Mật Khẩu Hiện Tại"
              {...register("currentPassword", {
                required: "Vui lòng nhập mật khẩu hiện tại!",
              })}
              rightIcon={
                showCurrentPassword ? (
                  <PiEye
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowCurrentPassword(false)}
                    size={22}
                  />
                ) : (
                  <PiEyeSlash
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowCurrentPassword(true)}
                    size={22}
                  />
                )
              }
              type={showCurrentPassword ? "text" : "password"}
            />

            {/* Trường nhập mật khẩu mới */}
            <Input
              disabled={loading}
              error={errors.newPassword ? errors.newPassword.message : ""}
              label="Mật Khẩu Mới"
              {...register("newPassword", {
                required: "Vui lòng nhập mật khẩu mới!",
              })}
              rightIcon={
                showNewPassword ? (
                  <PiEye
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowNewPassword(false)}
                    size={22}
                  />
                ) : (
                  <PiEyeSlash
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowNewPassword(true)}
                    size={22}
                  />
                )
              }
              type={showNewPassword ? "text" : "password"}
            />

            {/* Trường xác nhận mật khẩu mới */}
            <Input
              disabled={loading}
              error={
                errors.confirmPassword ? errors.confirmPassword.message : ""
              }
              label="Xác Nhận Mật Khẩu"
              {...register("confirmPassword", {
                required: "Vui lòng xác nhận mật khẩu!",
                validate: (val) => {
                  const { newPassword } = getValues();
                  return newPassword === val || "Mật khẩu không khớp!";
                },
              })}
              rightIcon={
                showConfirmPassword ? (
                  <PiEye
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowConfirmPassword(false)}
                    size={22}
                  />
                ) : (
                  <PiEyeSlash
                    className="text-gray-500 cursor-pointer"
                    onClick={() => setShowConfirmPassword(true)}
                    size={22}
                  />
                )
              }
              type={showConfirmPassword ? "text" : "password"}
            />
          </div>
        </div>
        <div className="flex justify-end items-center gap-6 mt-10 pb-10 border-gray-200 border-b-2">
          <Button
            className="bg-transparent px-6 border border-gray-200 text-black"
            loading={loading}
            type="reset"
            variant="outline"
          >
            Đặt lại
          </Button>
          <Button
            className="bg-violet-800 px-8 text-white"
            loading={loading}
            type="submit"
          >
            {loading ? (
              <BiLoader className="text-white animate-spin" />
            ) : (
              "Đổi mật khẩu"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
