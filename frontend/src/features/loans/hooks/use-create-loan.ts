import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loansApi } from "../api/loans-api";

export function useCreateLoan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: loansApi.create,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["loans", "my"],
            });
        },
    });
}