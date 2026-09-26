import {
    ArrowDownLeft,
    ArrowLeft,
    ArrowLeftRight,
    ArrowUpRight,
    Banknote,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Copy,
    FileText,
    ReceiptText,
    WalletCards,
    XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

import {
    Button,
    ErrorState,
    Skeleton,
} from "../../../components/ui";
import { useTransaction } from "../hooks/use-transaction";

function TransactionDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: transaction,
        isLoading,
        isError,
        refetch,
    } = useTransaction(id);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton
                    width="170px"
                    height="20px"
                />

                <div className="max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    <div className="bg-slate-950 p-8">
                        <Skeleton
                            width="150px"
                            height="16px"
                            className="bg-white/10"
                        />

                        <Skeleton
                            width="280px"
                            height="48px"
                            className="mt-4 bg-white/10"
                        />
                    </div>

                    <div className="grid gap-6 p-6 sm:grid-cols-2">
                        {[1, 2, 3, 4, 5, 6].map(
                            (item) => (
                                <Skeleton
                                    key={item}
                                    height="56px"
                                />
                            ),
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !transaction) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() =>
                        navigate("/transactions")
                    }
                >
                    <ArrowLeft
                        className="h-4 w-4"
                        aria-hidden="true"
                    />
                    Back to transactions
                </Button>

                <ErrorState
                    title="Transaction not found"
                    description="The transaction could not be loaded."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    const formattedAmount =
        new Intl.NumberFormat("az-AZ", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(transaction.amount);

    const createdAt = new Intl.DateTimeFormat(
        "az-AZ",
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    ).format(new Date(transaction.createdAt));

    const updatedAt = new Intl.DateTimeFormat(
        "az-AZ",
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    ).format(new Date(transaction.updatedAt));

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

    const getTransactionIcon = () => {
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

    const getStatusIcon = () => {
        switch (transaction.status) {
            case "COMPLETED":
                return CheckCircle2;

            case "FAILED":
                return XCircle;

            default:
                return Clock3;
        }
    };

    const getAmountColor = () => {
        if (
            transaction.type === "DEPOSIT" ||
            transaction.type ===
            "LOAN_DISBURSEMENT"
        ) {
            return "text-emerald-400";
        }

        if (transaction.type === "WITHDRAW") {
            return "text-amber-400";
        }

        return "text-white";
    };

    const getStatusStyle = () => {
        switch (transaction.status) {
            case "COMPLETED":
                return "bg-emerald-400/10 text-emerald-300 ring-emerald-400/20";

            case "FAILED":
                return "bg-red-400/10 text-red-300 ring-red-400/20";

            default:
                return "bg-amber-400/10 text-amber-300 ring-amber-400/20";
        }
    };

    const TransactionIcon =
        getTransactionIcon();
    const StatusIcon = getStatusIcon();

    const handleCopyId = async () => {
        await navigator.clipboard.writeText(
            transaction.id,
        );
    };

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={() =>
                    navigate("/transactions")
                }
                className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950"
            >
                <ArrowLeft
                    className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                    aria-hidden="true"
                />
                Back to transactions
            </button>

            <div className="max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10">
                    <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/4 -translate-y-1/4 rounded-full bg-indigo-500/10 blur-3xl" />

                    <div className="relative">
                        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                                    <TransactionIcon
                                        className="h-5 w-5"
                                        aria-hidden="true"
                                    />
                                </div>

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Transaction
                                    </p>

                                    <h1 className="mt-1 text-xl font-semibold tracking-tight">
                                        {typeLabels[
                                                transaction
                                                    .type
                                                ] ??
                                            transaction.type}
                                    </h1>

                                    <p className="mt-1 text-sm text-slate-400">
                                        {createdAt}
                                    </p>
                                </div>
                            </div>

                            <span
                                className={[
                                    "inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ring-1",
                                    getStatusStyle(),
                                ].join(" ")}
                            >
                                <StatusIcon
                                    className="h-3.5 w-3.5"
                                    aria-hidden="true"
                                />
                                {statusLabels[
                                        transaction.status
                                        ] ??
                                    transaction.status}
                            </span>
                        </div>

                        <div className="mt-10">
                            <p className="text-sm text-slate-400">
                                Transaction amount
                            </p>

                            <p
                                className={[
                                    "mt-1 text-4xl font-bold tracking-tight sm:text-5xl",
                                    getAmountColor(),
                                ].join(" ")}
                            >
                                {formattedAmount}{" "}
                                <span className="text-base font-semibold text-slate-400">
                                    {transaction.currency}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 p-6 sm:grid-cols-2 sm:p-8">
                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <ReceiptText
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Type
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {typeLabels[
                                        transaction.type
                                        ] ??
                                    transaction.type}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <WalletCards
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Currency
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {transaction.currency}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <ArrowUpRight
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                From account
                            </p>

                            <p className="mt-1 break-all font-mono text-xs font-medium text-slate-800">
                                {transaction.fromAccountId ??
                                    "—"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <ArrowDownLeft
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                To account
                            </p>

                            <p className="mt-1 break-all font-mono text-xs font-medium text-slate-800">
                                {transaction.toAccountId ??
                                    "—"}
                            </p>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <div className="rounded-2xl bg-slate-50 p-5">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                                    <FileText
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                </div>

                                <p className="text-sm font-semibold text-slate-900">
                                    Description
                                </p>
                            </div>

                            <p className="mt-4 text-sm leading-6 text-slate-600">
                                {transaction.description ||
                                    "No description"}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <CalendarDays
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Created
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {createdAt}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                            <Clock3
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Last updated
                            </p>

                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                {updatedAt}
                            </p>
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
                            <div className="min-w-0">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                    Transaction ID
                                </p>

                                <p className="mt-1 truncate font-mono text-xs text-slate-600">
                                    {transaction.id}
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleCopyId}
                                aria-label="Copy transaction ID"
                                className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                            >
                                <Copy
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TransactionDetailPage;