import {
    AlertCircle,
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    FileText,
    MessageSquare,
    ShieldCheck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

import {
    Button,
    ErrorState,
    Skeleton,
} from "../../../components/ui";
import { useComplaint } from "../hooks/use-complaint";
import {
    getComplaintPriorityLabel,
    getComplaintPriorityClass,
    getComplaintStatusLabel,
    getComplaintStatusClass,
} from "../components/complaint-status";

export default function ComplaintDetailPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const {
        data: complaint,
        isLoading,
        isError,
        refetch,
    } = useComplaint(id ?? "");

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-56 rounded-3xl" />
                <Skeleton className="h-72 rounded-2xl" />
            </div>
        );
    }

    if (isError || !complaint) {
        return (
            <ErrorState
                title="Complaint could not be loaded"
                description="The requested complaint does not exist or could not be retrieved."
                onRetry={() => refetch()}
            />
        );
    }

    const isResolved =
        complaint.status === "RESOLVED" ||
        complaint.status === "CLOSED";

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={() => navigate("/complaints")}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to complaints
            </button>

            <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex min-w-0 gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10">
                            <MessageSquare className="h-6 w-6" />
                        </div>

                        <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-400">
                                Complaint details
                            </p>

                            <h1 className="mt-2 break-words text-2xl font-semibold tracking-tight sm:text-3xl">
                                {complaint.subject}
                            </h1>

                            <p className="mt-3 text-sm text-slate-400">
                                Submitted{" "}
                                {new Date(
                                    complaint.createdAt,
                                ).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getComplaintStatusClass(
                                complaint.status,
                            )}`}
                        >
                            {getComplaintStatusLabel(complaint.status)}
                        </span>

                        <span
                            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getComplaintPriorityClass(
                                complaint.priority,
                            )}`}
                        >
                            {getComplaintPriorityLabel(complaint.priority)}
                        </span>
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-slate-500" />
                            <h2 className="text-base font-semibold text-slate-950">
                                Complaint description
                            </h2>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6">
                        <div className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">
                            {complaint.description}
                        </div>
                    </div>

                    {complaint.adminResponse && (
                        <div className="border-t border-slate-100 p-5 sm:p-6">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-slate-500" />
                                <h2 className="text-base font-semibold text-slate-950">
                                    Admin response
                                </h2>
                            </div>

                            <div className="mt-4 whitespace-pre-wrap rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5 text-sm leading-7 text-slate-700">
                                {complaint.adminResponse}
                            </div>

                            {complaint.resolvedAt && (
                                <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                                    Resolved on{" "}
                                    {new Date(
                                        complaint.resolvedAt,
                                    ).toLocaleString()}
                                </div>
                            )}
                        </div>
                    )}
                </section>

                <aside className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <h2 className="text-sm font-semibold text-slate-950">
                            Complaint timeline
                        </h2>

                        <div className="mt-5 space-y-5">
                            <div className="flex gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                    <CalendarDays className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Created
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {new Date(
                                            complaint.createdAt,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                                    <Clock3 className="h-4 w-4" />
                                </div>

                                <div>
                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                        Last updated
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-slate-900">
                                        {new Date(
                                            complaint.updatedAt,
                                        ).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className={`rounded-2xl border p-5 ${
                            isResolved
                                ? "border-emerald-100 bg-emerald-50"
                                : "border-amber-100 bg-amber-50"
                        }`}
                    >
                        {isResolved ? (
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-amber-600" />
                        )}

                        <p className="mt-3 text-sm font-semibold text-slate-900">
                            {isResolved
                                ? "Complaint resolved"
                                : "Complaint is being reviewed"}
                        </p>

                        <p className="mt-1 text-sm leading-6 text-slate-600">
                            {isResolved
                                ? "Your complaint has been resolved by the support team."
                                : "The support team is currently processing your complaint."}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-slate-600" />
                            <p className="text-sm font-semibold text-slate-900">
                                Support request
                            </p>
                        </div>

                        <p className="mt-2 text-xs leading-5 text-slate-500">
                            Keep your complaint details available when
                            contacting support about this request.
                        </p>
                    </div>

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate("/complaints")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to complaints
                    </Button>
                </aside>
            </div>
        </div>
    );
}