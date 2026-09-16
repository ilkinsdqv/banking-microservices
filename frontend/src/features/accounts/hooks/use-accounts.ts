import { useQuery } from "@tanstack/react-query";

import { accountsApi } from "../api/accounts-api";

export function useAccounts(userId: string | null) {
    return useQuery({
        queryKey: ["accounts", "user", userId],
        queryFn: () => accountsApi.getByUserId(userId!),
        enabled: Boolean(userId),
    });
}