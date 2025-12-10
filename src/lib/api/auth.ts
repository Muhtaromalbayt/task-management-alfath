import api, { ApiResponse } from './index';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user' | 'superadmin';
    avatar?: string;
    division_id?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    name: string;
}

export interface AuthResponse {
    user: User;
    token: string;
}

// Login
export async function login(data: LoginRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);

    if (response.data.success && response.data.data) {
        // Store token
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.data.data.token);
        }
        return response.data.data;
    }

    throw new Error(response.data.error || 'Login failed');
}

// Register
export async function register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);

    if (response.data.success && response.data.data) {
        // Store token
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.data.data.token);
        }
        return response.data.data;
    }

    throw new Error(response.data.error || 'Registration failed');
}

// Get current user
export async function getCurrentUser(): Promise<User> {
    const response = await api.get<ApiResponse<User>>('/auth/me');

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to get user');
}

// Logout (client-side only)
export function logout(): void {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
    }
}
