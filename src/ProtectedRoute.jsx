import { Navigate, Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";
import useAuth from "./hooks/useAuth";

const ProtectedRoute = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, isLoading } = useAuth();

  if(isLoading){
    return (
      <main className="flex min-h-screen items-center justify-center bg-(--color-background) p-4">
        <div
          role="status"
          aria-live="polite"
          aria-busy="true"
          className="flex flex-col items-center gap-3 text-center"
        >
          <Loader2
            className="size-8 animate-spin text-(--color-primary)"
            aria-hidden="true"
          />
          <p className="text-sm text-(--color-text-secondary)">
            {t("common.checkingSession")}
          </p>
        </div>
      </main>
    );
  }

  if(!isAuthenticated){
    return <Navigate replace to="/login" />;
  }

  if(user?.role !== "admin"){
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
