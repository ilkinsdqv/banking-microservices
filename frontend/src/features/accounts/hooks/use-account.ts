import { useQuery } from "@tanstack/react-query";

import { accountsApi } from "../api/accounts-api";

export function useAccount(id: string | undefined) {
    return useQuery({
        queryKey: ["accounts", id],
        queryFn: () => accountsApi.getById(id!),
        enabled: Boolean(id),
    });
}