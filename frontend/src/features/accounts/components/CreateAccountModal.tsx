import type { ReactNode } from "react";

interface CreateAccountModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
}

function CreateAccountModal({
                                open,
                                onClose,
                                children,
                            }: CreateAccountModalProps) {
    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"
            role="presentation"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Create account"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
                {children}
            </div>
        </div>
    );
}

export default CreateAccountModal;