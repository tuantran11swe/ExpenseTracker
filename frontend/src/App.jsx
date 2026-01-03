import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import AccountPage from "./pages/AccountPage";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/SettingsPage";
import Transactions from "./pages/TransactionsPage";

const RootLayout = () => {
  const user = null;

  return user ? (
    <Navigate to="sign-in" replace={true} />
  ) : (
    <>
      {/* <Navbar /> */}
      <div>
        <Outlet />
      </div>
    </>
  );
};

function App() {
  return (
    <div>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<Navigate to="/overview" />} />
          <Route path="/overview" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/account" element={<AccountPage />} />
        </Route>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </div>
  );
}

export default App;
