import { useEffect, useState } from "react";
import api from "@/api/axios";
import AuthContext from "./AuthContext";
import { sendForgotPasswordOTPApi } from "@/features/auth/auth.service";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !isLoading && user !== null;

  //Login
  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { user } = response.data;

    setUser(user);

    return response.data;
  };

  //Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUser(null);
    }
  };

  //ForgetPassword

  const sendForgotPasswordOTP = async (email) => {
    try {
      setIsLoading(true);

      const data = await sendForgotPasswordOTPApi(email);

      return data;
    } finally {
      setIsLoading(false);
    }
  };

  // restore authentication
  useEffect(() => {
    const restoreAuthentication = async () => {
      try {
        const response = await api.get("/auth/me");
        setUser(response.data.user);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuthentication();
  }, []);

  // clear the session when the API reports an unauthorized response
  useEffect(() => {
    const clearSession = () => {
      setIsLoading(false);
      setUser(null);
    };

    window.addEventListener("auth:unauthorized", clearSession); // if received event auth: unauthorized from axios interceptor => clear the session

    return () => {
      window.removeEventListener("auth:unauthorized", clearSession); //clean up , stop the envent listening
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        sendForgotPasswordOTP,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
