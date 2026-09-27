import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";
import { Button } from "./Button";

interface ConfirmDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: "primary" | "danger";
    loading?: boolean;
}

export function ConfirmDialog({
                                  open,
                                  onClose,
                                  onConfirm,
                                  title,
                                  description,
                                  confirmText = "Confirm",
                                  cancelText = "Cancel",
                                  variant = "primary",
                                  loading = false,
                              }: ConfirmDialogProps) {
    return (
        <Modal
            open={open}
            onClose={loading ? () => {} : onClose}
            title={title}
            size="sm"
            footer={
                <>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={loading}
                    >
                        {cancelText}
                    </Button>

                    <Button
                        variant={variant}
                        onClick={onConfirm}
                        loading={loading}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >
            <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                    <AlertTriangle
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                </div>

                <p className="text-sm leading-6 text-slate-600">
                    {description}
                </p>
            </div>
        </Modal>
    );
}