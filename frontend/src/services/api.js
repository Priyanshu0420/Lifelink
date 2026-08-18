import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
});


// =====================================================
// REQUEST INTERCEPTOR
// Automatically attach JWT to protected API requests
// =====================================================

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


// =====================================================
// RESPONSE INTERCEPTOR
// Handle expired/invalid JWT
// =====================================================

api.interceptors.response.use(
  (response) => {
    return response;
  },

  (error) => {

    if (error.response?.status === 401) {

      localStorage.removeItem("jwt");
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      localStorage.removeItem("role");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export default api;