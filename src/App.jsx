import { lazy, Suspense } from "react";
import Landing from "./pages/Landing.jsx";
import Profile from "./pages/Profile.jsx";
import AdminLayout from "./components/layout/AdminLayout";
import StoreLayout from "./components/layout/StoreLayout";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import ProductDetails from "./pages/admin/ProductDetails";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Carts from "./pages/admin/Carts";
import Settings from "./pages/admin/Settings";
import Login from "./pages/auth/Login.jsx";
import Registration from "./pages/auth/Registration.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import VerifyOtp from "./pages/auth/VerifyOtp.jsx";
import NotFound from "./pages/NotFound.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import Shop from "./pages/Shop.jsx";

const DesignSystem = lazy(() => import("./pages/DesignSystem"));

function App() {
  return (
    <>
      <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route
          path="/design-system"
          element={
            <Suspense
              fallback={
                <div className="mx-auto w-full max-w-6xl space-y-4 p-6">
                  <div className="h-10 w-2/3 animate-pulse rounded-lg bg-(--color-surface-muted)" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-(--color-surface-muted)" />
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="h-40 animate-pulse rounded-xl bg-(--color-surface-muted)" />
                    <div className="h-40 animate-pulse rounded-xl bg-(--color-surface-muted)" />
                    <div className="h-40 animate-pulse rounded-xl bg-(--color-surface-muted)" />
                  </div>
                </div>
              }
            >
              <DesignSystem />
            </Suspense>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/:flow/verify-otp" element={<VerifyOtp />} />
        <Route path="/products" element={<Shop />} />

        {/* Start of Protected Admin Routes  */}
        <Route path="/admin/*" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="products/:id" element={<ProductDetails />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="carts" element={<Carts />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        {/* End of Protected Admin Routes  */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
