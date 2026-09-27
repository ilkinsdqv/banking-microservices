import { useQueries } from "@tanstack/react-query";

import { transactionsApi } from "../api/transactions-api";
import type { Account } from "../../accounts/types/account";

export function useUserTransactions(accounts: Account[] | undefined) {
    const queries = useQueries({
        queries:
            accounts?.map((account) => ({
                queryKey: ["transactions", "account", account.id],
                queryFn: () => transactionsApi.getByAccountId(account.id),
                enabled: Boolean(account.id),
            })) ?? [],
    });

    const isLoading = queries.some((query) => query.isLoading);
    const isError = queries.some((query) => query.isError);

    const transactions = Array.from(
        new Map(
            queries
                .flatMap((query) => query.data ?? [])
                .map((transaction) => [transaction.id, transaction]),
        ).values(),
    ).sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime(),
    );

    return {
        transactions,
        isLoading,
        isError,
    };
}