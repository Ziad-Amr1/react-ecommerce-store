import axios from "axios";

const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    "https://e-commerce-api-3wara.vercel.app";

const api = axios.create({
    baseURL: import.meta.env.PROD ? "/api" : API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Add token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle API errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");

            if (!window.location.pathname.startsWith("/login")) {
                window.history.replaceState(null, "", "/login");
            }
        }

        return Promise.reject(error);
    }
);

export default api;