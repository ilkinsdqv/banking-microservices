import { useState } from "react";
import { AuditLogList } from "../components/AuditLogList";
import { useAuditLogs } from "../hooks/use-audit-logs";
import type {
    AuditAction,
    AuditLogFilterParams,
    AuditStatus,
} from "../types/audit-log";

const AUDIT_ACTIONS: AuditAction[] = [
    "USER_LOGIN",
    "USER_REGISTERED",
    "USER_EMAIL_VERIFIED",
    "ACCOUNT_CREATED",
    "MONEY_DEPOSITED",
    "MONEY_WITHDRAWN",
    "MONEY_TRANSFERRED",
    "LOAN_CREATED",
    "LOAN_APPROVED",
    "LOAN_REJECTED",
    "LOAN_ACTIVATED",
    "LOAN_PAYMENT",
    "LOAN_CANCELLED",
    "COMPLAINT_CREATED",
    "COMPLAINT_STARTED",
    "COMPLAINT_RESOLVED",
    "COMPLAINT_CLOSED",
];

const SERVICES = [
    "auth-service",
    "user-service",
    "account-service",
    "transaction-service",
    "loan-service",
    "complaint-service",
    "notification-service",
];

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

export function AdminAuditPage() {
    const [page, setPage] = useState(0);
    const pageSize = 20;

    const [userId, setUserId] = useState("");
    const [serviceName, setServiceName] = useState("");
    const [action, setAction] = useState<AuditAction | "">("");
    const [status, setStatus] = useState<AuditStatus | "">("");

    const filters: AuditLogFilterParams = {
        page,
        size: pageSize,
        ...(userId.trim()
            ? { userId: userId.trim() }
            : {}),
        ...(serviceName
            ? { serviceName }
            : {}),
        ...(action
            ? { action }
            : {}),
        ...(status
            ? { status }
            : {}),
    };

    const {
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useAuditLogs(filters);

    const statsFilters: AuditLogFilterParams = {
        page: 0,
        size: 1,
        ...(userId.trim()
            ? { userId: userId.trim() }
            : {}),
        ...(serviceName
            ? { serviceName }
            : {}),
        ...(action
            ? { action }
            : {}),
    };

    const {
        data: successfulLogs,
    } = useAuditLogs({
        ...statsFilters,
        status: "SUCCESS",
    });

    const {
        data: failedLogs,
    } = useAuditLogs({
        ...statsFilters,
        status: "FAILED",
    });

    const logs = data?.content ?? [];

    const hasFilters =
        Boolean(userId.trim()) ||
        Boolean(serviceName) ||
        Boolean(action) ||
        Boolean(status);

    const resetFilters = () => {
        setUserId("");
        setServiceName("");
        setAction("");
        setStatus("");
        setPage(0);
    };

    const handleUserIdChange = (value: string) => {
        setUserId(value);
        setPage(0);
    };

    const handleServiceChange = (value: string) => {
        setServiceName(value);
        setPage(0);
    };

    const handleActionChange = (
        value: AuditAction | "",
    ) => {
        setAction(value);
        setPage(0);
    };

    const handleStatusChange = (
        value: AuditStatus | "",
    ) => {
        setStatus(value);
        setPage(0);
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Audit Logs
                    </h1>

                    <p className="text-muted-foreground">
                        Monitor system activities and business
                        operations.
                    </p>
                </div>

                <div className="rounded-lg border p-8 text-center">
                    Loading audit logs...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Audit Logs
                    </h1>

                    <p className="text-muted-foreground">
                        Monitor system activities and business
                        operations.
                    </p>
                </div>

                <div className="rounded-lg border p-8 text-center">
                    <p className="text-destructive">
                        Failed to load audit logs.
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-4 rounded-md border px-4 py-2 text-sm"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Audit Logs
                </h1>

                <p className="text-muted-foreground">
                    Monitor system activities and business
                    operations.
                </p>
            </div>

            <div className="rounded-lg border bg-card p-4">
                <div className="mb-4">
                    <h2 className="font-semibold">
                        Filters
                    </h2>

                    <p className="text-sm text-muted-foreground">
                        Filter audit records by user, service,
                        action or status.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="audit-user-id"
                            className="text-sm font-medium"
                        >
                            User ID
                        </label>

                        <input
                            id="audit-user-id"
                            type="text"
                            value={userId}
                            onChange={(event) =>
                                handleUserIdChange(
                                    event.target.value,
                                )
                            }
                            placeholder="Enter user UUID"
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="audit-service"
                            className="text-sm font-medium"
                        >
                            Service
                        </label>

                        <select
                            id="audit-service"
                            value={serviceName}
                            onChange={(event) =>
                                handleServiceChange(
                                    event.target.value,
                                )
                            }
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">
                                All services
                            </option>

                            {SERVICES.map((service) => (
                                <option
                                    key={service}
                                    value={service}
                                >
                                    {service}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="audit-action"
                            className="text-sm font-medium"
                        >
                            Action
                        </label>

                        <select
                            id="audit-action"
                            value={action}
                            onChange={(event) =>
                                handleActionChange(
                                    event.target.value as
                                        | AuditAction
                                        | "",
                                )
                            }
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">
                                All actions
                            </option>

                            {AUDIT_ACTIONS.map(
                                (auditAction) => (
                                    <option
                                        key={auditAction}
                                        value={auditAction}
                                    >
                                        {formatAction(
                                            auditAction,
                                        )}
                                    </option>
                                ),
                            )}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label
                            htmlFor="audit-status"
                            className="text-sm font-medium"
                        >
                            Status
                        </label>

                        <select
                            id="audit-status"
                            value={status}
                            onChange={(event) =>
                                handleStatusChange(
                                    event.target.value as
                                        | AuditStatus
                                        | "",
                                )
                            }
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                            <option value="">
                                All statuses
                            </option>

                            <option value="SUCCESS">
                                Success
                            </option>

                            <option value="FAILED">
                                Failed
                            </option>
                        </select>
                    </div>
                </div>

                {hasFilters && (
                    <div className="mt-4 flex justify-end">
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                        >
                            Reset filters
                        </button>
                    </div>
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        Total Logs
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                        {data?.totalElements ?? 0}
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        Successful
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                        {successfulLogs?.totalElements ?? 0}
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        Failed
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                        {failedLogs?.totalElements ?? 0}
                    </p>
                </div>
            </div>

            {isFetching && (
                <div className="text-sm text-muted-foreground">
                    Updating audit logs...
                </div>
            )}

            <AuditLogList logs={logs} />

            {data && data.totalPages > 0 && (
                <div className="flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm text-muted-foreground">
                        Page {data.number + 1} of{" "}
                        {data.totalPages}
                    </div>

                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={
                                data.first || isFetching
                            }
                            onClick={() =>
                                setPage((currentPage) =>
                                    Math.max(
                                        currentPage - 1,
                                        0,
                                    ),
                                )
                            }
                            className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Previous
                        </button>

                        <button
                            type="button"
                            disabled={
                                data.last || isFetching
                            }
                            onClick={() =>
                                setPage(
                                    (currentPage) =>
                                        currentPage + 1,
                                )
                            }
                            className="rounded-md border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}