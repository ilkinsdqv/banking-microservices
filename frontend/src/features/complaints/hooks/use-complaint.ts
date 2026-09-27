import { useQuery } from "@tanstack/react-query";

import { complaintsApi } from "../api/complaints-api";

export function useComplaint(id: string | undefined) {
    return useQuery({
        queryKey: ["complaints", id],
        queryFn: () => complaintsApi.getById(id!),
        enabled: Boolean(id),
    });
}