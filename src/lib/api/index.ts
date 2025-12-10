import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// API Base URL - Cloudflare Workers
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://task-management-api.muchtarrasyid19.workers.dev';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Request interceptor - add auth token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage (client-side only)
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - handle errors
api.interceptors.response.use(
    (response) => response,
    (error: AxiosError<{ error?: string; message?: string }>) => {
        if (error.response) {
            const { status, data } = error.response;

            // Handle 401 Unauthorized
            if (status === 401) {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token');
                    // Optionally redirect to login
                    // window.location.href = '/auth/login';
                }
            }

            // Extract error message
            const message = data?.error || data?.message || 'Something went wrong';
            return Promise.reject(new Error(message));
        }

        return Promise.reject(error);
    }
);

export default api;

// Types for API responses
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}
