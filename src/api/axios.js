import axios from "axios";

// بيقرأ الرابط من ملف الـ .env، ولو مش موجود بيستعيض برابط افتراضي
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://e-commerce-api-3wara.vercel.app";

const api = axios.create({
  baseURL: import.meta.env.PROD ? "/api" : API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // optional chaining
    if (error.response?.status === 401) {
      // Notify the AuthProvider so it clears the session; the
      // ProtectedRoute then navigates to /login via React Router.
      window.dispatchEvent(new Event("auth:unauthorized")); // بيبلغ ال authProvider بالمشكله
    }
    return Promise.reject(error); //pass error to catch.
  },
);

export default api;
