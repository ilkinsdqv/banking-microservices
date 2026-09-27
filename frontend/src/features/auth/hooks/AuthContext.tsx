import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";

import { authApi } from "../api/auth-api";
import { decodeAccessToken } from "../api/jwt";
import { accessTokenStore } from "../api/access-token";
import { tokenStorage } from "../api/token-storage";
import { AuthContext } from "./auth-context";
import type { AuthState, LoginRequest } from "../types/auth";

export function AuthProvider({ children }: PropsWithChildren) {
    const [state, setState] = useState<AuthState>({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isInitializing: true,
    });

    const setAccessToken = useCallback((accessToken: string) => {
        const user = decodeAccessToken(accessToken);

        accessTokenStore.set(accessToken);

        setState({
            user,
            accessToken,
            isAuthenticated: true,
            isInitializing: false,
        });
    }, []);

    const login = useCallback(async (request: LoginRequest) => {
        const response = await authApi.login(request);

        tokenStorage.setRefreshToken(response.refreshToken);
        accessTokenStore.set(response.accessToken);

        const user = decodeAccessToken(response.accessToken);

        setState({
            user,
            accessToken: response.accessToken,
            isAuthenticated: true,
            isInitializing: false,
        });
    }, []);

    const logout = useCallback(async () => {
        const refreshToken = tokenStorage.getRefreshToken();

        try {
            if (refreshToken) {
                await authApi.logout({ refreshToken });
            }
        } finally {
            tokenStorage.clearRefreshToken();
            accessTokenStore.clear();

            setState({
                user: null,
                accessToken: null,
                isAuthenticated: false,
                isInitializing: false,
            });
        }
    }, []);

    useEffect(() => {
        const restoreSession = async () => {
            const refreshToken = tokenStorage.getRefreshToken();

            if (!refreshToken) {
                setState((current) => ({
                    ...current,
                    isInitializing: false,
                }));
                return;
            }

            try {
                const response = await authApi.refresh({
                    refreshToken,
                });

                tokenStorage.setRefreshToken(response.refreshToken);
                accessTokenStore.set(response.accessToken);

                const user = decodeAccessToken(response.accessToken);

                setState({
                    user,
                    accessToken: response.accessToken,
                    isAuthenticated: true,
                    isInitializing: false,
                });
            } catch {
                tokenStorage.clearRefreshToken();
                accessTokenStore.clear();

                setState({
                    user: null,
                    accessToken: null,
                    isAuthenticated: false,
                    isInitializing: false,
                });
            }
        };

        void restoreSession();
    }, []);

    const value = useMemo(
        () => ({
            ...state,
            login,
            logout,
            setAccessToken,
        }),
        [state, login, logout, setAccessToken],
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}