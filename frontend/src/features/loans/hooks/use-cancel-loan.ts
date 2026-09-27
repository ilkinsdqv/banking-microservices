import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loansApi } from "../api/loans-api";

export function useCancelLoan() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (loanId: string) => loansApi.cancel(loanId),

        onSuccess: (loan) => {
            queryClient.setQueryData(["loans", loan.id], loan);

            queryClient.invalidateQueries({
                queryKey: ["loans", "my"],
            });
        },
    });
}