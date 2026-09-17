import { useQuery } from "@tanstack/react-query";

import { complaintsApi } from "../api/complaints-api";

export function useComplaints() {
    return useQuery({
        queryKey: ["complaints", "my"],
        queryFn: complaintsApi.getMyComplaints,
    });
}