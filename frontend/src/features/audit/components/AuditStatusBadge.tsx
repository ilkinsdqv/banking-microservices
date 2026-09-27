import {
    CheckCircle2,
    XCircle,
} from "lucide-react";

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
            className={[
                "inline-flex items-center gap-1.5 rounded-full",
                "px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
                isSuccess
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-600/10"
                    : "bg-red-50 text-red-700 ring-red-600/10",
            ].join(" ")}
        >
            {isSuccess ? (
                <CheckCircle2 className="h-3.5 w-3.5" />
            ) : (
                <XCircle className="h-3.5 w-3.5" />
            )}

            {isSuccess ? "Success" : "Failed"}
        </span>
    );
}