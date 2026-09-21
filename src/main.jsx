import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import AppToaster from "@/components/ui/toaster";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import AuthProvider from "./contexts/AuthProvider";
import CartProvider from "./contexts/CartProvider";
import { DirectionProvider } from "./i18n/DirectionProvider";
import ScrollToTop from "./components/routing/ScrollToTop";

const basename = import.meta.env.BASE_URL.replace(/\/+$/, "");

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter basename={basename}>
        <ScrollToTop />
        <DirectionProvider>
          <CartProvider>
            <App />
            <AppToaster />
          </CartProvider>
        </DirectionProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
