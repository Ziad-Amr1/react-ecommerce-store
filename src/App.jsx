import DesignSystem from "./pages/DesignSystem";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Registration from "./pages/Registration.jsx";
import AdminLayout from "./components/layout/AdminLayout";
import { Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Carts from "./pages/Carts";


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/design-system" element={<DesignSystem />} />
         <Route path="login" element={<Login />} />
         <Route path="/register" element={<Registration />} />
        {/* Start of Nested Routes  */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="carts" element={<Carts />} />

        </Route>
        {/* End of Nested Routes  */}
      </Routes>
    </>
  );
}

export default App;