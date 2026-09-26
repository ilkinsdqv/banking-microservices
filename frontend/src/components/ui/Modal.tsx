import {
    useEffect,
    type ReactNode,
} from "react";
import { X } from "lucide-react";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    size?: "sm" | "md" | "lg" | "xl";
}

const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
};

export function Modal({
                          open,
                          onClose,
                          title,
                          description,
                          children,
                          footer,
                          size = "md",
                      }: ModalProps) {
    useEffect(() => {
        if (!open) {
            return;
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown,
        );

        const originalOverflow =
            document.body.style.overflow;

        document.body.style.overflow = "hidden";

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown,
            );

            document.body.style.overflow =
                originalOverflow;
        };
    }, [open, onClose]);

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <button
                type="button"
                aria-label="Close modal"
                className="absolute inset-0 cursor-default bg-slate-950/50 backdrop-blur-sm"
                onClick={onClose}
            />

            <div
                className={[
                    "relative w-full",
                    sizeClasses[size],
                    "overflow-hidden rounded-2xl",
                    "border border-slate-200",
                    "bg-white shadow-2xl",
                ].join(" ")}
            >
                <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
                    <div className="pr-8">
                        <h2
                            id="modal-title"
                            className="text-lg font-semibold text-slate-900"
                        >
                            {title}
                        </h2>

                        {description && (
                            <p className="mt-1 text-sm text-slate-500">
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                        <X
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    </button>
                </div>

                <div className="max-h-[70vh] overflow-y-auto px-5 py-5">
                    {children}
                </div>

                {footer && (
                    <div className="flex flex-col-reverse gap-2 border-t border-slate-100 bg-slate-50/50 px-5 py-4 sm:flex-row sm:justify-end">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}