// Type definitions for the backend

export interface Env {
    DB: D1Database;
    JWT_SECRET: string;
}

export interface User {
    id: string;
    email: string;
    password?: string;
    name: string;
    role: 'admin' | 'user' | 'superadmin';
    avatar?: string;
    division_id?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Division {
    id: string;
    name: string;
    description?: string;
    color: string;
    created_at?: string;
}

export interface Project {
    id: string;
    title: string;
    description?: string;
    status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
    due_date?: string;
    progress: number;
    created_by?: string;
    created_at?: string;
    updated_at?: string;
}

export interface Column {
    id: string;
    title: string;
    order: number;
    project_id: string;
    created_at?: string;
}

export interface Task {
    id: string;
    content: string;
    priority: 'Low' | 'Medium' | 'High';
    column_id: string;
    assignee_id?: string;
    start_date?: string;
    due_date?: string;
    order: number;
    created_at?: string;
    updated_at?: string;
}

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'assignment' | 'mention' | 'deadline' | 'system';
    read: boolean;
    user_id: string;
    created_at?: string;
}

export interface ProjectMember {
    project_id: string;
    user_id: string;
    role: 'owner' | 'admin' | 'member';
    joined_at?: string;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// JWT Payload
export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
    exp: number;
}
