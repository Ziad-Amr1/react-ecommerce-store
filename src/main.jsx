import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import "./index.css";
import "./i18n";
import App from "./App.jsx";
import AuthProvider from "./contexts/AuthProvider";
import { DirectionProvider } from "./i18n/DirectionProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
      <AuthProvider>
        <BrowserRouter>
          <DirectionProvider>
            <App />
          </DirectionProvider>
        </BrowserRouter>
      </AuthProvider>
  </StrictMode>,
);
