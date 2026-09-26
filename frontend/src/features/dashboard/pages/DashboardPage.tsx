import { useNavigate } from "react-router";
import {
    ArrowDownLeft,
    ArrowLeftRight,
    ArrowUpRight,
    Banknote,
    CalendarDays,
    ChevronRight,
    CircleAlert,
    CreditCard,
    Landmark,
    MessageSquare,
    Plus,
    ReceiptText,
    RefreshCw,
    Wallet,
} from "lucide-react";

import { useAuth } from "../../auth/hooks/use-auth";
import { useAccounts } from "../../accounts/hooks/use-accounts";
import { useUserTransactions } from "../../transactions/hooks/use-user-transactions";
import { useLoans } from "../../loans/hooks/use-loans";
import { useComplaints } from "../../complaints/hooks/use-complaints";

import type { Account } from "../../accounts/types/account";
import type { Transaction } from "../../transactions/types/transaction";
import type { Loan } from "../../loans/types/loan";
import type { Complaint } from "../../complaints/types/complaint";

function formatMoney(
    amount: number,
    currency: string,
) {
    return `${new Intl.NumberFormat("az-AZ", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)} ${currency}`;
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("az-AZ", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(date));
}

function formatTime(date: string) {
    return new Intl.DateTimeFormat("az-AZ", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));
}

function getGreeting() {
    const hour = new Date().getHours();

    if (hour < 5) {
        return "Good night";
    }

    if (hour < 12) {
        return "Good morning";
    }

    if (hour < 18) {
        return "Good afternoon";
    }

    return "Good evening";
}

function getTransactionLabel(
    transaction: Transaction,
) {
    if (transaction.description) {
        return transaction.description;
    }

    switch (transaction.type) {
        case "DEPOSIT":
            return "Cash deposit";

        case "WITHDRAW":
            return "Cash withdrawal";

        case "TRANSFER":
            return "Money transfer";

        case "LOAN_DISBURSEMENT":
            return "Loan disbursement";

        default:
            return "Transaction";
    }
}

function getTransactionIcon(
    transaction: Transaction,
) {
    switch (transaction.type) {
        case "DEPOSIT":
            return (
                <ArrowDownLeft className="h-5 w-5" />
            );

        case "WITHDRAW":
            return (
                <ArrowUpRight className="h-5 w-5" />
            );

        case "TRANSFER":
            return (
                <ArrowLeftRight className="h-5 w-5" />
            );

        case "LOAN_DISBURSEMENT":
            return (
                <Banknote className="h-5 w-5" />
            );

        default:
            return (
                <ReceiptText className="h-5 w-5" />
            );
    }
}

function getTransactionIconClass(
    transaction: Transaction,
) {
    switch (transaction.type) {
        case "DEPOSIT":
        case "LOAN_DISBURSEMENT":
            return "bg-emerald-50 text-emerald-600";

        case "WITHDRAW":
            return "bg-rose-50 text-rose-600";

        case "TRANSFER":
            return "bg-indigo-50 text-indigo-600";

        default:
            return "bg-slate-100 text-slate-600";
    }
}

function getTransactionAmountClass(
    transaction: Transaction,
) {
    switch (transaction.type) {
        case "DEPOSIT":
        case "LOAN_DISBURSEMENT":
            return "text-emerald-600";

        case "WITHDRAW":
            return "text-rose-600";

        default:
            return "text-slate-900";
    }
}

function getStatusClass(status: string) {
    switch (status) {
        case "ACTIVE":
        case "COMPLETED":
        case "RESOLVED":
            return "bg-emerald-50 text-emerald-700";

        case "APPROVED":
        case "IN_PROGRESS":
            return "bg-blue-50 text-blue-700";

        case "PENDING":
        case "OPEN":
            return "bg-amber-50 text-amber-700";

        case "FAILED":
        case "REJECTED":
        case "CLOSED":
            return "bg-rose-50 text-rose-700";

        default:
            return "bg-slate-100 text-slate-600";
    }
}

function getStatusLabel(status: string) {
    switch (status) {
        case "IN_PROGRESS":
            return "In progress";

        case "LOAN_DISBURSEMENT":
            return "Loan disbursement";

        default:
            return status
                .toLowerCase()
                .replaceAll("_", " ")
                .replace(/\b\w/g, (char) =>
                    char.toUpperCase(),
                );
    }
}

