import DesignSystem from "./pages/DesignSystem";
import Home from "./pages/Home.jsx";
import AdminLayout from "./components/layout/AdminLayout";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Carts from "./pages/admin/Carts";
import Login from "./pages/auth/Login.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { DashboardProvider } from "./features/admin/dashboard/DashboardContext";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/design-system" element={<DesignSystem />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        {/* Start of Protected Admin Routes  */}
        <Route path="/admin/*" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route
              path="dashboard"
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
    </>
  );
}

export default App;
