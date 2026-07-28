import axios from "axios";

const apiInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://192.168.1.95:8000/",
  headers: {
    "Content-Type": "application/json",
  },
});

apiInstance.interceptors.request.use((config: any) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const isAuthRoute =
    config.url?.includes("Auth/login") ||
    config.url?.includes("Auth/register") ||
    config.url?.includes("Home/");

  if (token && !isAuthRoute) {
    if (config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

export default apiInstance;
