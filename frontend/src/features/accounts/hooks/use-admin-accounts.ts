import { useQuery } from "@tanstack/react-query";

import { accountsApi } from "../api/accounts-api";

export function useAdminAccounts() {
    return useQuery({
        queryKey: ["admin", "accounts"],
        queryFn: accountsApi.getAll,
    });
}