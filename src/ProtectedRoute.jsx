import { Navigate, Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import useAuth from "./hooks/useAuth";

const ProtectedRoute = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user, isLoading } = useAuth();

  if(isLoading){
    return <div>{t("common.loading")}</div>;
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
