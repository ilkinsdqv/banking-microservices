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
            <div className="rounded-xl border bg-card p-8 text-center">
                <h3 className="text-lg font-semibold">
                    No complaints found
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                    There are no complaints matching the selected filter.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="border-b bg-muted/40">
                    <tr>
                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                            Customer
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                            Subject
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                            Priority
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                            Status
                        </th>

                        <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                            Created
                        </th>

                        <th className="px-6 py-4 text-right text-sm font-medium text-muted-foreground">
                            Action
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y">
                    {complaints.map((complaint) => (
                        <AdminComplaintRow
                            key={complaint.id}
                            complaint={complaint}
                        />
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
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
        <tr className="hover:bg-muted/20">
            <td className="px-6 py-4">
        <span className="font-mono text-xs text-muted-foreground">
          {complaint.userId}
        </span>
            </td>

            <td className="px-6 py-4">
                <div className="max-w-xs">
                    <p className="font-medium">
                        {complaint.subject}
                    </p>

                    <p className="mt-1 truncate text-sm text-muted-foreground">
                        {complaint.description}
                    </p>
                </div>
            </td>

            <td className="px-6 py-4">
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getComplaintPriorityClass(
                complaint.priority,
            )}`}
        >
          {getComplaintPriorityLabel(complaint.priority)}
        </span>
            </td>

            <td className="px-6 py-4">
        <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getComplaintStatusClass(
                complaint.status,
            )}`}
        >
          {getComplaintStatusLabel(complaint.status)}
        </span>
            </td>

            <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                {new Date(complaint.createdAt).toLocaleString()}
            </td>

            <td className="px-6 py-4 text-right">
                {complaint.status === "OPEN" && (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleStart}
                        className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {startMutation.isPending
                            ? "Starting..."
                            : "Start"}
                    </button>
                )}

                {complaint.status === "IN_PROGRESS" && (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleResolve}
                        className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {resolveMutation.isPending
                            ? "Resolving..."
                            : "Resolve"}
                    </button>
                )}

                {complaint.status === "RESOLVED" && (
                    <button
                        type="button"
                        disabled={isPending}
                        onClick={handleClose}
                        className="rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {closeMutation.isPending
                            ? "Closing..."
                            : "Close"}
                    </button>
                )}

                {complaint.status === "CLOSED" && (
                    <span className="text-sm text-muted-foreground">
            Completed
          </span>
                )}
            </td>
        </tr>
    );
}