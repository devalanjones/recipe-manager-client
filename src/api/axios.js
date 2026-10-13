import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle global auth errors (expired token, banned user)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Token expired, malformed, or missing -> log out user
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Optional: Redirect to login page if not already there
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    } else if (status === 403) {
      // Account deactivated by admin OR non-admin accessing admin route
      const message = error.response?.data?.message;
      if (message && message.includes("deactivated")) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/login?error=account_deactivated";
      }
    }

    return Promise.reject(error);
  }
);

export default api;