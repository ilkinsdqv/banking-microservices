import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users-api";

interface UseUsersParams {
    page: number;
    size: number;
}

export function useUsers({
                             page,
                             size,
                         }: UseUsersParams) {
    return useQuery({
        queryKey: ["admin", "users", page, size],

        queryFn: () =>
            usersApi.getAll({
                page,
                size,
                sort: "createdAt,desc",
            }),

        placeholderData: (previousData) =>
            previousData,
    });
}