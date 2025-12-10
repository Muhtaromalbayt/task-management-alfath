import api, { ApiResponse } from './index';

export interface Division {
    id: string;
    name: string;
    description?: string;
    color: string;
    member_count?: number;
}

export interface DivisionWithMembers extends Division {
    members: {
        id: string;
        name: string;
        email: string;
        role: string;
        avatar?: string;
    }[];
}

// Get all divisions
export async function getDivisions(): Promise<Division[]> {
    const response = await api.get<ApiResponse<Division[]>>('/divisions');

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to fetch divisions');
}

// Get division with members
export async function getDivision(id: string): Promise<DivisionWithMembers> {
    const response = await api.get<ApiResponse<DivisionWithMembers>>(`/divisions/${id}`);

    if (response.data.success && response.data.data) {
        return response.data.data;
    }

    throw new Error(response.data.error || 'Failed to fetch division');
}
