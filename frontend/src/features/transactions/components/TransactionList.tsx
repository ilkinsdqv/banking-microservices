import { useNavigate } from "react-router";

import type { Transaction } from "../types/transaction";

interface TransactionListProps {
    transactions: Transaction[];
}

function TransactionList({
                             transactions,
                         }: TransactionListProps) {
    const navigate = useNavigate();

    const formatAmount = (
        transaction: Transaction,
    ) => {
        const formatter = new Intl.NumberFormat("az-AZ", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        });

        const sign =
            transaction.type === "DEPOSIT" ||
            transaction.type === "LOAN_DISBURSEMENT"
                ? "+"
                : transaction.type === "WITHDRAW"
                    ? "-"
                    : "";

        return `${sign}${formatter.format(transaction.amount)} ${transaction.currency}`;
    };

    const formatDate = (date: string) =>
        new Intl.DateTimeFormat("az-AZ", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(date));

    const getDescription = (
        transaction: Transaction,
    ) => {
        if (transaction.description) {
            return transaction.description;
        }

        switch (transaction.type) {
            case "DEPOSIT":
                return "Deposit";

            case "WITHDRAW":
                return "Withdrawal";

            case "TRANSFER":
                return "Transfer";

            case "LOAN_DISBURSEMENT":
                return "Loan disbursement";

            default:
                return "Transaction";
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                <h2 className="text-lg font-semibold text-slate-900">
                    No transactions yet
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Your transactions will appear here once you start
                    using your accounts.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="hidden border-b border-slate-100 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400 md:grid md:grid-cols-[1.5fr_1fr_1fr_auto] md:gap-4">
                <span>Description</span>
                <span>Type</span>
                <span>Date</span>
                <span className="text-right">Amount</span>
            </div>

            <div className="divide-y divide-slate-100">
                {transactions.map((transaction) => (
                    <button
                        key={transaction.id}
                        type="button"
                        onClick={() =>
                            navigate(`/transactions/${transaction.id}`)
                        }
                        className="block w-full px-5 py-4 text-left transition hover:bg-slate-50 md:grid md:grid-cols-[1.5fr_1fr_1fr_auto] md:items-center md:gap-4"
                    >
                        <div>
                            <p className="text-sm font-medium text-slate-900">
                                {getDescription(transaction)}
                            </p>

                            <p className="mt-1 text-xs text-slate-400 md:hidden">
                                {transaction.type}
                            </p>
                        </div>

                        <div className="mt-2 md:mt-0">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {transaction.type}
              </span>
                        </div>

                        <p className="mt-3 text-xs text-slate-500 md:mt-0 md:text-sm">
                            {formatDate(transaction.createdAt)}
                        </p>

                        <p className="mt-3 text-sm font-semibold text-slate-900 md:mt-0 md:text-right">
                            {formatAmount(transaction)}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}

export default TransactionList;