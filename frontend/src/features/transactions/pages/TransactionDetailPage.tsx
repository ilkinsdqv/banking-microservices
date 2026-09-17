import { useNavigate, useParams } from "react-router";

import { useTransaction } from "../hooks/use-transaction";

function TransactionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: transaction,
        isLoading,
        isError,
    } = useTransaction(id);

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    Loading transaction...
                </p>
            </div>
        );
    }

    if (isError || !transaction) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h2 className="text-base font-semibold text-red-800">
                    Transaction not found
                </h2>

                <p className="mt-1 text-sm text-red-600">
                    The transaction could not be loaded.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/transactions")}
                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                    Back to transactions
                </button>
            </div>
        );
    }

    const formattedAmount = new Intl.NumberFormat("az-AZ", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(transaction.amount);

    const createdAt = new Intl.DateTimeFormat("az-AZ", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(transaction.createdAt));

    const updatedAt = new Intl.DateTimeFormat("az-AZ", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(transaction.updatedAt));

    const typeLabels: Record<string, string> = {
        DEPOSIT: "Deposit",
        WITHDRAW: "Withdrawal",
        TRANSFER: "Transfer",
        LOAN_DISBURSEMENT: "Loan Disbursement",
    };

    const statusLabels: Record<string, string> = {
        PENDING: "Pending",
        COMPLETED: "Completed",
        FAILED: "Failed",
    };

    const statusClassName: Record<string, string> = {
        PENDING: "bg-amber-100 text-amber-700",
        COMPLETED: "bg-emerald-100 text-emerald-700",
        FAILED: "bg-red-100 text-red-700",
    };

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
                    Transaction details
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    View the details of this transaction.
                </p>
            </div>

            <div className="mt-6 max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-200 px-6 py-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Transaction amount</p>

                            <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                                {formattedAmount} {transaction.currency}
                            </p>
                        </div>

                        <span
                            className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                                statusClassName[transaction.status] ??
                                "bg-slate-100 text-slate-700"
                            }`}
                        >
              {statusLabels[transaction.status] ?? transaction.status}
            </span>
                    </div>
                </div>

                <div className="grid gap-x-8 gap-y-6 px-6 py-6 sm:grid-cols-2">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Type
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-900">
                            {typeLabels[transaction.type] ?? transaction.type}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Currency
                        </p>

                        <p className="mt-1 text-sm font-medium text-slate-900">
                            {transaction.currency}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            From account
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-slate-900">
                            {transaction.fromAccountId ?? "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            To account
                        </p>

                        <p className="mt-1 break-all text-sm font-medium text-slate-900">
                            {transaction.toAccountId ?? "—"}
                        </p>
                    </div>

                    <div className="sm:col-span-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Description
                        </p>

                        <p className="mt-1 text-sm text-slate-900">
                            {transaction.description || "No description"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Created
                        </p>

                        <p className="mt-1 text-sm text-slate-900">
                            {createdAt}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Last updated
                        </p>

                        <p className="mt-1 text-sm text-slate-900">
                            {updatedAt}
                        </p>
                    </div>

                    <div className="sm:col-span-2">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Transaction ID
                        </p>

                        <p className="mt-1 break-all font-mono text-xs text-slate-600">
                            {transaction.id}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionDetailPage;