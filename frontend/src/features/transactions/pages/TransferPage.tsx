import { useNavigate } from "react-router";

import TransferForm from "../components/TransferForm";

function TransferPage() {
    const navigate = useNavigate();

    return (
        <div>
            <button
                type="button"
                onClick={() => navigate("/transactions")}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
                ← Back to transactions
            </button>

            <div className="mt-5">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Transfer money
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Send money from one of your accounts to another account.
                </p>
            </div>

            <div className="mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <TransferForm
                    onSuccess={() => navigate("/transactions")}
                    onCancel={() => navigate("/transactions")}
                />
            </div>
        </div>
    );
}

export default TransferPage;