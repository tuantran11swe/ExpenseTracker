import { create } from "zustand";

// Tạo store toàn cục sử dụng Zustand để quản lý state
const useStore = create((set) => ({
  // Hàm đăng xuất, xóa thông tin user
  logoutUser: () => set({ user: null }),
  // Hàm lưu thông tin user khi đăng nhập thành công
  setUserCredentials: (user) => set({ user }),

  // Thông tin user đang đăng nhập, lấy từ localStorage
  // Trả về null nếu chưa đăng nhập
  user: JSON.parse(localStorage.getItem("user")) ?? null,
}));

export default useStore;
