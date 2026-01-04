import { create } from "zustand";

// Tạo store toàn cục sử dụng Zustand để quản lý state
const useStore = create((set) => ({
  // Hàm lưu thông tin user khi đăng nhập thành công
  setCredentials: (user) => set({ user }),

  // Hàm đăng xuất, xóa thông tin user
  signOut: () => set({ user: null }),

  // Thông tin user đang đăng nhập, lấy từ localStorage
  // Trả về null nếu chưa đăng nhập
  user: JSON.parse(localStorage.getItem("user")) ?? null,
}));

export default useStore;
