import { useMutation, useQueryClient } from "@tanstack/react-query";
import { adminComplaintsApi } from "../api/admin-complaints-api";
import type { ResolveComplaintRequest } from "../api/admin-complaints-api";

export function useStartComplaint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            adminComplaintsApi.start(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "complaints"],
            });

            queryClient.invalidateQueries({
                queryKey: ["complaints"],
            });
        },
    });
}

export function useResolveComplaint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         id,
                         request,
                     }: {
            id: string;
            request: ResolveComplaintRequest;
        }) => adminComplaintsApi.resolve(id, request),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "complaints"],
            });

            queryClient.invalidateQueries({
                queryKey: ["complaints"],
            });
        },
    });
}

export function useCloseComplaint() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) =>
            adminComplaintsApi.close(id),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["admin", "complaints"],
            });

            queryClient.invalidateQueries({
                queryKey: ["complaints"],
            });
        },
    });
}