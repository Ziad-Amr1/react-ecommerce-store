import axios from "axios";

// Default fallback API URL (backend host root)
const DEFAULT_API_URL = "https://e-commerce-api-3wara.vercel.app";

const getBaseURL = () => {
  // Cross-origin override for static deployments that have no server-side proxy (e.g. GitHub Pages)
  if (import.meta.env.VITE_API_PROXY_URL) {
    return import.meta.env.VITE_API_PROXY_URL;
  }
  // In production (Vercel deployment), use '/api' to leverage Vercel's rewrite proxy
  if (import.meta.env.PROD) {
    return "/api";
  }
  // Allow overriding via environment variable VITE_API_URL if set
  return import.meta.env.VITE_API_URL || DEFAULT_API_URL;
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);

export default api;
