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
import AdminProductDetails from "./pages/admin/ProductDetails";
import StoreProductDetails from "./pages/ProductDetails.jsx";
import Orders from "./pages/admin/Orders";
import Users from "./pages/admin/Users";
import Carts from "./pages/admin/Carts";
import Categories from "./pages/admin/Categories";
import Reviews from "./pages/admin/Reviews";
import Wishlists from "./pages/admin/Wishlists";
import Coupons from "./pages/admin/Coupons";
import Reports from "./pages/admin/Reports";
import Settings from "./pages/admin/Settings";
import Login from "./pages/auth/Login.jsx";
import Registration from "./pages/auth/Registration.jsx";
import ForgetPassword from "./pages/auth/ForgetPassword.jsx";
import VerifyOtp from "./pages/auth/VerifyOtp.jsx";
import NotFound from "./pages/NotFound.jsx";
import Maintenance from "./pages/Maintenance.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RequireAuth from "./RequireAuth.jsx";
import Shop from "./pages/Shop.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout/Checkout.jsx";
import OrderSuccess from "./pages/OrderSuccess.jsx";
import About from "./pages/About.jsx";
import MyOrders from "./pages/MyOrders.jsx";
import OrderDetails from "./pages/OrderDetails.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Notifications from "./pages/Notifications.jsx";
import NotificationProvider from "./contexts/NotificationProvider.jsx";
import WishlistProvider from "./contexts/WishlistProvider.jsx";
import Privacy from "./pages/Privacy.jsx";
import CategoriesStore from "./pages/CategoriesStore.jsx";
import HelpCenter from "./pages/HelpCenter.jsx";
import ShippingReturns from "./pages/ShippingReturns.jsx";
import Contact from "./pages/Contact.jsx";
import { TooltipProvider } from "@/components/ui/tooltip";

const DesignSystem = lazy(() => import("./pages/DesignSystem"));

const MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === "true";

function App() {
  if (MAINTENANCE_MODE) {
    return <Maintenance />;
  }

  return (
    <TooltipProvider delayDuration={200}>
      <NotificationProvider>
        <WishlistProvider>
        <Routes>
        <Route element={<StoreLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/products" element={<Shop />} />
          <Route path="/products/:id" element={<StoreProductDetails />} />
          <Route path="/categories" element={<CategoriesStore />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/shipping" element={<ShippingReturns />} />
          <Route path="/contact" element={<Contact />} />
          <Route element={<RequireAuth />}>
            <Route path="/my-orders" element={<MyOrders />} />
            <Route path="/my-orders/:id" element={<OrderDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/notifications" element={<Notifications />} />
          </Route>
          <Route path="/cart" element={<Cart />} />
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

        {/* Start of Protected Admin Routes  */}
        <Route path="/admin/*" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="products/:id/edit" element={<EditProduct />} />
            <Route path="products/:id" element={<AdminProductDetails />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
            <Route path="carts" element={<Carts />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="wishlists" element={<Wishlists />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
        </WishlistProvider>
    </NotificationProvider>
    </TooltipProvider>
  );
}

export default App;
