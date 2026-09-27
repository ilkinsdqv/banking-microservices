import type {
    InputHTMLAttributes,
    ReactNode,
} from "react";

interface InputProps
    extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    leftElement?: ReactNode;
    rightElement?: ReactNode;
}

export function Input({
                          label,
                          error,
                          hint,
                          leftElement,
                          rightElement,
                          className = "",
                          id,
                          ...props
                      }: InputProps) {
    const inputId =
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
                    htmlFor={inputId}
                    className="block text-sm font-medium text-slate-700"
                >
                    {label}
                </label>
            )}

            <div className="relative">
                {leftElement && (
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                        {leftElement}
                    </div>
                )}

                <input
                    id={inputId}
                    className={[
                        "h-10 w-full rounded-lg border bg-white px-3",
                        "text-sm text-slate-900 shadow-sm",
                        "placeholder:text-slate-400",
                        "transition-colors",
                        "focus:border-slate-400 focus:outline-none",
                        "focus:ring-2 focus:ring-slate-200",
                        "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500",
                        error
                            ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                            : "border-slate-200",
                        leftElement ? "pl-10" : "",
                        rightElement ? "pr-10" : "",
                        className,
                    ].join(" ")}
                    aria-invalid={Boolean(error)}
                    aria-describedby={
                        error
                            ? `${inputId}-error`
                            : hint
                                ? `${inputId}-hint`
                                : undefined
                    }
                    {...props}
                />

                {rightElement && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400">
                        {rightElement}
                    </div>
                )}
            </div>

            {error && (
                <p
                    id={`${inputId}-error`}
                    className="text-xs text-red-600"
                >
                    {error}
                </p>
            )}

            {!error && hint && (
                <p
                    id={`${inputId}-hint`}
                    className="text-xs text-slate-500"
                >
                    {hint}
                </p>
            )}
        </div>
    );
}