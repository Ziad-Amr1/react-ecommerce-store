import DesignSystem from "./pages/DesignSystem";
import Home from "./pages/Home.jsx";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Carts from "./pages/admin/Carts";
import DashboardLayout from "./components/layout/dashboard/DashboardLayout";
import AdminLayout from "./components/layout/admin/AdminLayout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/design-system" element={<DesignSystem />} />

        {/* Dashboard */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
        </Route>

        {/* Other Admin Pages */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="carts" element={<Carts />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
