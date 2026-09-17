import { useQuery } from "@tanstack/react-query";

import { transactionsApi } from "../api/transactions-api";

export function useTransaction(id: string | undefined) {
    return useQuery({
        queryKey: ["transactions", id],
        queryFn: () => transactionsApi.getById(id!),
        enabled: Boolean(id),
    });
}