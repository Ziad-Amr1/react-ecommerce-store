import { Navigate, Outlet } from "react-router-dom";
import useAuth from "./hooks/useAuth";

const ProtectedRoute = () => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if(isLoading){
    return <div>Loading...</div>;
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