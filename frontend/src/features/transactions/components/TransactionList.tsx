import {
    ArrowDownLeft,
    ArrowLeftRight,
    ArrowUpRight,
    Banknote,
    ChevronRight,
    CircleDollarSign,
    ReceiptText,
} from "lucide-react";
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
        const formatter = new Intl.NumberFormat(
            "az-AZ",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            },
        );

        const sign =
            transaction.type === "DEPOSIT" ||
            transaction.type ===
            "LOAN_DISBURSEMENT"
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

    const getTransactionIcon = (
        transaction: Transaction,
    ) => {
        switch (transaction.type) {
            case "DEPOSIT":
                return ArrowDownLeft;

            case "WITHDRAW":
                return ArrowUpRight;

            case "TRANSFER":
                return ArrowLeftRight;

            case "LOAN_DISBURSEMENT":
                return Banknote;

            default:
                return ReceiptText;
        }
    };

    const getIconStyle = (
        transaction: Transaction,
    ) => {
        switch (transaction.type) {
            case "DEPOSIT":
            case "LOAN_DISBURSEMENT":
                return {
                    container:
                        "bg-emerald-50 text-emerald-600",
                    amount: "text-emerald-600",
                };

            case "WITHDRAW":
                return {
                    container:
                        "bg-amber-50 text-amber-600",
                    amount: "text-amber-600",
                };

            case "TRANSFER":
                return {
                    container:
                        "bg-indigo-50 text-indigo-600",
                    amount: "text-slate-950",
                };

            default:
                return {
                    container:
                        "bg-slate-100 text-slate-600",
                    amount: "text-slate-950",
                };
        }
    };

    if (transactions.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                    <ReceiptText
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                </div>

                <h2 className="mt-4 text-base font-semibold text-slate-950">
                    No transactions yet
                </h2>

                <p className="mx-auto mt-1 max-w-sm text-sm leading-5 text-slate-500">
                    Your transactions will appear here
                    once you start using your accounts.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden">
            <div className="hidden border-b border-slate-100 px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(120px,0.8fr)_minmax(150px,0.9fr)_auto_20px] md:items-center md:gap-4">
                <span>Description</span>
                <span>Type</span>
                <span>Date</span>
                <span className="text-right">
                    Amount
                </span>
                <span />
            </div>

            <div className="divide-y divide-slate-100">
                {transactions.map((transaction) => {
                    const Icon =
                        getTransactionIcon(
                            transaction,
                        );

                    const style =
                        getIconStyle(transaction);

                    return (
                        <button
                            key={transaction.id}
                            type="button"
                            onClick={() =>
                                navigate(
                                    `/transactions/${transaction.id}`,
                                )
                            }
                            className="group block w-full px-4 py-4 text-left transition-colors hover:bg-slate-50/80 md:grid md:grid-cols-[minmax(0,1.6fr)_minmax(120px,0.8fr)_minmax(150px,0.9fr)_auto_20px] md:items-center md:gap-4"
                        >
                            <div className="flex min-w-0 items-center gap-3">
                                <div
                                    className={[
                                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                                        style.container,
                                    ].join(" ")}
                                >
                                    <Icon
                                        className="h-4.5 w-4.5"
                                        aria-hidden="true"
                                    />
                                </div>

                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-slate-900">
                                        {getDescription(
                                            transaction,
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400 md:hidden">
                                        {transaction.type}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-3 md:mt-0">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
                                    <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                                    {transaction.type}
                                </span>
                            </div>

                            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500 md:mt-0 md:text-sm">
                                <CircleDollarSign
                                    className="h-3.5 w-3.5 text-slate-400 md:hidden"
                                    aria-hidden="true"
                                />
                                {formatDate(
                                    transaction.createdAt,
                                )}
                            </div>

                            <p
                                className={[
                                    "mt-3 text-sm font-bold md:mt-0 md:text-right",
                                    style.amount,
                                ].join(" ")}
                            >
                                {formatAmount(
                                    transaction,
                                )}
                            </p>

                            <ChevronRight
                                className="hidden h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-slate-500 md:block"
                                aria-hidden="true"
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default TransactionList;