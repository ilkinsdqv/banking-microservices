export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    fin: string;
    phoneNumber: string;
    birthDate: string;
}

export interface RefreshTokenRequest {
    refreshToken: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
}

export interface JwtPayload {
    sub: string;
    roles?: string[];
    iat?: number;
    exp?: number;
}

export interface AuthUser {
    id: string;
    roles: string[];
}

export interface AuthState {
    user: AuthUser | null;
    accessToken: string | null;
    isAuthenticated: boolean;
    isInitializing: boolean;
}