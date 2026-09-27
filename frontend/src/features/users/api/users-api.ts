import { apiClient } from "../../../lib/axios";
import type {
    User,
    UserPage,
    UpdateUserRequest,
} from "../types/user";

export interface GetUsersParams {
    page?: number;
    size?: number;
    sort?: string;
}

export const usersApi = {
    async getAll(
        params: GetUsersParams = {},
    ): Promise<UserPage> {
        const response = await apiClient.get<UserPage>(
            "/api/v1/users",
            {
                params: {
                    page: params.page ?? 0,
                    size: params.size ?? 10,
                    sort: params.sort ?? "createdAt,desc",
                },
            },
        );

        return response.data;
    },

    async getById(id: string): Promise<User> {
        const response = await apiClient.get<User>(
            `/api/v1/users/${id}`,
        );

        return response.data;
    },

    async update(
        id: string,
        request: UpdateUserRequest,
    ): Promise<User> {
        const response = await apiClient.put<User>(
            `/api/v1/users/${id}`,
            request,
        );

        return response.data;
    },

    async delete(id: string): Promise<void> {
        await apiClient.delete(`/api/v1/users/${id}`);
    },

    async enable(id: string): Promise<void> {
        await apiClient.post(`/api/v1/users/${id}/enable`);
    },

    async disable(id: string): Promise<void> {
        await apiClient.post(`/api/v1/users/${id}/disable`);
    },

    async lock(id: string): Promise<void> {
        await apiClient.post(`/api/v1/users/${id}/lock`);
    },

    async unlock(id: string): Promise<void> {
        await apiClient.post(`/api/v1/users/${id}/unlock`);
    },
};