import {
    CheckCircle2,
    CirclePlay,
    MessageSquare,
    XCircle,
} from "lucide-react";

import type { Complaint } from "../types/complaint";

import {
    getComplaintPriorityClass,
    getComplaintPriorityLabel,
    getComplaintStatusClass,
    getComplaintStatusLabel,
} from "./complaint-status";

import {
    useCloseComplaint,
    useResolveComplaint,
    useStartComplaint,
} from "../hooks/use-admin-complaint-actions";

interface AdminComplaintListProps {
    complaints: Complaint[];
}

export default function AdminComplaintList({
                                               complaints,
                                           }: AdminComplaintListProps) {
    if (complaints.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <MessageSquare className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-950">
                    No complaints found
                </h3>

                <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                    There are no complaints matching the selected filter.
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
                            Customer
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Complaint
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Priority
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Status
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Created
                        </th>

                        <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Action
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {complaints.map((complaint) => (
                        <AdminComplaintRow
                            key={complaint.id}
                            complaint={complaint}
                        />
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
                {complaints.map((complaint) => (
                    <AdminComplaintMobileRow
                        key={complaint.id}
                        complaint={complaint}
                    />
                ))}
            </div>
        </>
    );
}

function AdminComplaintRow({
                               complaint,
                           }: {
    complaint: Complaint;
}) {
    const startMutation = useStartComplaint();
    const resolveMutation = useResolveComplaint();
    const closeMutation = useCloseComplaint();

    const isPending =
        startMutation.isPending ||
        resolveMutation.isPending ||
        closeMutation.isPending;

    const handleStart = () => {
        startMutation.mutate(complaint.id);
    };

    const handleResolve = () => {
        const adminResponse = window.prompt(
            "Enter admin response:",
        );

        if (!adminResponse?.trim()) {
            return;
        }

        resolveMutation.mutate({
            id: complaint.id,
            request: {
                adminResponse: adminResponse.trim(),
            },
        });
    };

    const handleClose = () => {
        const confirmed = window.confirm(
            "Are you sure you want to close this complaint?",
        );

        if (!confirmed) {
            return;
        }

        closeMutation.mutate(complaint.id);
    };

    return (
        <tr className="group transition-colors hover:bg-slate-50/80">
            <td className="px-6 py-4">
                <span className="font-mono text-xs text-slate-500">
                    {complaint.userId}
                </span>
            </td>

            <td className="px-4 py-4">
                <div className="max-w-sm">
                    <p className="truncate font-semibold text-slate-900">
                        {complaint.subject}
                    </p>

                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                        {complaint.description}
                    </p>
                </div>
            </td>

            <td className="px-4 py-4">
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getComplaintPriorityClass(
                        complaint.priority,
                    )}`}
                >
                    {getComplaintPriorityLabel(
                        complaint.priority,
                    )}
                </span>
            </td>

            <td className="px-4 py-4">
                <span
                    className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getComplaintStatusClass(
                        complaint.status,
                    )}`}
                >
                    {getComplaintStatusLabel(
                        complaint.status,
                    )}
                </span>
            </td>

            <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                {new Date(
                    complaint.createdAt,
                ).toLocaleString()}
            </td>

            <td className="px-6 py-4 text-right">
                <ComplaintAction
                    status={complaint.status}
                    isPending={isPending}
                    isStarting={startMutation.isPending}
                    isResolving={resolveMutation.isPending}
                    isClosing={closeMutation.isPending}
                    onStart={handleStart}
                    onResolve={handleResolve}
                    onClose={handleClose}
                />
            </td>
        </tr>
    );
}

function AdminComplaintMobileRow({
                                     complaint,
                                 }: {
    complaint: Complaint;
}) {
    const startMutation = useStartComplaint();
    const resolveMutation = useResolveComplaint();
    const closeMutation = useCloseComplaint();

    const isPending =
        startMutation.isPending ||
        resolveMutation.isPending ||
        closeMutation.isPending;

    const handleStart = () => {
        startMutation.mutate(complaint.id);
    };

    const handleResolve = () => {
        const adminResponse = window.prompt(
            "Enter admin response:",
        );

        if (!adminResponse?.trim()) {
            return;
        }

        resolveMutation.mutate({
            id: complaint.id,
            request: {
                adminResponse: adminResponse.trim(),
            },
        });
    };

    const handleClose = () => {
        const confirmed = window.confirm(
            "Are you sure you want to close this complaint?",
        );

        if (!confirmed) {
            return;
        }

        closeMutation.mutate(complaint.id);
    };

    return (
        <div className="space-y-4 p-5">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-950">
                        {complaint.subject}
                    </p>

                    <p className="mt-1 font-mono text-[11px] text-slate-400">
                        {complaint.userId}
                    </p>
                </div>

                <span
                    className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getComplaintStatusClass(
                        complaint.status,
                    )}`}
                >
                    {getComplaintStatusLabel(
                        complaint.status,
                    )}
                </span>
            </div>

            <p className="line-clamp-3 text-sm leading-6 text-slate-500">
                {complaint.description}
            </p>

            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getComplaintPriorityClass(
                            complaint.priority,
                        )}`}
                    >
                        {getComplaintPriorityLabel(
                            complaint.priority,
                        )}
                    </span>

                    <span className="text-xs text-slate-400">
                        {new Date(
                            complaint.createdAt,
                        ).toLocaleDateString()}
                    </span>
                </div>

                <ComplaintAction
                    status={complaint.status}
                    isPending={isPending}
                    isStarting={startMutation.isPending}
                    isResolving={resolveMutation.isPending}
                    isClosing={closeMutation.isPending}
                    onStart={handleStart}
                    onResolve={handleResolve}
                    onClose={handleClose}
                    compact
                />
            </div>
        </div>
    );
}

