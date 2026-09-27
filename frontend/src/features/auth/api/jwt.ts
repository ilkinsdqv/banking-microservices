import { jwtDecode } from "jwt-decode";

import type { AuthUser, JwtPayload } from "../types/auth";

export function decodeAccessToken(accessToken: string): AuthUser {
    const payload = jwtDecode<JwtPayload>(accessToken);

    return {
        id: payload.sub,
        roles: payload.roles ?? [],
    };
}

export function isAccessTokenExpired(accessToken: string): boolean {
    const payload = jwtDecode<JwtPayload>(accessToken);

    if (!payload.exp) {
        return true;
    }

    return payload.exp * 1000 <= Date.now();
}