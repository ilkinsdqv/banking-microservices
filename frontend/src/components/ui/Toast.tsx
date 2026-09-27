import {
    CheckCircle2,
    Info,
    TriangleAlert,
    X,
} from "lucide-react";
import type { ReactNode } from "react";

export type ToastVariant =
    | "success"
    | "error"
    | "warning"
    | "info";

interface ToastProps {
    title: string;
    description?: string;
    variant?: ToastVariant;
    action?: ReactNode;
    onClose?: () => void;
}

const variantConfig = {
    success: {
        icon: CheckCircle2,
        container:
            "border-emerald-200 bg-emerald-50",
        iconColor: "text-emerald-600",
        titleColor: "text-emerald-900",
        descriptionColor: "text-emerald-700",
    },
    error: {
        icon: TriangleAlert,
        container: "border-red-200 bg-red-50",
        iconColor: "text-red-600",
        titleColor: "text-red-900",
        descriptionColor: "text-red-700",
    },
    warning: {
        icon: TriangleAlert,
        container: "border-amber-200 bg-amber-50",
        iconColor: "text-amber-600",
        titleColor: "text-amber-900",
        descriptionColor: "text-amber-700",
    },
    info: {
        icon: Info,
        container: "border-blue-200 bg-blue-50",
        iconColor: "text-blue-600",
        titleColor: "text-blue-900",
        descriptionColor: "text-blue-700",
    },
};

export function Toast({
                          title,
                          description,
                          variant = "info",
                          action,
                          onClose,
                      }: ToastProps) {
    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
        <div
            role="status"
            className={[
                "flex w-full max-w-sm items-start gap-3",
                "rounded-xl border p-4 shadow-lg",
                "animate-in fade-in slide-in-from-right-4",
                config.container,
            ].join(" ")}
        >
            <Icon
                className={[
                    "mt-0.5 h-5 w-5 shrink-0",
                    config.iconColor,
                ].join(" ")}
                aria-hidden="true"
            />

            <div className="min-w-0 flex-1">
                <p
                    className={[
                        "text-sm font-semibold",
                        config.titleColor,
                    ].join(" ")}
                >
                    {title}
                </p>

                {description && (
                    <p
                        className={[
                            "mt-1 text-sm",
                            config.descriptionColor,
                        ].join(" ")}
                    >
                        {description}
                    </p>
                )}

                {action && (
                    <div className="mt-3">
                        {action}
                    </div>
                )}
            </div>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close notification"
                    className={[
                        "rounded-md p-1 transition-colors",
                        config.iconColor,
                        "hover:bg-black/5",
                    ].join(" ")}
                >
                    <X
                        className="h-4 w-4"
                        aria-hidden="true"
                    />
                </button>
            )}
        </div>
    );
}