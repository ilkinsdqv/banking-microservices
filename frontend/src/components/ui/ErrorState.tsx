import { AlertCircle, RefreshCw } from "lucide-react";
import type { ReactNode } from "react";

interface ErrorStateProps {
    title?: string;
    description?: string;
    onRetry?: () => void;
    action?: ReactNode;
    className?: string;
}

export function ErrorState({
                               title = "Something went wrong",
                               description = "We couldn't load this information. Please try again.",
                               onRetry,
                               action,
                               className = "",
                           }: ErrorStateProps) {
    return (
        <div
            role="alert"
            className={[
                "flex min-h-[240px] flex-col items-center",
                "justify-center rounded-xl border border-red-200",
                "bg-red-50/50 px-6 py-10 text-center",
                className,
            ].join(" ")}
        >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle
                    className="h-6 w-6"
                    aria-hidden="true"
                />
            </div>

            <h3 className="text-base font-semibold text-slate-900">
                {title}
            </h3>

            <p className="mt-1 max-w-md text-sm text-slate-500">
                {description}
            </p>

            {(onRetry || action) && (
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                    {onRetry && (
                        <button
                            type="button"
                            onClick={onRetry}
                            className="inline-flex h-9 items-center gap-2 rounded-lg bg-slate-900 px-4 text-sm font-medium text-white transition-colors hover:bg-slate-800"
                        >
                            <RefreshCw
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                            Try again
                        </button>
                    )}

                    {action}
                </div>
            )}
        </div>
    );
}