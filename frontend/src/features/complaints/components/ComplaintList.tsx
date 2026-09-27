import {
    AlertCircle,
    CalendarDays,
    ChevronRight,
    CircleAlert,
    FileWarning,
} from "lucide-react";
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

function ComplaintList({ complaints }: ComplaintListProps) {
    const navigate = useNavigate();

    if (complaints.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-500 shadow-sm ring-1 ring-slate-200">
                    <AlertCircle className="h-5 w-5" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-slate-950">
                    No complaints yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    You haven't submitted any complaints yet.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200">
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                    <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Complaint
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Priority
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Status
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Created
                        </th>
                        <th className="w-10 px-4" />
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100 bg-white">
                    {complaints.map((complaint) => (
                        <tr
                            key={complaint.id}
                            onClick={() =>
                                navigate(`/complaints/${complaint.id}`)
                            }
                            className="cursor-pointer transition hover:bg-slate-50"
                        >
                            <td className="px-5 py-5">
                                <div className="flex min-w-0 items-start gap-3">
                                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                                        <FileWarning className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-900">
                                            {complaint.subject}
                                        </p>

                                        <p className="mt-1 max-w-md truncate text-sm text-slate-500">
                                            {complaint.description}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            <td className="px-5 py-5">
                                    <span
                                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${getComplaintPriorityClass(
                                            complaint.priority,
                                        )}`}
                                    >
                                        <CircleAlert className="h-3.5 w-3.5" />
                                        {getComplaintPriorityLabel(
                                            complaint.priority,
                                        )}
                                    </span>
                            </td>

                            <td className="px-5 py-5">
                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${getComplaintStatusClass(
                                            complaint.status,
                                        )}`}
                                    >
                                        {getComplaintStatusLabel(
                                            complaint.status,
                                        )}
                                    </span>
                            </td>

                            <td className="px-5 py-5">
                                <div className="flex items-center gap-2 whitespace-nowrap text-sm text-slate-500">
                                    <CalendarDays className="h-4 w-4" />
                                    {new Date(
                                        complaint.createdAt,
                                    ).toLocaleDateString()}
                                </div>
                            </td>

                            <td className="px-4 py-5">
                                <ChevronRight className="h-5 w-5 text-slate-400" />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="divide-y divide-slate-100 bg-white md:hidden">
                {complaints.map((complaint) => (
                    <button
                        key={complaint.id}
                        type="button"
                        onClick={() =>
                            navigate(`/complaints/${complaint.id}`)
                        }
                        className="flex w-full items-start gap-4 p-4 text-left transition hover:bg-slate-50"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <FileWarning className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                                <p className="truncate font-semibold text-slate-900">
                                    {complaint.subject}
                                </p>

                                <ChevronRight className="h-5 w-5 shrink-0 text-slate-400" />
                            </div>

                            <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                                {complaint.description}
                            </p>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getComplaintPriorityClass(
                                        complaint.priority,
                                    )}`}
                                >
                                    {getComplaintPriorityLabel(
                                        complaint.priority,
                                    )}
                                </span>

                                <span
                                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${getComplaintStatusClass(
                                        complaint.status,
                                    )}`}
                                >
                                    {getComplaintStatusLabel(
                                        complaint.status,
                                    )}
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default ComplaintList;