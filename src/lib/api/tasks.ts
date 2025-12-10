import api, { ApiResponse } from './index';

export interface Task {
    id: string;
    content: string;
    priority: 'Low' | 'Medium' | 'High';
    column_id: string;
    assignee_id?: string;
    assignee_name?: string;
    due_date?: string;
    order: number;
}

export interface CreateTaskRequest {
    content: string;
    priority?: 'Low' | 'Medium' | 'High';
    column_id: string;
    assignee_id?: string;
    due_date?: string;
}

export interface UpdateTaskRequest {
    content?: string;
    priority?: 'Low' | 'Medium' | 'High';
    assignee_id?: string;
    due_date?: string;
}

export interface MoveTaskRequest {
    column_id?: string;
    order?: number;
}

// Get all tasks (optional filter by column)
export async function getTasks(columnId?: string): Promise<Task[]> {
    const params = columnId ? `?column_id=${columnId}` : '';
    const response = await api.get<ApiResponse<Task[]>>(`/tasks${params}`);

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to fetch tasks');
}

// Get task by ID
export async function getTask(id: string): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to fetch task');
}

// Create task
export async function createTask(data: CreateTaskRequest): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>('/tasks', data);

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to create task');
}

// Update task
export async function updateTask(id: string, data: UpdateTaskRequest): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, data);

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to update task');
}

// Move task (change column or reorder)
export async function moveTask(id: string, data: MoveTaskRequest): Promise<Task> {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/move`, data);

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to move task');
}

// Delete task
export async function deleteTask(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<null>>(`/tasks/${id}`);

    if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete task');
    }
}
