import { apiClient } from "../../../lib/axios";
import type {
    Complaint,
    CreateComplaintRequest,
} from "../types/complaint";

export const complaintsApi = {
    async create(request: CreateComplaintRequest): Promise<Complaint> {
        const response = await apiClient.post<Complaint>(
            "/api/v1/complaints",
            request,
        );

        return response.data;
    },

    async getMyComplaints(): Promise<Complaint[]> {
        const response = await apiClient.get<Complaint[]>(
            "/api/v1/complaints/my",
        );

        return response.data;
    },

    async getById(id: string): Promise<Complaint> {
        const response = await apiClient.get<Complaint>(
            `/api/v1/complaints/${id}`,
        );

        return response.data;
    },
};