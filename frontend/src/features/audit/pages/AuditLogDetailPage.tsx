import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    Clock3,
    FileText,
    Globe2,
    Hash,
    Server,
    UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

import {
    Button,
    Card,
    ErrorState,
    Skeleton,
} from "../../../components/ui";

import { AuditStatusBadge } from "../components/AuditStatusBadge";
import { useAuditLog } from "../hooks/use-audit-log";

function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(value));
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

export function AuditLogDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const {
        data: log,
        isLoading,
        isError,
        refetch,
    } = useAuditLog(id);

    if (isLoading) {
        return (
            <div className="space-y-8">
                <Skeleton className="h-5 w-36" />

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                    <div className="bg-slate-950 p-6 sm:p-8">
                        <Skeleton className="h-4 w-28 bg-white/10" />
                        <Skeleton className="mt-4 h-8 w-64 bg-white/10" />
                        <Skeleton className="mt-3 h-4 w-80 bg-white/10" />
                    </div>

                    <div className="grid gap-6 p-6 md:grid-cols-2">
                        {Array.from({ length: 8 }).map(
                            (_, index) => (
                                <Skeleton
                                    key={index}
                                    className="h-14 w-full"
                                />
                            ),
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !log) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() =>
                        navigate("/admin/audit")
                    }
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Audit Logs
                </Button>

                <ErrorState
                    title="Unable to load audit log"
                    description="We couldn't retrieve this audit event. Please try again."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <button
                type="button"
                onClick={() =>
                    navigate("/admin/audit")
                }
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                Back to Audit Logs
            </button>

            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10">
                    <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-500/10 blur-3xl" />

                    <div className="relative">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                                    <FileText className="h-5 w-5" />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Audit event
                                    </p>

                                    <h1 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
                                        {formatAction(
                                            log.action,
                                        )}
                                    </h1>

                                    <p className="mt-2 text-sm text-slate-400">
                                        {log.serviceName}
                                    </p>
                                </div>
                            </div>

                            <AuditStatusBadge
                                status={log.status}
                            />
                        </div>
                    </div>
                </div>

                <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                    <SummaryItem
                        icon={Server}
                        label="Service"
                        value={log.serviceName}
                    />

                    <SummaryItem
                        icon={CheckCircle2}
                        label="Status"
                        value={
                            log.status === "SUCCESS"
                                ? "Success"
                                : "Failed"
                        }
                    />

                    <SummaryItem
                        icon={CalendarDays}
                        label="Created"
                        value={formatDate(
                            log.createdAt,
                        )}
                    />

                    <SummaryItem
                        icon={Clock3}
                        label="Updated"
                        value={formatDate(
                            log.updatedAt,
                        )}
                    />
                </div>
            </section>

            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                <Card className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                            <FileText className="h-4 w-4" />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-slate-950">
                                Event information
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Details recorded for this audit event.
                            </p>
                        </div>
                    </div>

                    <dl className="mt-6 divide-y divide-slate-100">
                        <DetailRow
                            icon={Hash}
                            label="Audit ID"
                            value={log.id}
                            mono
                        />

                        <DetailRow
                            icon={UserRound}
                            label="User ID"
                            value={log.userId}
                            mono
                        />

                        <DetailRow
                            icon={CircleDollarSign}
                            label="Action"
                            value={formatAction(
                                log.action,
                            )}
                        />

                        <DetailRow
                            icon={Server}
                            label="Entity Type"
                            value={
                                log.entityType || "—"
                            }
                        />

                        <DetailRow
                            icon={Hash}
                            label="Entity ID"
                            value={
                                log.entityId || "—"
                            }
                            mono
                        />

                        <DetailRow
                            icon={Globe2}
                            label="IP Address"
                            value={
                                log.ipAddress || "—"
                            }
                            mono
                        />
                    </dl>
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <FileText className="h-4 w-4" />
                        </div>

                        <div>
                            <h2 className="text-sm font-semibold text-slate-950">
                                Description
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Additional information recorded by the service.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                            {log.description ||
                                "No description available."}
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}

function SummaryItem({
                         icon: Icon,
                         label,
                         value,
                     }: {
    icon: typeof Server;
    label: string;
    value: string;
}) {
    return (
        <div className="p-5">
            <div className="flex items-center gap-2 text-slate-400">
                <Icon className="h-4 w-4" />

                <p className="text-xs font-medium uppercase tracking-wider">
                    {label}
                </p>
            </div>

            <p className="mt-2 break-words text-sm font-semibold text-slate-900">
                {value}
            </p>
        </div>
    );
}

function DetailRow({
                       icon: Icon,
                       label,
                       value,
                       mono = false,
                   }: {
    icon: typeof Server;
    label: string;
    value: string;
    mono?: boolean;
}) {
    return (
        <div className="flex items-start justify-between gap-5 py-4 first:pt-0 last:pb-0">
            <dt className="flex shrink-0 items-center gap-2 text-sm text-slate-500">
                <Icon className="h-3.5 w-3.5" />
                {label}
            </dt>

            <dd
                className={[
                    "min-w-0 break-all text-right text-sm font-semibold text-slate-900",
                    mono ? "font-mono text-xs" : "",
                ].join(" ")}
            >
                {value}
            </dd>
        </div>
    );
}