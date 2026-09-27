import type {
    ComplaintPriority,
    ComplaintStatus,
} from "../types/complaint";

export function getComplaintStatusLabel(
    status: ComplaintStatus,
): string {
    switch (status) {
        case "OPEN":
            return "Open";
        case "IN_PROGRESS":
            return "In progress";
        case "RESOLVED":
            return "Resolved";
        case "CLOSED":
            return "Closed";
        default:
            return status;
    }
}

export function getComplaintStatusClass(
    status: ComplaintStatus,
): string {
    switch (status) {
        case "OPEN":
            return "bg-blue-100 text-blue-700";

        case "IN_PROGRESS":
            return "bg-yellow-100 text-yellow-700";

        case "RESOLVED":
            return "bg-green-100 text-green-700";

        case "CLOSED":
            return "bg-gray-100 text-gray-700";

        default:
            return "bg-muted text-muted-foreground";
    }
}

export function getComplaintPriorityLabel(
    priority: ComplaintPriority,
): string {
    switch (priority) {
        case "LOW":
            return "Low";

        case "MEDIUM":
            return "Medium";

        case "HIGH":
            return "High";

        default:
            return priority;
    }
}

export function getComplaintPriorityClass(
    priority: ComplaintPriority,
): string {
    switch (priority) {
        case "LOW":
            return "bg-green-100 text-green-700";

        case "MEDIUM":
            return "bg-yellow-100 text-yellow-700";

        case "HIGH":
            return "bg-red-100 text-red-700";

        default:
            return "bg-muted text-muted-foreground";
    }
}