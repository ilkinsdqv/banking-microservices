import { useMutation, useQueryClient } from "@tanstack/react-query";

import { accountsApi } from "../api/accounts-api";
import type { CreateAccountRequest } from "../types/account";

export function useCreateAccount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (request: CreateAccountRequest) =>
            accountsApi.create(request),

        onSuccess: (account) => {
            queryClient.invalidateQueries({
                queryKey: ["accounts", "user", account.userId],
            });
        },
    });
}