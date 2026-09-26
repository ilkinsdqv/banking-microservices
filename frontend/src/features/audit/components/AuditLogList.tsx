import {
    ChevronRight,
    FileSearch,
    Server,
} from "lucide-react";
import { useNavigate } from "react-router";

import type { AuditLog } from "../types/audit-log";
import { AuditStatusBadge } from "./AuditStatusBadge";

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
                word.charAt(0).toUpperCase() +
                word.slice(1),
        )
        .join(" ");
}

function truncateId(
    value: string | null,
    length = 12,
) {
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
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <FileSearch className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-950">
                    No audit logs found
                </h3>

                <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                    No audit records match the current filters.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Date
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Service
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Action
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Entity
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Status
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            User
                        </th>

                        <th className="w-10 px-4 py-3.5" />
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {logs.map((log) => (
                        <tr
                            key={log.id}
                            className="group transition-colors hover:bg-slate-50/80"
                        >
                            <td className="whitespace-nowrap px-6 py-4 text-xs text-slate-500">
                                {formatDate(log.createdAt)}
                            </td>

                            <td className="px-4 py-4">
                                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                                        <Server className="h-3 w-3" />
                                        {log.serviceName}
                                    </span>
                            </td>

                            <td className="px-4 py-4">
                                <div className="font-semibold text-slate-900">
                                    {formatAction(log.action)}
                                </div>

                                {log.description && (
                                    <div
                                        className="mt-1 max-w-[280px] truncate text-xs text-slate-500"
                                        title={log.description}
                                    >
                                        {log.description}
                                    </div>
                                )}
                            </td>

                            <td className="px-4 py-4">
                                <p className="font-medium text-slate-800">
                                    {log.entityType || "—"}
                                </p>

                                {log.entityId && (
                                    <p
                                        className="mt-1 font-mono text-xs text-slate-400"
                                        title={log.entityId}
                                    >
                                        {truncateId(
                                            log.entityId,
                                        )}
                                    </p>
                                )}
                            </td>

                            <td className="px-4 py-4">
                                <AuditStatusBadge
                                    status={log.status}
                                />
                            </td>

                            <td className="px-4 py-4">
                                    <span
                                        className="font-mono text-xs text-slate-500"
                                        title={log.userId}
                                    >
                                        {truncateId(
                                            log.userId,
                                            16,
                                        )}
                                    </span>
                            </td>

                            <td className="px-4 py-4">
                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            `/admin/audit/${log.id}`,
                                        )
                                    }
                                    aria-label="View audit log"
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-900"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
                {logs.map((log) => (
                    <button
                        key={log.id}
                        type="button"
                        onClick={() =>
                            navigate(
                                `/admin/audit/${log.id}`,
                            )
                        }
                        className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-slate-50"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <FileSearch className="h-4 w-4" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-950">
                                        {formatAction(
                                            log.action,
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {log.serviceName}
                                    </p>
                                </div>

                                <AuditStatusBadge
                                    status={log.status}
                                />
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                                <span>
                                    {log.entityType || "—"}
                                </span>

                                <span className="text-slate-300">
                                    •
                                </span>

                                <span>
                                    {formatDate(
                                        log.createdAt,
                                    )}
                                </span>
                            </div>

                            {log.description && (
                                <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                                    {log.description}
                                </p>
                            )}
                        </div>

                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300" />
                    </button>
                ))}
            </div>
        </>
    );
}