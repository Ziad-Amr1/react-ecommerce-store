import { useEffect, useState } from "react";
import api from "@/api/axios";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true)

    const isAuthenticated = !!token; //* !!"youssef" => true || !!null => false

    //Login
    const login = async (email, password) => {
        const response = await api.post("/auth/login", {
            email,
            password,
        })

        const { token, user } = response.data;

        localStorage.setItem("token", token);

        setToken(token);
        setUser(user);

        return response.data;
    }


    //Logout
    const logout = async () => {
        try {
            await api.post("/auth/logout");
        } finally {
            localStorage.removeItem("token");
            setToken(null);
            setUser(null);
        }
    };

    // restore authentication
    useEffect(() => {
        const restoreAuthentication = async () => {
            const stordToken = localStorage.getItem('token');

            if (!stordToken) {
                setIsLoading(false)
                return;
            }

            try {
                const response = await api.get('/auth/me');
                setUser(response.data.user);
            } catch {
                localStorage.removeItem("token");
                setToken(null);
                setUser(null)
            } finally {
                setIsLoading(false);
            }
        }

        restoreAuthentication();
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            token,
            isAuthenticated,
            isLoading,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
