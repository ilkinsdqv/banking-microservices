import { useQuery } from "@tanstack/react-query";

import { loansApi } from "../api/loans-api";

export function useLoans() {
    return useQuery({
        queryKey: ["loans", "my"],
        queryFn: loansApi.getMyLoans,
    });
}