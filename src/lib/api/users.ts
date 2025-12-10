import api, { ApiResponse } from './index';

export interface User {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'user' | 'superadmin';
    avatar?: string;
    division_id?: string;
    division_name?: string;
}

// Get all users
export async function getUsers(): Promise<User[]> {
    const response = await api.get<ApiResponse<User[]>>('/users');

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to fetch users');
}

// Get user by ID
export async function getUser(id: string): Promise<User> {
    const response = await api.get<ApiResponse<User>>(`/users/${id}`);

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to fetch user');
}

// Update user
export async function updateUser(id: string, data: Partial<User>): Promise<User> {
    const response = await api.put<ApiResponse<User>>(`/users/${id}`, data);

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to update user');
}
