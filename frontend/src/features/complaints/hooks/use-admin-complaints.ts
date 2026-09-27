import { useQuery } from "@tanstack/react-query";
import { adminComplaintsApi } from "../api/admin-complaints-api";
import type { ComplaintStatus } from "../types/complaint";

export function useAdminComplaints(
    status?: ComplaintStatus,
) {
    return useQuery({
        queryKey: ["admin", "complaints", status ?? "all"],
        queryFn: () =>
            status
                ? adminComplaintsApi.getByStatus(status)
                : adminComplaintsApi.getAll(),
    });
}