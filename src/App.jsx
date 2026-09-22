import { lazy, Suspense } from "react";
import AdminLayout from "./components/layout/AdminLayout";
import StoreLayout from "./components/layout/StoreLayout";
import { Routes, Route } from "react-router";
import ProtectedRoute from "./ProtectedRoute.jsx";
import RequireAuth from "./RequireAuth.jsx";
import NotificationProvider from "./contexts/NotificationProvider.jsx";
import WishlistProvider from "./contexts/WishlistProvider.jsx";
import { TooltipProvider } from "@/components/ui/tooltip";
import Maintenance from "./pages/Maintenance.jsx";
import NotFound from "./pages/NotFound.jsx";

const Landing = lazy(() => import("./pages/Landing.jsx"));
const Shop = lazy(() => import("./pages/Shop.jsx"));
const StoreProductDetails = lazy(() => import("./pages/ProductDetails.jsx"));
const CategoriesStore = lazy(() => import("./pages/CategoriesStore.jsx"));
const About = lazy(() => import("./pages/About.jsx"));
const Privacy = lazy(() => import("./pages/Privacy.jsx"));
const HelpCenter = lazy(() => import("./pages/HelpCenter.jsx"));
const ShippingReturns = lazy(() => import("./pages/ShippingReturns.jsx"));
const Contact = lazy(() => import("./pages/Contact.jsx"));
const MyOrders = lazy(() => import("./pages/MyOrders.jsx"));
const OrderDetails = lazy(() => import("./pages/OrderDetails.jsx"));
const Wishlist = lazy(() => import("./pages/Wishlist.jsx"));
const Checkout = lazy(() => import("./pages/Checkout/Checkout.jsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.jsx"));
const Notifications = lazy(() => import("./pages/Notifications.jsx"));
const Cart = lazy(() => import("./pages/Cart.jsx"));
const Profile = lazy(() => import("./pages/Profile.jsx"));
const Login = lazy(() => import("./pages/auth/Login.jsx"));
const Registration = lazy(() => import("./pages/auth/Registration.jsx"));
const ForgetPassword = lazy(() => import("./pages/auth/ForgetPassword.jsx"));
const VerifyOtp = lazy(() => import("./pages/auth/VerifyOtp.jsx"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Products = lazy(() => import("./pages/admin/Products"));
const AddProduct = lazy(() => import("./pages/admin/AddProduct"));
const EditProduct = lazy(() => import("./pages/admin/EditProduct"));
const AdminProductDetails = lazy(() => import("./pages/admin/ProductDetails"));
const Orders = lazy(() => import("./pages/admin/Orders"));
const Users = lazy(() => import("./pages/admin/Users"));
const Carts = lazy(() => import("./pages/admin/Carts"));
const Categories = lazy(() => import("./pages/admin/Categories"));
const Reviews = lazy(() => import("./pages/admin/Reviews"));
const Wishlists = lazy(() => import("./pages/admin/Wishlists"));
const Coupons = lazy(() => import("./pages/admin/Coupons"));
const Reports = lazy(() => import("./pages/admin/Reports"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const DesignSystem = lazy(() => import("./pages/DesignSystem"));

const MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === "true";

function AppLoader({ children }) {
  return (
    <Suspense
      fallback={
        <div
          aria-hidden="true"
          className="flex min-h-[60vh] items-center justify-center p-6"
        >
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-(--color-surface-muted) border-t-(--color-primary)" />
        </div>
      }
    >
      {children}
    </Suspense>
  );
}

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
          <Route path="/" element={<AppLoader><Landing /></AppLoader>} />
          <Route path="/products" element={<AppLoader><Shop /></AppLoader>} />
          <Route path="/products/:id" element={<AppLoader><StoreProductDetails /></AppLoader>} />
          <Route path="/categories" element={<AppLoader><CategoriesStore /></AppLoader>} />
          <Route path="/about" element={<AppLoader><About /></AppLoader>} />
          <Route path="/privacy" element={<AppLoader><Privacy /></AppLoader>} />
          <Route path="/help" element={<AppLoader><HelpCenter /></AppLoader>} />
          <Route path="/shipping" element={<AppLoader><ShippingReturns /></AppLoader>} />
          <Route path="/contact" element={<AppLoader><Contact /></AppLoader>} />
          <Route element={<RequireAuth />}>
            <Route path="/my-orders" element={<AppLoader><MyOrders /></AppLoader>} />
            <Route path="/my-orders/:id" element={<AppLoader><OrderDetails /></AppLoader>} />
            <Route path="/wishlist" element={<AppLoader><Wishlist /></AppLoader>} />
            <Route path="/checkout" element={<AppLoader><Checkout /></AppLoader>} />
            <Route path="/order-success" element={<AppLoader><OrderSuccess /></AppLoader>} />
            <Route path="/notifications" element={<AppLoader><Notifications /></AppLoader>} />
          </Route>
          <Route path="/cart" element={<AppLoader><Cart /></AppLoader>} />
          <Route path="/profile" element={<AppLoader><Profile /></AppLoader>} />
        </Route>
        <Route path="/design-system" element={<AppLoader><DesignSystem /></AppLoader>} />
        <Route path="/login" element={<AppLoader><Login /></AppLoader>} />
        <Route path="/register" element={<AppLoader><Registration /></AppLoader>} />
        <Route path="/forgot-password" element={<AppLoader><ForgetPassword /></AppLoader>} />
        <Route path="/:flow/verify-otp" element={<AppLoader><VerifyOtp /></AppLoader>} />

        {/* Start of Protected Admin Routes  */}
        <Route path="/admin/*" element={<ProtectedRoute />}>
          <Route element={<AdminLayout />}>
            <Route index element={<AppLoader><Dashboard /></AppLoader>} />
            <Route path="products" element={<AppLoader><Products /></AppLoader>} />
            <Route path="products/add" element={<AppLoader><AddProduct /></AppLoader>} />
            <Route path="products/:id/edit" element={<AppLoader><EditProduct /></AppLoader>} />
            <Route path="products/:id" element={<AppLoader><AdminProductDetails /></AppLoader>} />
            <Route path="categories" element={<AppLoader><Categories /></AppLoader>} />
            <Route path="orders" element={<AppLoader><Orders /></AppLoader>} />
            <Route path="users" element={<AppLoader><Users /></AppLoader>} />
            <Route path="carts" element={<AppLoader><Carts /></AppLoader>} />
            <Route path="reviews" element={<AppLoader><Reviews /></AppLoader>} />
            <Route path="wishlists" element={<AppLoader><Wishlists /></AppLoader>} />
            <Route path="coupons" element={<AppLoader><Coupons /></AppLoader>} />
            <Route path="reports" element={<AppLoader><Reports /></AppLoader>} />
            <Route path="settings" element={<AppLoader><Settings /></AppLoader>} />
          </Route>
        </Route>
        <Route path="/maintenance" element={<AppLoader><Maintenance /></AppLoader>} />
        <Route path="*" element={<AppLoader><NotFound /></AppLoader>} />
      </Routes>
        </WishlistProvider>
    </NotificationProvider>
    </TooltipProvider>
  );
}

export default App;