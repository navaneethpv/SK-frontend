import axios from "axios";

const apiInstance = axios.create({
  // baseURL: "http://192.168.1.49:8000/",
  baseURL: "https://erpbackend.exouzia.com/",
  // baseURL: "https://pyerp.parrotgreen.in/",
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
