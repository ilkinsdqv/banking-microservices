import { useNavigate } from "react-router";
import type { Complaint } from "../types/complaint";
import {
    getComplaintPriorityClass,
    getComplaintPriorityLabel,
    getComplaintStatusClass,
    getComplaintStatusLabel,
} from "./complaint-status";

interface ComplaintListProps {
    complaints: Complaint[];
}

export default function ComplaintList({
                                          complaints,
                                      }: ComplaintListProps) {
    const navigate = useNavigate();

    if (complaints.length === 0) {
        return (
            <div className="rounded-xl border bg-card p-8 text-center">
                <h3 className="text-lg font-semibold">
                    No complaints yet
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                    You haven't submitted any complaints yet.
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
                    </tr>
                    </thead>

                    <tbody className="divide-y">
                    {complaints.map((complaint) => (
                        <tr
                            key={complaint.id}
                            onClick={() =>
                                navigate(`/complaints/${complaint.id}`)
                            }
                            className="cursor-pointer transition-colors hover:bg-muted/30"
                        >
                            <td className="px-6 py-4">
                                <div className="max-w-md">
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
                    {getComplaintPriorityLabel(
                        complaint.priority,
                    )}
                  </span>
                            </td>

                            <td className="px-6 py-4">
                  <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getComplaintStatusClass(
                          complaint.status,
                      )}`}
                  >
                    {getComplaintStatusLabel(
                        complaint.status,
                    )}
                  </span>
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                                {new Date(
                                    complaint.createdAt,
                                ).toLocaleString()}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}