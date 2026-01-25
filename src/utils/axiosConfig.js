import axios from "axios";

const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add JWT token from localStorage
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(
        "🔑 JWT Token attached to request:",
        token?.substring(0, 30) + "...",
      );
    } else {
      console.warn("⚠️ No JWT token found in localStorage");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized request - token may be invalid or missing");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
