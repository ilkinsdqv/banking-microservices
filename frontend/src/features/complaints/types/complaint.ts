export type ComplaintStatus =
    | "OPEN"
    | "IN_PROGRESS"
    | "RESOLVED"
    | "CLOSED";

export type ComplaintPriority =
    | "LOW"
    | "MEDIUM"
    | "HIGH";

export interface Complaint {
    id: string;
    userId: string;
    subject: string;
    description: string;
    status: ComplaintStatus;
    priority: ComplaintPriority;
    adminResponse: string | null;
    resolvedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateComplaintRequest {
    subject: string;
    description: string;
    priority: ComplaintPriority;
}