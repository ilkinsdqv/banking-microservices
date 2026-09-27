import { useQuery } from "@tanstack/react-query";

import { auditApi } from "../api/audit-api";

export function useAuditLog(id: string | undefined) {
    return useQuery({
        queryKey: ["admin", "audit", id],
        queryFn: () => auditApi.getById(id!),
        enabled: Boolean(id),
    });
}