function SkeletonBlock({
                           className = "",
                       }: {
    className?: string;
}) {
    return (
        <div
            className={`animate-pulse rounded-2xl bg-slate-200 ${className}`}
        />
    );
}

function SectionHeader({
                           title,
                           description,
                           actionLabel,
                           onAction,
                       }: {
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
}) {
    return (
        <div className="flex items-end justify-between gap-4">
            <div>
                <h2 className="text-base font-semibold tracking-tight text-slate-900">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1 text-sm text-slate-500">
                        {description}
                    </p>
                )}
            </div>

            {actionLabel && onAction && (
                <button
                    type="button"
                    onClick={onAction}
                    className="hidden items-center gap-1 text-sm font-semibold text-slate-600 transition hover:text-slate-950 sm:flex"
                >
                    {actionLabel}

                    <ChevronRight className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}

function AccountMiniCard({
                             account,
                             onClick,
                         }: {
    account: Account;
    onClick: () => void;
}) {
    const isSavings = account.type === "SAVINGS";

    return (
        <button
            type="button"
            onClick={onClick}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)]"
        >
            <div className="absolute right-0 top-0 h-24 w-24 translate-x-8 -translate-y-8 rounded-full bg-indigo-50 transition duration-300 group-hover:scale-125" />

            <div className="relative">
                <div className="flex items-center justify-between">
                    <div
                        className={[
                            "flex h-10 w-10 items-center justify-center rounded-xl",
                            isSavings
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-indigo-50 text-indigo-600",
                        ].join(" ")}
                    >
                        {isSavings ? (
                            <Wallet className="h-5 w-5" />
                        ) : (
                            <Landmark className="h-5 w-5" />
                        )}
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                </div>

                <div className="mt-5">
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900">
                            {isSavings
                                ? "Savings account"
                                : "Checking account"}
                        </p>

                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                            {account.currency}
                        </span>
                    </div>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
                        {formatMoney(
                            account.balance,
                            account.currency,
                        )}
                    </p>

                    <p className="mt-3 font-mono text-xs tracking-wide text-slate-400">
                        {account.iban}
                    </p>
                </div>
            </div>
        </button>
    );
}

