import { useMutation, useQueryClient } from "@tanstack/react-query";

import { transactionsApi } from "../api/transactions-api";
import type { CreateTransactionRequest } from "../types/transaction";

export function useCreateTransaction() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CreateTransactionRequest) =>
            transactionsApi.create(request),

        onSuccess: (transaction) => {
            if (transaction.fromAccountId) {
                queryClient.invalidateQueries({
                    queryKey: [
                        "transactions",
                        "account",
                        transaction.fromAccountId,
                    ],
                });

                queryClient.invalidateQueries({
                    queryKey: [
                        "accounts",
                        transaction.fromAccountId,
                    ],
                });
            }

            if (transaction.toAccountId) {
                queryClient.invalidateQueries({
                    queryKey: [
                        "transactions",
                        "account",
                        transaction.toAccountId,
                    ],
                });

                queryClient.invalidateQueries({
                    queryKey: [
                        "accounts",
                        transaction.toAccountId,
                    ],
                });
            }
        },
    });
}