import type { PropsWithChildren } from "react";
import { QueryClientProvider } from "@tanstack/react-query";

import { AuthProvider } from "../../features/auth/hooks/AuthContext";
import { queryClient } from "../../lib/query-client";
import { ToastProvider } from "../../components/ui/ToastProvider";

export function AppProviders({
                                 children,
                             }: PropsWithChildren) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ToastProvider>
                    {children}
                </ToastProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}