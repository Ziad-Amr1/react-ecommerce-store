import DesignSystem from "./pages/DesignSystem";
import Home from "./pages/Home.jsx";
import AdminLayout from "./components/layout/AdminLayout";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Carts from "./pages/admin/Carts";
import Login from "./pages/auth/Login.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";

function App(){
  return(
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/design-system" element={<DesignSystem />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="carts" element={<Carts />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App; 