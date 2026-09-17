import { useQuery } from "@tanstack/react-query";

import { loansApi } from "../api/loans-api";

export function useLoanPayments(loanId: string | undefined) {
    return useQuery({
        queryKey: ["loans", loanId, "payments"],
        queryFn: () => loansApi.getPayments(loanId!),
        enabled: Boolean(loanId),
    });
}