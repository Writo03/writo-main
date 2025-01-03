import axios from "axios";
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  // baseURL : "https://writo-main-backend.onrender.com/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to dynamically set the token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



export default axiosInstance;
