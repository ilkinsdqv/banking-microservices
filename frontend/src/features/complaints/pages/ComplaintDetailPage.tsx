import { useNavigate, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
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
    } = useComplaint(id ?? "");

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                <div className="h-80 animate-pulse rounded-xl bg-muted" />
            </div>
        );
    }

    if (isError || !complaint) {
        return (
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() => navigate("/complaints")}
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to complaints
                </button>

                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                    <h2 className="text-lg font-semibold">
                        Complaint could not be loaded
                    </h2>

                    <p className="mt-2 text-sm text-muted-foreground">
                        The requested complaint does not exist or could not be retrieved.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={() => navigate("/complaints")}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to complaints
            </button>

            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Complaint details
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    View the details and current status of your complaint.
                </p>
            </div>

            <div className="rounded-xl border bg-card shadow-sm">
                <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-start md:justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Subject</p>

                        <h2 className="mt-1 text-xl font-semibold">
                            {complaint.subject}
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2">
            <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${getComplaintStatusClass(
                    complaint.status,
                )}`}
            >
              {getComplaintStatusLabel(complaint.status)}
            </span>

                        <span
                            className={`rounded-full px-3 py-1 text-xs font-medium ${getComplaintPriorityClass(
                                complaint.priority,
                            )}`}
                        >
              {getComplaintPriorityLabel(complaint.priority)}
            </span>
                    </div>
                </div>

                <div className="grid gap-6 p-6 md:grid-cols-2">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Created
                        </p>

                        <p className="mt-1 text-sm">
                            {new Date(complaint.createdAt).toLocaleString()}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            Last updated
                        </p>

                        <p className="mt-1 text-sm">
                            {new Date(complaint.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="border-t p-6">
                    <p className="text-sm font-medium text-muted-foreground">
                        Description
                    </p>

                    <div className="mt-3 whitespace-pre-wrap rounded-lg bg-muted/50 p-4 text-sm leading-6">
                        {complaint.description}
                    </div>
                </div>

                {complaint.adminResponse && (
                    <div className="border-t p-6">
                        <p className="text-sm font-medium text-muted-foreground">
                            Admin response
                        </p>

                        <div className="mt-3 whitespace-pre-wrap rounded-lg border bg-background p-4 text-sm leading-6">
                            {complaint.adminResponse}
                        </div>

                        {complaint.resolvedAt && (
                            <p className="mt-3 text-xs text-muted-foreground">
                                Resolved on{" "}
                                {new Date(complaint.resolvedAt).toLocaleString()}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}