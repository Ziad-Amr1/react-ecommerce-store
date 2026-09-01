import DesignSystem from "./pages/DesignSystem";
import Home from "./pages/Home.jsx";
import AdminLayout from "./components/layout/AdminLayout";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Carts from "./pages/Carts";

import Login from "./pages/Login.jsx";

function App() {
  return (
    <Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Design System */}
      <Route
        path="/design-system"
        element={<DesignSystem />}
      />

      {/* Login */}
      <Route
        path="/login"
        element={<Login />}
      />

      {/* Admin */}
      <Route
        path="/admin"
        element={<AdminLayout />}
      >
        <Route index element={<Dashboard />} />

        <Route
          path="products"
          element={<Products />}
        />

        <Route
          path="orders"
          element={<Orders />}
        />

        <Route
          path="users"
          element={<Users />}
        />

        <Route
          path="carts"
          element={<Carts />}
        />
      </Route>

      {/* أي URL مش موجود */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}

export default App;