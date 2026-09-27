export type AuditStatus = "SUCCESS" | "FAILED";

export type AuditAction =
    | "USER_LOGIN"
    | "USER_REGISTERED"
    | "USER_EMAIL_VERIFIED"
    | "ACCOUNT_CREATED"
    | "MONEY_DEPOSITED"
    | "MONEY_WITHDRAWN"
    | "MONEY_TRANSFERRED"
    | "LOAN_CREATED"
    | "LOAN_APPROVED"
    | "LOAN_REJECTED"
    | "LOAN_ACTIVATED"
    | "LOAN_PAYMENT"
    | "LOAN_CANCELLED"
    | "COMPLAINT_CREATED"
    | "COMPLAINT_STARTED"
    | "COMPLAINT_RESOLVED"
    | "COMPLAINT_CLOSED";

export interface AuditLog {
    id: string;
    userId: string;
    serviceName: string;
    action: AuditAction;
    entityType: string;
    entityId: string | null;
    description: string | null;
    status: AuditStatus;
    ipAddress: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface AuditLogPage {
    content: AuditLog[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    numberOfElements: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

export interface AuditLogFilterParams {
    page?: number;
    size?: number;
    userId?: string;
    action?: AuditAction;
    serviceName?: string;
    status?: AuditStatus;
}