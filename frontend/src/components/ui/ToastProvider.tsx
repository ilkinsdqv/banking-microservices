import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type PropsWithChildren,
} from "react";

import {
    Toast,
    type ToastVariant,
} from "./Toast";

interface ToastItem {
    id: string;
    title: string;
    description?: string;
    variant: ToastVariant;
}

interface ToastContextValue {
    showToast: (
        title: string,
        options?: {
            description?: string;
            variant?: ToastVariant;
            duration?: number;
        },
    ) => void;
    success: (
        title: string,
        description?: string,
    ) => void;
    error: (
        title: string,
        description?: string,
    ) => void;
    warning: (
        title: string,
        description?: string,
    ) => void;
    info: (
        title: string,
        description?: string,
    ) => void;
}

const ToastContext =
    createContext<ToastContextValue | null>(null);

export function ToastProvider({
                                  children,
                              }: PropsWithChildren) {
    const [toasts, setToasts] = useState<ToastItem[]>(
        [],
    );

    const removeToast = useCallback(
        (id: string) => {
            setToasts((current) =>
                current.filter(
                    (toast) => toast.id !== id,
                ),
            );
        },
        [],
    );

    const showToast = useCallback(
        (
            title: string,
            options: {
                description?: string;
                variant?: ToastVariant;
                duration?: number;
            } = {},
        ) => {
            const id = crypto.randomUUID();

            const toast: ToastItem = {
                id,
                title,
                description: options.description,
                variant: options.variant ?? "info",
            };

            setToasts((current) => [
                ...current,
                toast,
            ]);

            const duration =
                options.duration ?? 4000;

            window.setTimeout(() => {
                removeToast(id);
            }, duration);
        },
        [removeToast],
    );

    const success = useCallback(
        (
            title: string,
            description?: string,
        ) => {
            showToast(title, {
                description,
                variant: "success",
            });
        },
        [showToast],
    );

    const error = useCallback(
        (
            title: string,
            description?: string,
        ) => {
            showToast(title, {
                description,
                variant: "error",
            });
        },
        [showToast],
    );

    const warning = useCallback(
        (
            title: string,
            description?: string,
        ) => {
            showToast(title, {
                description,
                variant: "warning",
            });
        },
        [showToast],
    );

    const info = useCallback(
        (
            title: string,
            description?: string,
        ) => {
            showToast(title, {
                description,
                variant: "info",
            });
        },
        [showToast],
    );

    const value = useMemo(
        () => ({
            showToast,
            success,
            error,
            warning,
            info,
        }),
        [
            showToast,
            success,
            error,
            warning,
            info,
        ],
    );

    return (
        <ToastContext.Provider value={value}>
            {children}

            <div className="pointer-events-none fixed right-4 top-4 z-[100] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className="pointer-events-auto"
                    >
                        <Toast
                            title={toast.title}
                            description={
                                toast.description
                            }
                            variant={toast.variant}
                            onClose={() =>
                                removeToast(toast.id)
                            }
                        />
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);

    if (!context) {
        throw new Error(
            "useToast must be used within ToastProvider",
        );
    }

    return context;
}