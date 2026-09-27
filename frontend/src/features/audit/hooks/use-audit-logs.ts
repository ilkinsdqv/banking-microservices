import { useQuery } from "@tanstack/react-query";
import { auditApi } from "../api/audit-api";
import type { AuditLogFilterParams } from "../types/audit-log";

export function useAuditLogs(
    filters: AuditLogFilterParams,
) {
    return useQuery({
        queryKey: ["admin", "audit", filters],

        queryFn: () => auditApi.getAll(filters),

        placeholderData: (previousData) => previousData,
    });
}