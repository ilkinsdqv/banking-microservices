import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users-api";

export function useUser(id: string | undefined) {
    return useQuery({
        queryKey: ["users", id],
        queryFn: () => usersApi.getById(id!),
        enabled: Boolean(id),
    });
}