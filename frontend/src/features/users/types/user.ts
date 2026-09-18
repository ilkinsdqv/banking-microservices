export type UserRole = "USER" | "ADMIN" | "INTERNAL_SERVICE";

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    fin: string;
    phoneNumber: string;
    birthDate: string;
    roles: UserRole[];
    emailVerified: boolean;
    accountLocked: boolean;
    enabled: boolean;
}

export interface UpdateUserRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

export interface UserPage {
    content: User[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}