import { useQuery } from "@tanstack/react-query";

import { loansApi } from "../api/loans-api";

export function useLoan(id: string | undefined) {
    return useQuery({
        queryKey: ["loans", id],
        queryFn: () => loansApi.getById(id!),
        enabled: Boolean(id),
    });
}