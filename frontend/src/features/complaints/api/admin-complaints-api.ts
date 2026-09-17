import { apiClient } from "../../../lib/axios";
import type {
    Complaint,
    ComplaintStatus,
} from "../types/complaint";

export interface ResolveComplaintRequest {
    adminResponse: string;
}

export const adminComplaintsApi = {
    async getAll(): Promise<Complaint[]> {
        const response = await apiClient.get<Complaint[]>(
            "/api/v1/complaints",
        );

        return response.data;
    },

    async getByStatus(
        status: ComplaintStatus,
    ): Promise<Complaint[]> {
        const response = await apiClient.get<Complaint[]>(
            `/api/v1/complaints/status/${status}`,
        );

        return response.data;
    },

    async start(id: string): Promise<Complaint> {
        const response = await apiClient.post<Complaint>(
            `/api/v1/complaints/${id}/start`,
        );

        return response.data;
    },

    async resolve(
        id: string,
        request: ResolveComplaintRequest,
    ): Promise<Complaint> {
        const response = await apiClient.post<Complaint>(
            `/api/v1/complaints/${id}/resolve`,
            request,
        );

        return response.data;
    },

    async close(id: string): Promise<Complaint> {
        const response = await apiClient.post<Complaint>(
            `/api/v1/complaints/${id}/close`,
        );

        return response.data;
    },
};