interface ComplaintActionProps {
    status: Complaint["status"];
    isPending: boolean;
    isStarting: boolean;
    isResolving: boolean;
    isClosing: boolean;
    onStart: () => void;
    onResolve: () => void;
    onClose: () => void;
    compact?: boolean;
}

function ComplaintAction({
                             status,
                             isPending,
                             isStarting,
                             isResolving,
                             isClosing,
                             onStart,
                             onResolve,
                             onClose,
                             compact = false,
                         }: ComplaintActionProps) {
    if (status === "OPEN") {
        return (
            <button
                type="button"
                disabled={isPending}
                onClick={onStart}
                className={[
                    "inline-flex items-center justify-center gap-2 rounded-lg",
                    "bg-slate-950 px-3 py-2 text-xs font-semibold text-white",
                    "transition-colors hover:bg-slate-800",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    compact ? "w-full sm:w-auto" : "",
                ].join(" ")}
            >
                <CirclePlay className="h-3.5 w-3.5" />

                {isStarting ? "Starting..." : "Start"}
            </button>
        );
    }

    if (status === "IN_PROGRESS") {
        return (
            <button
                type="button"
                disabled={isPending}
                onClick={onResolve}
                className={[
                    "inline-flex items-center justify-center gap-2 rounded-lg",
                    "bg-emerald-600 px-3 py-2 text-xs font-semibold text-white",
                    "transition-colors hover:bg-emerald-700",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    compact ? "w-full sm:w-auto" : "",
                ].join(" ")}
            >
                <CheckCircle2 className="h-3.5 w-3.5" />

                {isResolving ? "Resolving..." : "Resolve"}
            </button>
        );
    }

    if (status === "RESOLVED") {
        return (
            <button
                type="button"
                disabled={isPending}
                onClick={onClose}
                className={[
                    "inline-flex items-center justify-center gap-2 rounded-lg",
                    "border border-slate-200 bg-white px-3 py-2",
                    "text-xs font-semibold text-slate-700",
                    "transition-colors hover:bg-slate-50",
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    compact ? "w-full sm:w-auto" : "",
                ].join(" ")}
            >
                <XCircle className="h-3.5 w-3.5" />

                {isClosing ? "Closing..." : "Close"}
            </button>
        );
    }

    return (
        <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-400">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Completed
        </span>
    );
}