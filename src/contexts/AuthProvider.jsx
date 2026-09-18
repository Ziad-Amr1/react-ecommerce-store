import { useCallback, useEffect, useState } from "react";
import {
  loginUser,
  logoutUser,
  getCurrentUser,
  updateCurrentUser,
} from "@/features/auth/auth.service";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true)
    const [restoreError, setRestoreError] = useState(false)

    const isAuthenticated = !isLoading && user !== null;

    //Login
    const login = async (email, password) => {
        const data = await loginUser(email, password);

        const { user } = data;

        setRestoreError(false);
        setUser(user);

        return data;
    }


    //Logout
    const logout = async () => {
        try {
            await logoutUser();
        } finally {
            setRestoreError(false);
            setUser(null);
        }
    };

    // restore authentication
    useEffect(() => {
        const controller = new AbortController();

        const restoreAuthentication = async () => {
            try {
                const data = await getCurrentUser(controller.signal);

                if (controller.signal.aborted) return;

                setUser(data.user);
            } catch {
                if (controller.signal.aborted) return;

                setRestoreError(true);
                setUser(null)
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        }

        restoreAuthentication();

        return () => controller.abort();
    }, [])

    // re-fetch the current user, used by surfaces that offer a manual retry
    const refresh = useCallback(async () => {
        setIsLoading(true);
        setRestoreError(false);

        try {
            const data = await getCurrentUser();
            setUser(data.user);
        } catch {
            setRestoreError(true);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // update the authenticated user's own profile; the context stays the
    // single source of truth so every consumer sees the new data immediately
    const updateUser = useCallback(async (data) => {
        if (!user) {
            throw new Error("No authenticated user to update");
        }

        const response = await updateCurrentUser(user._id, data);

        const updatedUser = response.user ?? response;

        setUser((current) => ({ ...current, ...updatedUser }));

        return updatedUser;
    }, [user]);

    // clear the session when the API reports an unauthorized response
    useEffect(() => {
        const clearSession = () => {
            setIsLoading(false);
            setRestoreError(false);
            setUser(null);
        };

        window.addEventListener("auth:unauthorized", clearSession);

        return () => {
            window.removeEventListener("auth:unauthorized", clearSession);
        };
    }, [])

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated,
            isLoading,
            restoreError,
            refresh,
            updateUser,
            login,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;
