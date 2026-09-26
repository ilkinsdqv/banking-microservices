import {
    AlertCircle,
    CheckCircle2,
    ClipboardList,
    Clock3,
    Filter,
    MessageSquareWarning,
} from "lucide-react";
import { useMemo, useState } from "react";

import { Card, Select, Skeleton } from "../../../components/ui";
import { ErrorState } from "../../../components/ui/ErrorState";

import type { ComplaintStatus } from "../types/complaint";
import { useAdminComplaints } from "../hooks/use-admin-complaints";
import AdminComplaintList from "../components/AdminComplaintList";

const statusOptions: {
    value: "" | ComplaintStatus;
    label: string;
}[] = [
    {
        value: "",
        label: "All complaints",
    },
    {
        value: "OPEN",
        label: "Open",
    },
    {
        value: "IN_PROGRESS",
        label: "In progress",
    },
    {
        value: "RESOLVED",
        label: "Resolved",
    },
    {
        value: "CLOSED",
        label: "Closed",
    },
];

export default function AdminComplaintsPage() {
    const [status, setStatus] = useState<
        "" | ComplaintStatus
    >("");

    const {
        data: complaints = [],
        isLoading,
        isError,
        refetch,
    } = useAdminComplaints(status || undefined);

    const stats = useMemo(
        () => ({
            total: complaints.length,
            open: complaints.filter(
                (complaint) => complaint.status === "OPEN",
            ).length,
            inProgress: complaints.filter(
                (complaint) =>
                    complaint.status === "IN_PROGRESS",
            ).length,
            resolved: complaints.filter(
                (complaint) => complaint.status === "RESOLVED",
            ).length,
        }),
        [complaints],
    );

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-56" />
                    <Skeleton className="h-4 w-96" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <Card key={index} className="p-5">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="mt-5 h-4 w-28" />
                            <Skeleton className="mt-2 h-8 w-16" />
                        </Card>
                    ))}
                </div>

                <Card className="overflow-hidden">
                    <div className="border-b px-6 py-5">
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="mt-2 h-4 w-72" />
                    </div>

                    <div className="space-y-4 p-6">
                        {Array.from({ length: 6 }).map((_, index) => (
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
                        Complaint Management
                    </h1>
                </div>

                <ErrorState
                    title="Unable to load complaints"
                    description="Something went wrong while loading customer complaints."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/4 -translate-y-1/4 rounded-full bg-amber-100/70 blur-3xl" />

                <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-amber-600">
                            <MessageSquareWarning className="h-4 w-4" />
                            Customer support
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                            Complaint Management
                        </h1>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Review customer complaints and manage their
                            lifecycle from open to completion.
                        </p>
                    </div>

                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                        <ClipboardList className="h-6 w-6" />
                    </div>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Card className="p-5 transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {stats.total}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <ClipboardList className="h-5 w-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-5 transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Open
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {stats.open}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <AlertCircle className="h-5 w-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-5 transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                In progress
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {stats.inProgress}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <Clock3 className="h-5 w-5" />
                        </div>
                    </div>
                </Card>

                <Card className="p-5 transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Resolved
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {stats.resolved}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </div>
                </Card>
            </section>

            <Card className="overflow-hidden">
                <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <h2 className="text-base font-semibold text-slate-950">
                            Complaints
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Review and manage customer complaints.
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-slate-400" />

                        <div className="w-full sm:w-52">
                            <Select
                                id="complaint-status"
                                value={status}
                                onChange={(event) =>
                                    setStatus(
                                        event.target.value as "" | ComplaintStatus,
                                    )
                                }
                            >
                                {statusOptions.map((option) => (
                                    <option
                                        key={option.value || "all"}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        </div>
                    </div>
                </div>

                <AdminComplaintList complaints={complaints} />
            </Card>
        </div>
    );
}