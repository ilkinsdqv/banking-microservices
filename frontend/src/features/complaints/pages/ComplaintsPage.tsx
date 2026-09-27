import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Clock3,
    FileWarning,
    Plus,
} from "lucide-react";
import { useNavigate } from "react-router";

import {
    Button,
    Card,
    ErrorState,
    Skeleton,
} from "../../../components/ui";
import ComplaintList from "../components/ComplaintList";
import { useComplaints } from "../hooks/use-complaints";

function ComplaintsPage() {
    const navigate = useNavigate();

    const {
        data: complaints,
        isLoading,
        isError,
        refetch,
    } = useComplaints();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="rounded-3xl bg-slate-950 p-6 sm:p-8">
                    <Skeleton className="h-5 w-32 bg-white/10" />
                    <Skeleton className="mt-4 h-9 w-64 bg-white/10" />
                    <Skeleton className="mt-3 h-4 w-full max-w-xl bg-white/10" />
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                </div>

                <Skeleton className="h-96 rounded-2xl" />
            </div>
        );
    }

    if (isError) {
        return (
            <ErrorState
                title="Could not load complaints"
                description="Something went wrong while loading your complaints."
                onRetry={() => refetch()}
            />
        );
    }

    const complaintList = complaints ?? [];

    const openCount = complaintList.filter(
        (complaint) =>
            complaint.status !== "RESOLVED" &&
            complaint.status !== "CLOSED",
    ).length;

    const resolvedCount = complaintList.filter(
        (complaint) =>
            complaint.status === "RESOLVED" ||
            complaint.status === "CLOSED",
    ).length;

    const totalCount = complaintList.length;

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
                <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                            <FileWarning className="h-4 w-4" />
                            Customer support
                        </div>

                        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                            Complaints
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                            Track your complaints, follow their progress, and
                            review previous resolutions in one place.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={() => navigate("/complaints/new")}
                        className="shrink-0 text-slate-950 hover:bg-slate-100"
                    >
                        <Plus className="h-4 w-4" />
                        New complaint
                    </Button>
                </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-slate-200/80 p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total complaints
                            </p>
                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {totalCount}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                            <FileWarning className="h-5 w-5" />
                        </div>
                    </div>
                </Card>

                <Card className="border-slate-200/80 p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                In progress
                            </p>
                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {openCount}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <Clock3 className="h-5 w-5" />
                        </div>
                    </div>
                </Card>

                <Card className="border-slate-200/80 p-5 shadow-sm">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Resolved
                            </p>
                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {resolvedCount}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                    </div>
                </Card>
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-base font-semibold text-slate-950">
                            Your complaints
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Review status and details of your support requests.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => navigate("/complaints/new")}
                        className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition hover:text-slate-950"
                    >
                        Create complaint
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    {complaintList.length === 0 ? (
                        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                                <AlertCircle className="h-5 w-5" />
                            </div>

                            <h3 className="mt-4 text-sm font-semibold text-slate-950">
                                No complaints yet
                            </h3>

                            <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                                If you need help with a banking service, you
                                can create a new complaint here.
                            </p>

                            <Button
                                type="button"
                                onClick={() =>
                                    navigate("/complaints/new")
                                }
                                className="mt-5"
                                size="sm"
                            >
                                <Plus className="h-4 w-4" />
                                New complaint
                            </Button>
                        </div>
                    ) : (
                        <ComplaintList complaints={complaintList} />
                    )}
                </div>
            </section>
        </div>
    );
}

export default ComplaintsPage;