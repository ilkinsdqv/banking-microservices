import type {
    ButtonHTMLAttributes,
    ReactNode,
} from "react";

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?:
        | "primary"
        | "secondary"
        | "outline"
        | "ghost"
        | "danger";
    size?: "sm" | "md" | "lg";
    loading?: boolean;
}

const variantClasses = {
    primary:
        "bg-slate-900 text-white hover:bg-slate-800",
    secondary:
        "bg-slate-100 text-slate-900 hover:bg-slate-200",
    outline:
        "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
    ghost:
        "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
    danger:
        "bg-red-600 text-white hover:bg-red-700",
};

const sizeClasses = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
};

export function Button({
                           children,
                           variant = "primary",
                           size = "md",
                           loading = false,
                           disabled,
                           className = "",
                           ...props
                       }: ButtonProps) {
    return (
        <button
            type="button"
            disabled={disabled || loading}
            className={[
                "inline-flex items-center justify-center gap-2 rounded-lg",
                "font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2",
                "focus-visible:ring-slate-400 focus-visible:ring-offset-2",
                "disabled:pointer-events-none disabled:opacity-50",
                variantClasses[variant],
                sizeClasses[size],
                className,
            ].join(" ")}
            {...props}
        >
            {loading && (
                <span
                    className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
                    aria-hidden="true"
                />
            )}

            {children}
        </button>
    );
}