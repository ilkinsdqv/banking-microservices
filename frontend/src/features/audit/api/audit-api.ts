import { apiClient } from "../../../lib/axios";
import type {
    AuditLog,
    AuditLogFilterParams,
    AuditLogPage,
} from "../types/audit-log";

export const auditApi = {
    getAll: async (
        params: AuditLogFilterParams = {},
    ): Promise<AuditLogPage> => {
        const response = await apiClient.get<AuditLogPage>(
            "/api/v1/audits",
            {
                params,
            },
        );

        return response.data;
    },

    getById: async (id: string): Promise<AuditLog> => {
        const response = await apiClient.get<AuditLog>(
            `/api/v1/audits/${id}`,
        );

        return response.data;
    },
};