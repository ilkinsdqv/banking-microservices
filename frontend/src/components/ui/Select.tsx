import type {
    SelectHTMLAttributes,
} from "react";

interface SelectProps
    extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export function Select({
                           label,
                           error,
                           hint,
                           className = "",
                           id,
                           children,
                           ...props
                       }: SelectProps) {
    const selectId =
        id ??
        (label
            ? label
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "")
            : undefined);

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-sm font-medium text-slate-700"
                >
                    {label}
                </label>
            )}

            <select
                id={selectId}
                className={[
                    "h-10 w-full rounded-lg border bg-white px-3",
                    "text-sm text-slate-900 shadow-sm",
                    "transition-colors",
                    "focus:border-slate-400 focus:outline-none",
                    "focus:ring-2 focus:ring-slate-200",
                    "disabled:cursor-not-allowed disabled:bg-slate-50",
                    error
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200",
                    className,
                ].join(" ")}
                aria-invalid={Boolean(error)}
                aria-describedby={
                    error
                        ? `${selectId}-error`
                        : hint
                            ? `${selectId}-hint`
                            : undefined
                }
                {...props}
            >
                {children}
            </select>

            {error && (
                <p
                    id={`${selectId}-error`}
                    className="text-xs text-red-600"
                >
                    {error}
                </p>
            )}

            {!error && hint && (
                <p
                    id={`${selectId}-hint`}
                    className="text-xs text-slate-500"
                >
                    {hint}
                </p>
            )}
        </div>
    );
}