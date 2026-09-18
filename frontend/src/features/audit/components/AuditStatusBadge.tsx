import type { AuditStatus } from "../types/audit-log";

interface AuditStatusBadgeProps {
    status: AuditStatus;
}

export function AuditStatusBadge({
                                     status,
                                 }: AuditStatusBadgeProps) {
    const isSuccess = status === "SUCCESS";

    return (
        <span
            className={
                isSuccess
                    ? "inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                    : "inline-flex items-center rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
            }
        >
            {isSuccess ? "Success" : "Failed"}
        </span>
    );
}