import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loansApi } from "../api/loans-api";

type LoanStatusAction = "approve" | "reject";

export function useUpdateLoanStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            loanId,
            action,
        }: {
            loanId: string;
            action: LoanStatusAction;
        }) =>
            action === "approve"
                ? loansApi.approve(loanId)
                : loansApi.reject(loanId),

        onSuccess: (loan) => {
            queryClient.setQueryData(["loans", loan.id], loan);
            queryClient.invalidateQueries({
                queryKey: ["loans", "admin"],
            });
        },
    });
}
