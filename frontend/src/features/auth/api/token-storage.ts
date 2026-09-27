const REFRESH_TOKEN_KEY = "banking.refreshToken";

export const tokenStorage = {
    getRefreshToken(): string | null {
        return sessionStorage.getItem(REFRESH_TOKEN_KEY);
    },

    setRefreshToken(refreshToken: string): void {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    },

    clearRefreshToken(): void {
        sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    },
};