import {
    Activity,
    AlertCircle,
    CheckCircle2,
    Filter,
    FileSearch,
    RotateCcw,
} from "lucide-react";
import { useState } from "react";

import {
    Card,
    Pagination,
    Skeleton,
} from "../../../components/ui";
import { ErrorState } from "../../../components/ui/ErrorState";
import { Input } from "../../../components/ui/Input";
import { Select } from "../../../components/ui/Select";

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
                word.charAt(0).toUpperCase() +
                word.slice(1),
        )
        .join(" ");
}

export function AdminAuditPage() {
    const [page, setPage] = useState(0);
    const pageSize = 20;

    const [userId, setUserId] = useState("");
    const [serviceName, setServiceName] = useState("");
    const [action, setAction] = useState<
        AuditAction | ""
    >("");
    const [status, setStatus] = useState<
        AuditStatus | ""
    >("");

    const filters: AuditLogFilterParams = {
        page,
        size: pageSize,
        ...(userId.trim()
            ? { userId: userId.trim() }
            : {}),
        ...(serviceName ? { serviceName } : {}),
        ...(action ? { action } : {}),
        ...(status ? { status } : {}),
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
        ...(serviceName ? { serviceName } : {}),
        ...(action ? { action } : {}),
    };

    const { data: successfulLogs } =
        useAuditLogs({
            ...statsFilters,
            status: "SUCCESS",
        });

    const { data: failedLogs } =
        useAuditLogs({
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
            <div className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-4 w-96" />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} className="p-5">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="mt-5 h-4 w-28" />
                            <Skeleton className="mt-2 h-8 w-20" />
                        </Card>
                    ))}
                </div>

                <Card className="p-6">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="mt-2 h-4 w-72" />

                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-10 w-full"
                            />
                        ))}
                    </div>
                </Card>

                <Card className="overflow-hidden">
                    <div className="space-y-4 p-6">
                        {Array.from({ length: 7 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-12 w-full"
                            />
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-8">
                <div>
                    <p className="text-sm font-medium text-indigo-600">
                        Administration
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
                        Audit Logs
                    </h1>
                </div>

                <ErrorState
                    title="Unable to load audit logs"
                    description="Something went wrong while loading system audit records."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-100/70 blur-3xl" />

                <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-indigo-600">
                            <Activity className="h-4 w-4" />
                            System monitoring
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                            Audit Logs
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Monitor system activities and business
                            operations across banking services.
                        </p>
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                        <FileSearch className="h-6 w-6" />
                    </div>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
                <Card className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total Logs
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {data?.totalElements ?? 0}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Activity className="h-5 w-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Successful
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {successfulLogs?.totalElements ?? 0}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Failed
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {failedLogs?.totalElements ?? 0}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                    </div>
                </Card>
            </section>

            <Card className="overflow-hidden">
                <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <Filter className="h-4 w-4 text-slate-500" />

                                <h2 className="text-base font-semibold text-slate-950">
                                    Filters
                                </h2>
                            </div>

                            <p className="mt-1 text-sm text-slate-500">
                                Filter audit records by user, service,
                                action or status.
                            </p>
                        </div>

                        {hasFilters && (
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
                            >
                                <RotateCcw className="h-3.5 w-3.5" />
                                Reset filters
                            </button>
                        )}
                    </div>

                    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Input
                            id="audit-user-id"
                            label="User ID"
                            value={userId}
                            onChange={(event) =>
                                handleUserIdChange(
                                    event.target.value,
                                )
                            }
                            placeholder="Enter user UUID"
                        />

                        <Select
                            id="audit-service"
                            label="Service"
                            value={serviceName}
                            onChange={(event) =>
                                handleServiceChange(
                                    event.target.value,
                                )
                            }
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
                        </Select>

                        <Select
                            id="audit-action"
                            label="Action"
                            value={action}
                            onChange={(event) =>
                                handleActionChange(
                                    event.target.value as
                                        | AuditAction
                                        | "",
                                )
                            }
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
                        </Select>

                        <Select
                            id="audit-status"
                            label="Status"
                            value={status}
                            onChange={(event) =>
                                handleStatusChange(
                                    event.target.value as
                                        | AuditStatus
                                        | "",
                                )
                            }
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
                        </Select>
                    </div>
                </div>

                {isFetching && (
                    <div className="flex items-center gap-2 border-b border-slate-100 px-6 py-3 text-xs text-slate-500">
                        <Activity className="h-3.5 w-3.5 animate-pulse" />
                        Updating audit logs...
                    </div>
                )}

                <AuditLogList logs={logs} />
            </Card>

            {data && data.totalPages > 0 && (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                        Page {data.number + 1} of{" "}
                        {data.totalPages}
                    </p>

                    <Pagination
                        page={data.number}
                        totalPages={data.totalPages}
                        onPageChange={setPage}
                        disabled={isFetching}
                    />
                </div>
            )}
        </div>
    );
}