function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        data: accounts,
        isLoading: isAccountsLoading,
        isError: isAccountsError,
        refetch: refetchAccounts,
    } = useAccounts(user?.id ?? null);

    const {
        transactions = [],
        isLoading: isTransactionsLoading,
        isError: isTransactionsError,
    } = useUserTransactions(accounts);

    const {
        data: loans,
        isLoading: isLoansLoading,
        isError: isLoansError,
    } = useLoans();

    const {
        data: complaints,
        isLoading: isComplaintsLoading,
        isError: isComplaintsError,
    } = useComplaints();

    const accountList = accounts ?? [];
    const loanList = loans ?? [];
    const complaintList = complaints ?? [];

    const currencyBalances = accountList.reduce<
        Record<string, number>
    >((result, account) => {
        result[account.currency] =
            (result[account.currency] ?? 0) +
            account.balance;

        return result;
    }, {});

    const currencies = Object.entries(
        currencyBalances,
    ).sort(([currencyA], [currencyB]) =>
        currencyA.localeCompare(currencyB),
    );

    const hasSingleCurrency =
        currencies.length === 1;

    const activeLoans = loanList.filter(
        (loan: Loan) =>
            loan.status === "ACTIVE",
    );

    const pendingLoans = loanList.filter(
        (loan: Loan) =>
            loan.status === "PENDING",
    );

    const openComplaints = complaintList.filter(
        (complaint: Complaint) =>
            complaint.status === "OPEN" ||
            complaint.status === "IN_PROGRESS",
    );

    const recentTransactions = [
        ...transactions,
    ]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        )
        .slice(0, 5);

    const recentComplaints = [
        ...complaintList,
    ]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        )
        .slice(0, 4);

    const recentLoans = [
        ...loanList,
    ]
        .sort(
            (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime(),
        )
        .slice(0, 3);

    const monthlyPayments = activeLoans.reduce<
        Record<string, number>
    >((result, loan) => {
        result[loan.currency] =
            (result[loan.currency] ?? 0) +
            loan.monthlyPayment;

        return result;
    }, {});

    const totalMonthlyPayments = Object.entries(
        monthlyPayments,
    );

    const anyLoading =
        isAccountsLoading ||
        isTransactionsLoading ||
        isLoansLoading ||
        isComplaintsLoading;

    if (anyLoading) {
        return (
            <div className="space-y-8">
                <div>
                    <SkeletonBlock className="h-4 w-28" />
                    <SkeletonBlock className="mt-3 h-9 w-64" />
                    <SkeletonBlock className="mt-2 h-4 w-80 max-w-full" />
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
                    <SkeletonBlock className="h-72" />
                    <div className="grid grid-cols-2 gap-4">
                        <SkeletonBlock className="h-32" />
                        <SkeletonBlock className="h-32" />
                        <SkeletonBlock className="h-32" />
                        <SkeletonBlock className="h-32" />
                    </div>
                </div>

                <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                    <SkeletonBlock className="h-80" />
                    <SkeletonBlock className="h-80" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-8">
            {/* Header */}
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-indigo-600">
                        {getGreeting()}
                    </p>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
                        Your financial overview
                    </h1>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                        Everything you need to manage your
                        accounts, money and financial commitments
                        in one place.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        void refetchAccounts();
                    }}
                    className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50"
                >
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                </button>
            </div>

            {/* Hero + Quick actions */}
            <div className="grid gap-5 lg:grid-cols-[1.7fr_1fr]">
                <section className="relative min-h-[290px] overflow-hidden rounded-[28px] bg-slate-950 p-7 text-white shadow-[0_20px_60px_rgba(15,23,42,0.18)] sm:p-9">
                    <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-indigo-500/20 blur-2xl" />
                    <div className="absolute -bottom-28 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

                    <div className="relative flex h-full flex-col justify-between">
                        <div className="flex items-start justify-between gap-6">
                            <div>
                                <p className="text-sm font-medium text-slate-400">
                                    Available balance
                                </p>

                                {isAccountsError ? (
                                    <div className="mt-4 flex items-center gap-2 text-sm text-rose-300">
                                        <CircleAlert className="h-4 w-4" />
                                        Balance unavailable
                                    </div>
                                ) : accountList.length === 0 ? (
                                    <p className="mt-4 text-3xl font-bold tracking-tight">
                                        No accounts yet
                                    </p>
                                ) : hasSingleCurrency ? (
                                    <p className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                                        {formatMoney(
                                            currencies[0][1],
                                            currencies[0][0],
                                        )}
                                    </p>
                                ) : (
                                    <p className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                                        Multi-currency
                                    </p>
                                )}

                                {accountList.length > 0 && (
                                    <p className="mt-2 text-sm text-slate-400">
                                        Across{" "}
                                        {accountList.length}{" "}
                                        {accountList.length === 1
                                            ? "account"
                                            : "accounts"}
                                    </p>
                                )}
                            </div>

                            <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/10 sm:flex">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                        </div>

                        <div className="mt-10">
                            {currencies.length > 0 && (
                                <div className="flex flex-wrap gap-3">
                                    {currencies.map(
                                        ([currency, balance]) => (
                                            <div
                                                key={currency}
                                                className="min-w-[130px] rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur"
                                            >
                                                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">
                                                    {currency}
                                                </p>

                                                <p className="mt-1 text-sm font-bold text-white">
                                                    {formatMoney(
                                                        balance,
                                                        currency,
                                                    )}
                                                </p>
                                            </div>
                                        ),
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)]">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                Quick actions
                            </p>

                            <h2 className="mt-1 text-lg font-bold text-slate-950">
                                What would you like to do?
                            </h2>
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/transactions/transfer",
                                )
                            }
                            className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-indigo-200 hover:bg-indigo-50"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                                <ArrowLeftRight className="h-5 w-5" />
                            </div>

                            <p className="mt-4 text-sm font-bold text-slate-900">
                                Transfer
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Send money
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/accounts")
                            }
                            className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-emerald-200 hover:bg-emerald-50"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                                <Plus className="h-5 w-5" />
                            </div>

                            <p className="mt-4 text-sm font-bold text-slate-900">
                                New account
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Open an account
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/loans/new")
                            }
                            className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-amber-200 hover:bg-amber-50"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                                <CreditCard className="h-5 w-5" />
                            </div>

                            <p className="mt-4 text-sm font-bold text-slate-900">
                                Apply for loan
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                Start application
                            </p>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/complaints/new")
                            }
                            className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 text-left transition hover:border-rose-200 hover:bg-rose-50"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                                <MessageSquare className="h-5 w-5" />
                            </div>

                            <p className="mt-4 text-sm font-bold text-slate-900">
                                Get support
                            </p>

                            <p className="mt-1 text-xs text-slate-500">
                                New complaint
                            </p>
                        </button>
                    </div>
                </section>
            </div>

            {/* KPI strip */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <button
                    type="button"
                    onClick={() => navigate("/accounts")}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Landmark className="h-5 w-5" />
                        </div>

                        <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                    </div>

                    <p className="mt-5 text-sm font-medium text-slate-500">
                        Bank accounts
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                        {accountList.length}
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/transactions")
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <ReceiptText className="h-5 w-5" />
                        </div>

                        <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                    </div>

                    <p className="mt-5 text-sm font-medium text-slate-500">
                        Transactions
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                        {transactions.length}
                    </p>
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/loans")}
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <CreditCard className="h-5 w-5" />
                        </div>

                        <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                    </div>

                    <p className="mt-5 text-sm font-medium text-slate-500">
                        Active loans
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                        {activeLoans.length}
                    </p>

                    {pendingLoans.length > 0 && (
                        <p className="mt-1 text-xs font-medium text-amber-600">
                            {pendingLoans.length} pending
                        </p>
                    )}
                </button>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/complaints")
                    }
                    className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                            <MessageSquare className="h-5 w-5" />
                        </div>

                        <ChevronRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                    </div>

                    <p className="mt-5 text-sm font-medium text-slate-500">
                        Open support cases
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight text-slate-950">
                        {openComplaints.length}
                    </p>
                </button>
            </div>

            {/* Accounts + Payments */}
            <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
                <section>
                    <SectionHeader
                        title="Your accounts"
                        description="Your most important balances at a glance."
                        actionLabel="View all"
                        onAction={() =>
                            navigate("/accounts")
                        }
                    />

                    {isAccountsError ? (
                        <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-5">
                            <div className="flex items-center gap-3 text-rose-700">
                                <CircleAlert className="h-5 w-5" />

                                <div>
                                    <p className="text-sm font-semibold">
                                        Accounts unavailable
                                    </p>

                                    <p className="mt-1 text-xs text-rose-600">
                                        Please refresh and try again.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : accountList.length === 0 ? (
                        <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white p-8">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                    <Landmark className="h-6 w-6" />
                                </div>

                                <h3 className="mt-4 text-base font-bold text-slate-900">
                                    Open your first account
                                </h3>

                                <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                                    Create a checking or savings
                                    account to start using your
                                    banking services.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/accounts")
                                    }
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    <Plus className="h-4 w-4" />
                                    Create account
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-4 grid gap-4 sm:grid-cols-2">
                            {accountList
                                .slice(0, 4)
                                .map((account) => (
                                    <AccountMiniCard
                                        key={account.id}
                                        account={account}
                                        onClick={() =>
                                            navigate(
                                                `/accounts/${account.id}`,
                                            )
                                        }
                                    />
                                ))}
                        </div>
                    )}
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                                Loan overview
                            </p>

                            <h2 className="mt-1 text-lg font-bold text-slate-950">
                                Monthly commitments
                            </h2>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <CalendarDays className="h-5 w-5" />
                        </div>
                    </div>

                    {isLoansError ? (
                        <div className="mt-6 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">
                            Loan information is currently
                            unavailable.
                        </div>
                    ) : activeLoans.length === 0 ? (
                        <div className="mt-6 rounded-xl bg-slate-50 p-5">
                            <p className="text-sm font-semibold text-slate-900">
                                No active loan payments
                            </p>

                            <p className="mt-1 text-sm leading-6 text-slate-500">
                                You currently have no active
                                loan commitments.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/loans/new")
                                }
                                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-slate-900 hover:text-indigo-600"
                            >
                                Apply for a loan
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="mt-6 space-y-3">
                            {totalMonthlyPayments.map(
                                ([currency, amount]) => (
                                    <div
                                        key={currency}
                                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-4"
                                    >
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                Monthly payment
                                            </p>

                                            <p className="mt-1 text-sm font-semibold text-slate-900">
                                                {activeLoans.length}{" "}
                                                active{" "}
                                                {activeLoans.length ===
                                                1
                                                    ? "loan"
                                                    : "loans"}
                                            </p>
                                        </div>

                                        <p className="text-lg font-bold text-slate-950">
                                            {formatMoney(
                                                amount,
                                                currency,
                                            )}
                                        </p>
                                    </div>
                                ),
                            )}

                            <div className="flex items-center gap-2 rounded-xl bg-indigo-50 px-4 py-3 text-xs leading-5 text-indigo-700">
                                <CalendarDays className="h-4 w-4 shrink-0" />
                                Monthly payment amounts are based
                                on your active loan schedules.
                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/loans")
                                }
                                className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                                View loan details

                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* Transactions + Complaints */}
            <div className="grid gap-6 xl:grid-cols-[1.45fr_0.85fr]">
                <section>
                    <SectionHeader
                        title="Recent activity"
                        description="Your latest account movements."
                        actionLabel="All transactions"
                        onAction={() =>
                            navigate("/transactions")
                        }
                    />

                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                        {isTransactionsError ? (
                            <div className="p-6">
                                <div className="flex items-center gap-3 text-rose-700">
                                    <CircleAlert className="h-5 w-5" />

                                    <div>
                                        <p className="text-sm font-semibold">
                                            Transactions unavailable
                                        </p>

                                        <p className="mt-1 text-xs text-rose-600">
                                            We couldn't load recent
                                            activity.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : recentTransactions.length ===
                        0 ? (
                            <div className="p-8 text-center">
                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    <ReceiptText className="h-5 w-5" />
                                </div>

                                <h3 className="mt-4 text-sm font-bold text-slate-900">
                                    No recent activity
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Your transactions will appear
                                    here.
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentTransactions.map(
                                    (transaction) => (
                                        <button
                                            key={transaction.id}
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/transactions/${transaction.id}`,
                                                )
                                            }
                                            className="group flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-slate-50"
                                        >
                                            <div
                                                className={[
                                                    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                                                    getTransactionIconClass(
                                                        transaction,
                                                    ),
                                                ].join(" ")}
                                            >
                                                {getTransactionIcon(
                                                    transaction,
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="truncate text-sm font-semibold text-slate-900">
                                                        {getTransactionLabel(
                                                            transaction,
                                                        )}
                                                    </p>

                                                    <span
                                                        className={[
                                                            "hidden rounded-full px-2 py-0.5 text-[10px] font-bold sm:inline-flex",
                                                            getStatusClass(
                                                                transaction.status,
                                                            ),
                                                        ].join(" ")}
                                                    >
                                                        {getStatusLabel(
                                                            transaction.status,
                                                        )}
                                                    </span>
                                                </div>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {formatDate(
                                                        transaction.createdAt,
                                                    )}{" "}
                                                    ·{" "}
                                                    {formatTime(
                                                        transaction.createdAt,
                                                    )}
                                                </p>
                                            </div>

                                            <div className="text-right">
                                                <p
                                                    className={[
                                                        "text-sm font-bold",
                                                        getTransactionAmountClass(
                                                            transaction,
                                                        ),
                                                    ].join(" ")}
                                                >
                                                    {transaction.type ===
                                                    "DEPOSIT" ||
                                                    transaction.type ===
                                                    "LOAN_DISBURSEMENT"
                                                        ? "+"
                                                        : transaction.type ===
                                                        "WITHDRAW"
                                                            ? "-"
                                                            : ""}
                                                    {formatMoney(
                                                        transaction.amount,
                                                        transaction.currency,
                                                    )}
                                                </p>

                                                <ChevronRight className="ml-auto mt-1 h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                                            </div>
                                        </button>
                                    ),
                                )}
                            </div>
                        )}

                        {recentTransactions.length > 0 && (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/transactions")
                                }
                                className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                                View all transactions
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </section>

                <section>
                    <SectionHeader
                        title="Support"
                        description="Your latest support requests."
                        actionLabel="View all"
                        onAction={() =>
                            navigate("/complaints")
                        }
                    />

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgba(15,23,42,0.04)]">
                        {isComplaintsError ? (
                            <div className="p-6">
                                <div className="flex items-center gap-3 text-rose-700">
                                    <CircleAlert className="h-5 w-5" />

                                    <div>
                                        <p className="text-sm font-semibold">
                                            Support unavailable
                                        </p>

                                        <p className="mt-1 text-xs text-rose-600">
                                            We couldn't load your
                                            support requests.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : recentComplaints.length ===
                        0 ? (
                            <div className="p-8 text-center">
                                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                                    <MessageSquare className="h-5 w-5" />
                                </div>

                                <h3 className="mt-4 text-sm font-bold text-slate-900">
                                    No support requests
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Need help? Create a complaint.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/complaints/new",
                                        )
                                    }
                                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                                >
                                    <Plus className="h-4 w-4" />
                                    New complaint
                                </button>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100">
                                {recentComplaints.map(
                                    (complaint) => (
                                        <button
                                            key={complaint.id}
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/complaints/${complaint.id}`,
                                                )
                                            }
                                            className="group flex w-full items-start gap-3 px-5 py-4 text-left transition hover:bg-slate-50"
                                        >
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                                                <MessageSquare className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-semibold text-slate-900">
                                                    {complaint.subject}
                                                </p>

                                                <p className="mt-1 text-xs text-slate-400">
                                                    {formatDate(
                                                        complaint.createdAt,
                                                    )}
                                                </p>

                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    <span
                                                        className={[
                                                            "rounded-full px-2 py-0.5 text-[10px] font-bold",
                                                            getStatusClass(
                                                                complaint.status,
                                                            ),
                                                        ].join(" ")}
                                                    >
                                                        {getStatusLabel(
                                                            complaint.status,
                                                        )}
                                                    </span>

                                                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                                        {
                                                            complaint.priority
                                                        }
                                                    </span>
                                                </div>
                                            </div>

                                            <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-slate-500" />
                                        </button>
                                    ),
                                )}
                            </div>
                        )}

                        {recentComplaints.length > 0 && (
                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/complaints")
                                }
                                className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-5 py-3.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
                            >
                                View all support requests
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </section>
            </div>

            {/* Loans */}
            <section>
                <SectionHeader
                    title="Loan portfolio"
                    description="Your latest loan applications and active facilities."
                    actionLabel="Manage loans"
                    onAction={() => navigate("/loans")}
                />

                <div className="mt-4 grid gap-4 lg:grid-cols-3">
                    {isLoansError ? (
                        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 lg:col-span-3">
                            <div className="flex items-center gap-3 text-rose-700">
                                <CircleAlert className="h-5 w-5" />

                                <p className="text-sm font-semibold">
                                    Loan information is currently
                                    unavailable.
                                </p>
                            </div>
                        </div>
                    ) : recentLoans.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 lg:col-span-3">
                            <div className="flex flex-col items-center text-center">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                                    <CreditCard className="h-6 w-6" />
                                </div>

                                <h3 className="mt-4 text-base font-bold text-slate-900">
                                    No loans yet
                                </h3>

                                <p className="mt-1 text-sm text-slate-500">
                                    Explore your financing options
                                    when you need them.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/loans/new",
                                        )
                                    }
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Apply for a loan
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ) : (
                        recentLoans.map((loan) => (
                            <button
                                key={loan.id}
                                type="button"
                                onClick={() =>
                                    navigate(
                                        `/loans/${loan.id}`,
                                    )
                                }
                                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_30px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_14px_35px_rgba(15,23,42,0.08)]"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                        <CreditCard className="h-5 w-5" />
                                    </div>

                                    <span
                                        className={[
                                            "rounded-full px-2.5 py-1 text-[10px] font-bold",
                                            getStatusClass(
                                                loan.status,
                                            ),
                                        ].join(" ")}
                                    >
                                        {getStatusLabel(
                                            loan.status,
                                        )}
                                    </span>
                                </div>

                                <div className="mt-5">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        {loan.termMonths} month
                                        term
                                    </p>

                                    <p className="mt-1 text-xl font-bold tracking-tight text-slate-950">
                                        {formatMoney(
                                            loan.remainingAmount,
                                            loan.currency,
                                        )}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-500">
                                        remaining balance
                                    </p>
                                </div>

                                <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            Principal
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {formatMoney(
                                                loan.principalAmount,
                                                loan.currency,
                                            )}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                            Monthly
                                        </p>

                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {formatMoney(
                                                loan.monthlyPayment,
                                                loan.currency,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-4 flex items-center justify-end text-xs font-semibold text-slate-400 transition group-hover:text-slate-700">
                                    View details
                                    <ChevronRight className="ml-1 h-3.5 w-3.5" />
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}

export default DashboardPage;