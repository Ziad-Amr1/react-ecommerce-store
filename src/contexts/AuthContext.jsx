import { createContext, useContext, useState } from "react";
import { loginUser } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      const token =
        data?.token ||
        data?.accessToken ||
        data?.data?.token ||
        data?.data?.accessToken;

      if (!token) {
        throw new Error("Login succeeded but no token was returned.");
      }

      localStorage.setItem("token", token);

      const loggedUser = data?.user || data?.data?.user || null;

      if (loggedUser) {
        localStorage.setItem("user", JSON.stringify(loggedUser));
        setUser(loggedUser);
      }

      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
const handleLogin = (e) => {
  e.preventDefault();

  if (email === "admin@koda.com" && password === "admin1212") {
    // Login successful
    navigate("/admin");
  } else {
    // Login failed
    setError("Invalid email or password");
  }
};