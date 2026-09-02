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

    // مهم جدًا عشان Axios يبعت ويستقبل Cookies
    withCredentials: true,
});

// Handle API errors
api.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {
        if (error.response?.status === 401) {
            if (!window.location.pathname.startsWith("/login")) {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;