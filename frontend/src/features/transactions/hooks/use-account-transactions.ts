import { useQuery } from "@tanstack/react-query";

import { transactionsApi } from "../api/transactions-api";

export function useAccountTransactions(
    accountId: string | undefined,
) {
    return useQuery({
        queryKey: ["transactions", "account", accountId],
        queryFn: () => transactionsApi.getByAccountId(accountId!),
        enabled: Boolean(accountId),
    });
}