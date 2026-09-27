import type { ReactNode } from "react";

interface BadgeProps {
    children: ReactNode;
    variant?:
        | "default"
        | "success"
        | "warning"
        | "danger"
        | "info"
        | "neutral";
    className?: string;
}

const variantClasses = {
    default:
        "bg-slate-900 text-white",
    success:
        "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
    warning:
        "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
    danger:
        "bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/20",
    info:
        "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20",
    neutral:
        "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-500/10",
};

export function Badge({
                          children,
                          variant = "default",
                          className = "",
                      }: BadgeProps) {
    return (
        <span
            className={[
                "inline-flex items-center rounded-full",
                "px-2.5 py-1 text-xs font-medium",
                "whitespace-nowrap",
                variantClasses[variant],
                className,
            ].join(" ")}
        >
            {children}
        </span>
    );
}