import api, { ApiResponse } from './index';

export interface Project {
    id: string;
    title: string;
    description?: string;
    status: 'Planning' | 'In Progress' | 'Completed' | 'On Hold';
    due_date?: string;
    progress: number;
    created_by?: string;
    created_by_name?: string;
    member_count?: number;
    created_at?: string;
}

export interface ProjectWithDetails extends Project {
    columns: Column[];
    tasks: Task[];
    members: ProjectMember[];
}

export interface Column {
    id: string;
    title: string;
    order: number;
    project_id: string;
}

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

export interface ProjectMember {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'owner' | 'admin' | 'member';
}

export interface CreateProjectRequest {
    title: string;
    description?: string;
    due_date?: string;
}

// Get all projects
export async function getProjects(): Promise<Project[]> {
    const response = await api.get<ApiResponse<Project[]>>('/projects');

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to fetch projects');
}

// Get project with details
export async function getProject(id: string): Promise<ProjectWithDetails> {
    const response = await api.get<ApiResponse<ProjectWithDetails>>(`/projects/${id}`);

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to fetch project');
}

// Create project
export async function createProject(data: CreateProjectRequest): Promise<Project> {
    const response = await api.post<ApiResponse<Project>>('/projects', data);

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to create project');
}

// Update project
export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await api.put<ApiResponse<Project>>(`/projects/${id}`, data);

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to update project');
}

// Delete project
export async function deleteProject(id: string): Promise<void> {
    const response = await api.delete<ApiResponse<null>>(`/projects/${id}`);

    if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to delete project');
    }
}
