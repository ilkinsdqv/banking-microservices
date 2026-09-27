import type {
    TextareaHTMLAttributes,
} from "react";

interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export function Textarea({
                             label,
                             error,
                             hint,
                             className = "",
                             id,
                             ...props
                         }: TextareaProps) {
    const textareaId =
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
                    htmlFor={textareaId}
                    className="block text-sm font-medium text-slate-700"
                >
                    {label}
                </label>
            )}

            <textarea
                id={textareaId}
                className={[
                    "min-h-24 w-full resize-y rounded-lg border bg-white px-3 py-2.5",
                    "text-sm text-slate-900 shadow-sm",
                    "placeholder:text-slate-400",
                    "transition-colors",
                    "focus:border-slate-400 focus:outline-none",
                    "focus:ring-2 focus:ring-slate-200",
                    "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
                    error
                        ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                        : "border-slate-200",
                    className,
                ].join(" ")}
                aria-invalid={Boolean(error)}
                aria-describedby={
                    error
                        ? `${textareaId}-error`
                        : hint
                            ? `${textareaId}-hint`
                            : undefined
                }
                {...props}
            />

            {error && (
                <p
                    id={`${textareaId}-error`}
                    className="text-xs text-red-600"
                >
                    {error}
                </p>
            )}

            {!error && hint && (
                <p
                    id={`${textareaId}-hint`}
                    className="text-xs text-slate-500"
                >
                    {hint}
                </p>
            )}
        </div>
    );
}