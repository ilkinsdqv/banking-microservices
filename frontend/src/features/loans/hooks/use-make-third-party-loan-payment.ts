import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loansApi } from "../api/loans-api";

export function useMakeThirdPartyLoanPayment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            loanId,
            paymentAccountId,
            amount,
        }: {
            loanId: string;
            paymentAccountId: string;
            amount: number;
        }) => loansApi.makeThirdPartyPayment(
            loanId,
            paymentAccountId,
            amount,
        ),

        onSuccess: (loan) => {
            queryClient.invalidateQueries({
                queryKey: ["accounts"],
            });

            queryClient.invalidateQueries({
                queryKey: ["loans", "my"],
            });

            queryClient.setQueryData(["loans", loan.id], loan);
        },
    });
}
