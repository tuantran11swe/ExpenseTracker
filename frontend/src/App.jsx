import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import { setAuthToken } from "./libs/api";
import AccountPage from "./pages/AccountPage";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/SettingsPage";
import Transactions from "./pages/TransactionsPage";
import useStore from "./store";

/**
 * Component Layout chính - Kiểm tra authentication và thiết lập token
 */
const RootLayout = () => {
  const user = useStore((state) => state.user);
  // Thiết lập auth token cho các API request
  setAuthToken(user?.token || "");

  return user ? (
    // Nếu chưa đăng nhập, chuyển hướng đến trang sign-in
    <Navigate replace={true} to="sign-in" />
  ) : (
    <>
      {/* <Navbar /> */}
      <div className="min-h-[cal(h-screen-100px)]">
        <Outlet />
      </div>
    </>
  );
};

function App() {
  return (
    <main>
      <div className="bg-gray-100 dark:bg-slate-900 px-6 md:px-20 w-full min-h-screen">
        <Routes>
          {/* Routes yêu cầu authentication */}
          <Route element={<RootLayout />}>
            <Route element={<Navigate to="/overview" />} path="/" />
            <Route element={<Dashboard />} path="/overview" />
            <Route element={<Transactions />} path="/transactions" />
            <Route element={<Settings />} path="/settings" />
            <Route element={<AccountPage />} path="/account" />
          </Route>
          {/* Routes public - Đăng nhập/Đăng ký */}
          <Route element={<SignIn />} path="/sign-in" />
          <Route element={<SignUp />} path="/sign-up" />
        </Routes>
      </div>
      {/* Toast notifications */}
      <Toaster position="top-center" richColors />
    </main>
  );
}

export default App;
