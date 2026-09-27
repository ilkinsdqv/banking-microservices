import type { Account } from "../types/account";
import CashInForm from "./CashInForm";

interface CashInModalProps {
    account: Account | null;
    onClose: () => void;
}

function CashInModal({
                         account,
                         onClose,
                     }: CashInModalProps) {
    if (!account) {
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
                aria-label="Cash in"
                className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
            >
                <CashInForm
                    account={account}
                    onSuccess={onClose}
                    onCancel={onClose}
                />
            </div>
        </div>
    );
}

export default CashInModal;