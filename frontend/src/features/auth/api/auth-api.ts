import axios from "axios";

import { apiClient } from "../../../lib/axios";
import { env } from "../../../config/env";

import type {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
} from "../types/auth";

const authClient = axios.create({
    baseURL: env.apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15_000,
});

export const authApi = {
    login: async (request: LoginRequest): Promise<LoginResponse> => {
        const response = await authClient.post<LoginResponse>(
            "/api/v1/auth/login",
            request,
        );

        return response.data;
    },

    refresh: async (
        request: RefreshTokenRequest,
    ): Promise<LoginResponse> => {
        const response = await authClient.post<LoginResponse>(
            "/api/v1/auth/refresh",
            request,
        );

        return response.data;
    },

    logout: async (request: RefreshTokenRequest): Promise<void> => {
        await authClient.post("/api/v1/auth/logout", request);
    },

    request: apiClient,
};