import axios from "axios";

// Create Axios instance
const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        // Get token from localStorage or cookie
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle global errors (e.g. 401 Unauthorized)
        if (error.response?.status === 401) {
            // Redirect to login or refresh token logic
            if (typeof window !== "undefined") {
                // window.location.href = "/auth/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;
