import {
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../libs/api";
import { auth } from "../libs/firebaseConfig";
import useStore from "../store";
import { Button } from "./ui/Button";

/**
 * Component xử lý đăng nhập bằng các nhà cung cấp xác thực (Google, Github)
 * @param {boolean} isLoading - Trạng thái loading
 * @param {Function} setLoading - Hàm cập nhật trạng thái loading
 */
const SocialAuth = ({ isLoading, setLoading }) => {
  const [user] = useAuthState(auth); // Lấy thông tin user từ Firebase
  const [selectedProvider, setSelectedProvider] = useState("google"); // Provider được chọn
  const { setCredentials } = useStore((state) => state);
  const navigate = useNavigate();
  const hasProcessedUser = useRef(false); // Theo dõi xem đã xử lý user chưa

  /**
   * Đăng nhập bằng Google
   */
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    setSelectedProvider("google");
    hasProcessedUser.current = false; // Reset flag khi đăng nhập mới
    try {
      await signInWithPopup(auth, provider);
      // Xử lý tiếp được thực hiện trong useEffect khi user thay đổi
    } catch (error) {
      console.error("Lỗi khi đăng nhập với Google", error);
      // Hiển thị thông báo lỗi chi tiết cho người dùng
      if (error.code === "auth/unauthorized-domain") {
        toast.error(
          "Domain chưa được cấu hình trong Firebase. Vui lòng liên hệ quản trị viên.",
        );
      } else if (error.code === "auth/popup-closed-by-user") {
        toast.info("Bạn đã đóng cửa sổ đăng nhập");
      } else {
        toast.error(error.message || "Đã xảy ra lỗi khi đăng nhập với Google");
      }
      setLoading(false);
    }
  };

  /**
   * Đăng nhập bằng Github (chưa sử dụng)
   */
  const _signInWithGithub = async () => {
    const provider = new GithubAuthProvider();
    setSelectedProvider("github");
    try {
      const res = await signInWithPopup(auth, provider);
      console.log(res);
    } catch (error) {
      console.error("Lỗi khi đăng nhập với GitHub", error);
    }
  };

  // Lắng nghe sự thay đổi của user và lưu vào database
  useEffect(() => {
    /**
     * Lưu thông tin user vào database sau khi đăng nhập thành công
     */
    const saveUserToDB = async () => {
      if (hasProcessedUser.current) return; // Ngăn chặn xử lý lại

      try {
        hasProcessedUser.current = true; // Đánh dấu đã xử lý
        // Chuẩn bị dữ liệu user để gửi lên server
        const userData = {
          email: user.email,
          name: user.displayName,
          provider: selectedProvider,
          uid: user.uid,
        };
        setLoading(true);
        // Gửi request đăng nhập/đăng ký đến backend (social sign-in)
        const { data: res } = await api.post("/auth/social-sign-in", userData);
        console.log(res);
        if (res?.user) {
          toast.success(res?.message);
          // Lưu thông tin user và token vào localStorage
          const userInfo = { ...res?.user, token: res?.token };
          localStorage.setItem("user", JSON.stringify(userInfo));
          setCredentials(userInfo);
          // Chuyển hướng về trang overview sau khi đăng nhập thành công
          setTimeout(() => {
            setLoading(false);
            navigate("/overview");
          }, 1000);
        }
      } catch (error) {
        console.error("Đã xảy ra lỗi:", error);
        toast.error(error?.response?.data?.message || error.message);
        hasProcessedUser.current = false; // Reset nếu có lỗi
      } finally {
        setLoading(false);
      }
    };
    // Chỉ lưu user khi đã đăng nhập thành công và chưa được xử lý
    if (user && !hasProcessedUser.current) {
      saveUserToDB();
    }
  }, [user?.uid, navigate, selectedProvider, setCredentials, setLoading, user]);

  return (
    <div>
      {/* Nút đăng nhập với Google */}
      <Button
        className="w-full font-normal text-sm"
        disabled={isLoading}
        onClick={signInWithGoogle}
        type="button"
        variant="outline"
      >
        <FcGoogle className="mr-2" size={20} />
        Đăng nhập với Google
      </Button>
    </div>
  );
};

export default SocialAuth;
