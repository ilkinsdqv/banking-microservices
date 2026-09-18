import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { usersApi } from "../api/users-api";
import type { UpdateUserRequest } from "../types/user";

export function useUpdateUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         id,
                         request,
                     }: {
            id: string;
            request: UpdateUserRequest;
        }) => usersApi.update(id, request),

        onSuccess: (user) => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "users"],
            });

            queryClient.setQueryData(
                ["users", user.id],
                user,
            );
        },
    });
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            usersApi.delete(id),

        onSuccess: (_, id) => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "users"],
            });

            queryClient.removeQueries({
                queryKey: ["users", id],
            });
        },
    });
}

export function useEnableUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            usersApi.enable(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "users"],
            });
        },
    });
}

export function useDisableUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            usersApi.disable(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "users"],
            });
        },
    });
}

export function useLockUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            usersApi.lock(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "users"],
            });
        },
    });
}

export function useUnlockUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            usersApi.unlock(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "users"],
            });
        },
    });
}