import { apiClient } from "../../../lib/axios";

import type {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
} from "../types/auth";

export const authApi = {
    login: async (request: LoginRequest): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>(
            "/api/v1/auth/login",
            request,
        );

        return response.data;
    },

    refresh: async (
        request: RefreshTokenRequest,
    ): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>(
            "/api/v1/auth/refresh",
            request,
        );

        return response.data;
    },

    logout: async (request: RefreshTokenRequest): Promise<void> => {
        await apiClient.post("/api/v1/auth/logout", request);
    },
};