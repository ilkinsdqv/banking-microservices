import { useMutation, useQueryClient } from "@tanstack/react-query";

import { accountsApi } from "../api/accounts-api";

export function useCashIn() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         accountId,
                         amount,
                     }: {
            accountId: string;
            amount: number;
        }) =>
            accountsApi.cashIn(accountId, {
                amount,
            }),

        onSuccess: (account) => {
            queryClient.invalidateQueries({
                queryKey: ["accounts", "user", account.userId],
            });

            queryClient.setQueryData(
                ["accounts", account.id],
                account,
            );
        },
    });
}