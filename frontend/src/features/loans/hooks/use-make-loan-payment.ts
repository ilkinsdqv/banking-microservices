import { useMutation, useQueryClient } from "@tanstack/react-query";

import { loansApi } from "../api/loans-api";

export function useMakeLoanPayment() {
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
    }) => loansApi.makePayment(loanId, paymentAccountId, amount),

    onSuccess: (loan, variables) => {
      queryClient.setQueryData(["loans", loan.id], loan);

      queryClient.invalidateQueries({
        queryKey: ["loans", "my"],
      });

      queryClient.invalidateQueries({
        queryKey: ["loans", loan.id, "payments"],
      });

      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
}