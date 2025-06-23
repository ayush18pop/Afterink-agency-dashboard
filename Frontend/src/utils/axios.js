import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://afterink-agency-dashboard-backend.onrender.com";

const instance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

<<<<<<< HEAD
// Add request interceptor for debugging
instance.interceptors.request.use(
  (config) => {
    console.log("🚀 Request:", {
      method: config.method,
      url: config.url,
      data: config.data,
      withCredentials: config.withCredentials
    });
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
instance.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", {
      status: response.status,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error("❌ Response Error:", {
      status: error.response?.status,
      url: error.config?.url,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

=======
>>>>>>> f31bdbdb7522a6bab74947b24d753e28c25a804d
export default instance;
