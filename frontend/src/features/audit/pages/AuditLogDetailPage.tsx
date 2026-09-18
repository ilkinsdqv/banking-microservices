import { useNavigate, useParams } from "react-router";
import { useAuditLog } from "../hooks/use-audit-log";
import { AuditStatusBadge } from "../components/AuditStatusBadge";

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
                word.charAt(0).toUpperCase() + word.slice(1),
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
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Audit Log Details
                    </h1>
                    <p className="text-muted-foreground">
                        View detailed information about this audit event.
                    </p>
                </div>

                <div className="rounded-lg border p-8 text-center">
                    Loading audit log...
                </div>
            </div>
        );
    }

    if (isError || !log) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Audit Log Details
                    </h1>
                </div>

                <div className="rounded-lg border p-8 text-center">
                    <p className="text-destructive">
                        Failed to load audit log.
                    </p>

                    <div className="mt-4 flex justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="rounded-md border px-4 py-2 text-sm"
                        >
                            Try again
                        </button>

                        <button
                            type="button"
                            onClick={() => navigate("/admin/audit")}
                            className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground"
                        >
                            Back to Audit Logs
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Audit Log Details
                    </h1>

                    <p className="text-muted-foreground">
                        Detailed information about the selected audit event.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/admin/audit")}
                    className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                    Back to Audit Logs
                </button>
            </div>

            <div className="rounded-lg border bg-card">
                <div className="border-b px-6 py-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Action
                            </p>

                            <h2 className="text-lg font-semibold">
                                {formatAction(log.action)}
                            </h2>
                        </div>

                        <AuditStatusBadge status={log.status} />
                    </div>
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-2">
                    <div>
                        <p className="text-sm text-muted-foreground">
                            Audit ID
                        </p>

                        <p className="mt-1 break-all font-mono text-sm">
                            {log.id}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            User ID
                        </p>

                        <p className="mt-1 break-all font-mono text-sm">
                            {log.userId}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Service
                        </p>

                        <p className="mt-1 font-medium">
                            {log.serviceName}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Action
                        </p>

                        <p className="mt-1 font-medium">
                            {formatAction(log.action)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Entity Type
                        </p>

                        <p className="mt-1 font-medium">
                            {log.entityType || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Entity ID
                        </p>

                        <p className="mt-1 break-all font-mono text-sm">
                            {log.entityId || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            IP Address
                        </p>

                        <p className="mt-1 font-mono text-sm">
                            {log.ipAddress || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Status
                        </p>

                        <div className="mt-1">
                            <AuditStatusBadge status={log.status} />
                        </div>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Created At
                        </p>

                        <p className="mt-1">
                            {formatDate(log.createdAt)}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-muted-foreground">
                            Updated At
                        </p>

                        <p className="mt-1">
                            {formatDate(log.updatedAt)}
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <p className="text-sm text-muted-foreground">
                            Description
                        </p>

                        <div className="mt-2 rounded-md bg-muted/40 p-4">
                            <p className="whitespace-pre-wrap text-sm">
                                {log.description ||
                                    "No description available."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}