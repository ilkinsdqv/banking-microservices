import { useState } from "react";
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
    } = useAdminComplaints(status || undefined);

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Complaint Management
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Review and manage customer complaints.
                    </p>
                </div>

                <div className="w-full md:w-56">
                    <label
                        htmlFor="complaint-status"
                        className="mb-2 block text-sm font-medium"
                    >
                        Filter by status
                    </label>

                    <select
                        id="complaint-status"
                        value={status}
                        onChange={(event) =>
                            setStatus(
                                event.target.value as "" | ComplaintStatus,
                            )
                        }
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    >
                        {statusOptions.map((option) => (
                            <option
                                key={option.value || "all"}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {isLoading && (
                <div className="rounded-xl border bg-card p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Loading complaints...
                    </p>
                </div>
            )}

            {isError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                    <h2 className="font-semibold">
                        Failed to load complaints
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Please try again.
                    </p>
                </div>
            )}

            {!isLoading && !isError && (
                <AdminComplaintList complaints={complaints} />
            )}
        </div>
    );
}