import { create } from "zustand";

// Tạo store toàn cục sử dụng Zustand để quản lý state
const useStore = create((set) => ({
  // Lưu theme hiện tại (light/dark), mặc định là "light"
  // Lấy từ localStorage để giữ theme khi reload trang
  theme: localStorage.getItem("theme") ?? "light",

  // Thông tin user đang đăng nhập, lấy từ localStorage
  // Trả về null nếu chưa đăng nhập
  user: JSON.parse(localStorage.getItem("user")) ?? null,

  // Hàm đổi theme (light/dark)
  setTheme: (value) => set({ theme: value }),

  // Hàm lưu thông tin user khi đăng nhập thành công
  setCredentials: (user) => set({ user }),

  // Hàm đăng xuất, xóa thông tin user
  signOut: () => set({ user: null }),
}));

export default useStore;
