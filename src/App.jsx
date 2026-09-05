import { lazy, Suspense } from "react";
import Home from "./pages/Home.jsx";
import AdminLayout from "./components/layout/AdminLayout";
import { Routes, Route } from "react-router";
import Dashboard from "./pages/admin/Dashboard";
import Products from "./pages/admin/Products";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Carts from "./pages/admin/Carts";
import Login from "./pages/auth/Login.jsx";
import Registration from "./pages/auth/Registration.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import VerifyOtp from "./pages/auth/VerifyOtp.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import { DashboardProvider } from "./features/admin/dashboard/DashboardProvider";

const DesignSystem = lazy(() => import("./pages/DesignSystem"));

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/design-system"
          element={
            <Suspense
              fallback={
                <div className="mx-auto w-full max-w-6xl space-y-4 p-6">
                  <div className="h-10 w-2/3 animate-pulse rounded-lg bg-[var(--color-surface-muted)]" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-[var(--color-surface-muted)]" />
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="h-40 animate-pulse rounded-xl bg-[var(--color-surface-muted)]" />
                    <div className="h-40 animate-pulse rounded-xl bg-[var(--color-surface-muted)]" />
                    <div className="h-40 animate-pulse rounded-xl bg-[var(--color-surface-muted)]" />
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
    </>
  );
}

export default App;
