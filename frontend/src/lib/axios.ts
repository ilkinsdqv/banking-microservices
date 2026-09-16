import axios, {
    type AxiosError,
    type InternalAxiosRequestConfig,
} from "axios";

import { env } from "../config/env";
import { accessTokenStore } from "../features/auth/api/access-token";
import { authApi } from "../features/auth/api/auth-api";
import { tokenStorage } from "../features/auth/api/token-storage";

export const apiClient = axios.create({
    baseURL: env.apiBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15_000,
});

let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const accessToken = accessTokenStore.get();

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        if (!originalRequest || error.response?.status !== 401) {
            return Promise.reject(error);
        }

        const refreshToken = tokenStorage.getRefreshToken();

        if (!refreshToken) {
            accessTokenStore.clear();
            return Promise.reject(error);
        }

        if (!refreshPromise) {
            refreshPromise = authApi
                .refresh({
                    refreshToken,
                })
                .then((response) => {
                    accessTokenStore.set(response.accessToken);
                    tokenStorage.setRefreshToken(response.refreshToken);

                    return response.accessToken;
                })
                .finally(() => {
                    refreshPromise = null;
                });
        }

        try {
            const newAccessToken = await refreshPromise;

            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            return apiClient(originalRequest);
        } catch (refreshError) {
            tokenStorage.clearRefreshToken();
            accessTokenStore.clear();

            return Promise.reject(refreshError);
        }
    },
);