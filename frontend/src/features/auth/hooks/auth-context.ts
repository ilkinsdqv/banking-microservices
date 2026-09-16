import { createContext } from "react";

import type { AuthState, LoginRequest } from "../types/auth";

export interface AuthContextValue extends AuthState {
    login: (request: LoginRequest) => Promise<void>;
    logout: () => Promise<void>;
    setAccessToken: (accessToken: string) => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
    undefined,
);