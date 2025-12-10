import api from "@/lib/axios";

// Auth API
export const authService = {
    login: async (credentials: any) => {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },
    register: async (data: any) => {
        const response = await api.post("/auth/register", data);
        return response.data;
    },
    logout: async () => {
        const response = await api.post("/auth/logout");
        return response.data;
    },
    me: async () => {
        const response = await api.get("/auth/me");
        return response.data;
    }
};

// Projects API
export const projectService = {
    getAll: async () => {
        const response = await api.get("/projects");
        return response.data;
    },
    getById: async (id: string) => {
        const response = await api.get(`/projects/${id}`);
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post("/projects", data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put(`/projects/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/projects/${id}`);
        return response.data;
    }
};

// Tasks API
export const taskService = {
    getAll: async (params?: any) => {
        const response = await api.get("/tasks", { params });
        return response.data;
    },
    create: async (data: any) => {
        const response = await api.post("/tasks", data);
        return response.data;
    },
    update: async (id: string, data: any) => {
        const response = await api.put(`/tasks/${id}`, data);
        return response.data;
    },
    delete: async (id: string) => {
        const response = await api.delete(`/tasks/${id}`);
        return response.data;
    }
};
