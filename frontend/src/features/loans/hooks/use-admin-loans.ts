import { useQuery } from "@tanstack/react-query";

import { loansApi } from "../api/loans-api";

export function useAdminLoans() {
    return useQuery({
        queryKey: ["loans", "admin"],
        queryFn: loansApi.getAdminApplications,
    });
}
