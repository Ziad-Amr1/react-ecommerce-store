import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import AuthProvider from "./contexts/AuthProvider";
import { DirectionProvider } from "./i18n/DirectionProvider";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <DirectionProvider>
            <App />
            <ToastContainer position="bottom-right" />
          </DirectionProvider>
        </BrowserRouter>
      </AuthProvider>
  </StrictMode>,
);
