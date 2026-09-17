import { useMutation, useQueryClient } from "@tanstack/react-query";
import { complaintsApi } from "../api/complaints-api";
import type { CreateComplaintRequest } from "../types/complaint";

export function useCreateComplaint() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateComplaintRequest) =>
        complaintsApi.create(request),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["complaints", "my"],
      });
    },
  });
}