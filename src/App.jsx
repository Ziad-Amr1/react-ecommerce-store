import DesignSystem from "./pages/DesignSystem";
import AdminLayout from "./components/layout/AdminLayout";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Carts from "./pages/admin/Carts";
import Login from "./pages/auth/Login.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import VerifyOtp from "./pages/auth/VerifyOtp.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { DashboardProvider } from "./features/admin/dashboard/DashboardProvider";
import Landing from "./pages/Landing";
import { ProductsProvider } from "./contexts/ProductsContext";

function App() {
  return (
    <>
      <ProductsProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/design-system" element={<DesignSystem />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/forgot-password/verify-otp" element={<VerifyOtp />} />
          {/* Start of Protected Admin Routes  */}
          <Route path="/admin/*" element={<ProtectedRoute />}>
            <Route element={<AdminLayout />}>
              <Route
                index
                element={
                  <DashboardProvider>
                    <Dashboard />
                  </DashboardProvider>
                }
              />
              <Route path="products" element={<Products />} />
              <Route path="orders" element={<Orders />} />
              <Route path="users" element={<Users />} />
              <Route path="carts" element={<Carts />} />
            </Route>
          </Route>
          {/* End of Protected Admin Routes  */}
        </Routes>
      </ProductsProvider>
    </>
  );
}

export default App;
