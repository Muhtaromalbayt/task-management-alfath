import api, { ApiResponse } from './index';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'assignment' | 'mention' | 'deadline' | 'system';
    read: boolean;
    user_id: string;
    created_at?: string;
}

// Get all notifications
export async function getNotifications(): Promise<Notification[]> {
    const response = await api.get<ApiResponse<Notification[]>>('/notifications');

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to fetch notifications');
}

// Mark notification as read
export async function markAsRead(id: string): Promise<void> {
    const response = await api.patch<ApiResponse<null>>(`/notifications/${id}/read`);

    if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to mark notification as read');
    }
}

// Mark all notifications as read
export async function markAllAsRead(): Promise<void> {
    const response = await api.patch<ApiResponse<null>>('/notifications/read-all');

    if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to mark all notifications as read');
    }
}
