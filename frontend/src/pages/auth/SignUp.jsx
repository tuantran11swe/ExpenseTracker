import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { BiLoader } from "react-icons/bi";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import { Separator } from "../../components/Separator";
import SocialAuth from "../../components/SocialAuth";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import Input from "../../components/ui/Input";
import api from "../../libs/api";
import useStore from "../../store";

// Schema validation cho form đăng ký sử dụng Zod
const RegisterSchema = z.object({
  email: z
    .string({ required_error: "Email là bắt buộc" })
    .email({ message: "Địa chỉ email không hợp lệ" }),
  firstName: z
    .string({ required_error: "Tên là bắt buộc" })
    .min(3, "Tên phải có ít nhất 3 ký tự"),
  password: z
    .string({ required_error: "Mật khẩu là bắt buộc" })
    .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
});

/**
 * Component trang Đăng ký tài khoản
 */
const SignUp = () => {
  const { user } = useStore((state) => state);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(RegisterSchema),
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState();

  // Nếu đã đăng nhập, chuyển hướng về trang chủ
  useEffect(() => {
    user && navigate("/overview");
  }, [user, navigate]);

  /**
   * Xử lý khi submit form đăng ký
   * @param {Object} data - Dữ liệu form
   */
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      // Gửi request đăng ký tới backend
      const { data: res } = await api.post("/auth/sign-up", data);

      if (res?.user) {
        toast.success(res?.message || "Tạo tài khoản thành công");
        // Lưu thông tin user vào localStorage (không có token, cần đăng nhập)
        // Chỉ chuyển hướng đến trang đăng nhập
        setTimeout(() => {
          setLoading(false);
          navigate("/sign-in");
        }, 1000);
      }
    } catch (error) {
      console.error("Đã xảy ra lỗi:", error);
      toast.error(error?.response?.data?.message || error.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 w-full min-h-screen">
      <Card className="bg-white shadow-md w-[400px] overflow-hidden">
        <div className="p-6 md:-8">
          <CardHeader className="py-0">
            <CardTitle className="mb-8 text-center">Tạo tài khoản</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <form
              action=""
              className="space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="space-y-6 mb-8">
                {/* Đăng nhập bằng mạng xã hội */}
                <SocialAuth isLoading={loading} setLoading={setLoading} />
                <Separator />
                {/* Input tên */}
                <Input
                  disabled={loading}
                  error={errors?.firstName?.message}
                  id="firstName"
                  label="Tên"
                  name="firstName"
                  placeholder="Nguyễn Văn A"
                  type="text"
                  {...register("firstName")}
                  className="border text-sm"
                />
                {/* Input email */}
                <Input
                  disabled={loading}
                  error={errors?.email?.message}
                  id="email"
                  label="Email"
                  name="email"
                  placeholder="example@gmail.com"
                  type="email"
                  {...register("email")}
                  className="border text-sm"
                />
                {/* Input mật khẩu */}
                <Input
                  disabled={loading}
                  error={errors?.password?.message}
                  id="password"
                  label="Mật khẩu"
                  name="password"
                  placeholder="Nhập mật khẩu của bạn"
                  type="password"
                  {...register("password")}
                  className="border text-sm"
                />
              </div>
              {/* Nút đăng ký */}
              <Button
                className="bg-violet-800 w-full"
                disabled={loading}
                type="submit"
              >
                {loading ? (
                  <BiLoader className="text-white text-2xl animate-spin" />
                ) : (
                  "Tạo tài khoản"
                )}
              </Button>
            </form>
          </CardContent>
        </div>
        <CardFooter className="justify-center gap-2">
          <p className="text-gray-600 text-sm">Đã có tài khoản?</p>
          <Link
            className="font-semibold text-violet-600 text-sm hover:underline"
            to="/sign-in"
          >
            Đăng nhập
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
