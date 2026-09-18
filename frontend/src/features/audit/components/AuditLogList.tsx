import { useNavigate } from "react-router";

import { AuditStatusBadge } from "./AuditStatusBadge";
import type { AuditLog } from "../types/audit-log";

interface AuditLogListProps {
    logs: AuditLog[];
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}

function formatAction(action: string) {
    return action
        .toLowerCase()
        .split("_")
        .map(
            (word) =>
                word.charAt(0).toUpperCase() + word.slice(1),
        )
        .join(" ");
}

function truncateId(value: string | null, length = 12) {
    if (!value) {
        return "—";
    }

    if (value.length <= length) {
        return value;
    }

    return `${value.slice(0, length)}...`;
}

export function AuditLogList({
                                 logs,
                             }: AuditLogListProps) {
    const navigate = useNavigate();

    if (logs.length === 0) {
        return (
            <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">
                    No audit logs found.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full min-w-[1000px] text-sm">
                <thead>
                <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">
                        Date
                    </th>

                    <th className="px-4 py-3 text-left font-medium">
                        Service
                    </th>

                    <th className="px-4 py-3 text-left font-medium">
                        Action
                    </th>

                    <th className="px-4 py-3 text-left font-medium">
                        Entity
                    </th>

                    <th className="px-4 py-3 text-left font-medium">
                        Status
                    </th>

                    <th className="px-4 py-3 text-left font-medium">
                        User ID
                    </th>

                    <th className="px-4 py-3 text-right font-medium">
                        Details
                    </th>
                </tr>
                </thead>

                <tbody>
                {logs.map((log) => (
                    <tr
                        key={log.id}
                        className="border-b last:border-0 hover:bg-muted/50"
                    >
                        <td className="whitespace-nowrap px-4 py-3">
                            {formatDate(log.createdAt)}
                        </td>

                        <td className="px-4 py-3">
                                <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium">
                                    {log.serviceName}
                                </span>
                        </td>

                        <td className="px-4 py-3">
                            <div className="font-medium">
                                {formatAction(log.action)}
                            </div>

                            {log.description && (
                                <div
                                    className="mt-1 max-w-[240px] truncate text-xs text-muted-foreground"
                                    title={log.description}
                                >
                                    {log.description}
                                </div>
                            )}
                        </td>

                        <td className="px-4 py-3">
                            <div className="font-medium">
                                {log.entityType || "—"}
                            </div>

                            {log.entityId && (
                                <div
                                    className="mt-1 font-mono text-xs text-muted-foreground"
                                    title={log.entityId}
                                >
                                    {truncateId(log.entityId)}
                                </div>
                            )}
                        </td>

                        <td className="px-4 py-3">
                            <AuditStatusBadge
                                status={log.status}
                            />
                        </td>

                        <td className="px-4 py-3">
                                <span
                                    className="font-mono text-xs"
                                    title={log.userId}
                                >
                                    {truncateId(log.userId, 16)}
                                </span>
                        </td>

                        <td className="px-4 py-3 text-right">
                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/admin/audit/${log.id}`,
                                    )
                                }
                                className="rounded-md border px-3 py-1.5 text-xs font-medium hover:bg-muted"
                            >
                                View
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}