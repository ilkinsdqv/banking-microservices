import {
    ArrowDownToLine,
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    CircleDollarSign,
    Copy,
    CreditCard,
    Clock3,
    WalletCards,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
    Button,
    ErrorState,
    Skeleton,
} from "../../../components/ui";
import CashInModal from "../components/CashInModal";
import { useAccount } from "../hooks/use-account";

function AccountDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isCashInOpen, setIsCashInOpen] =
        useState(false);

    const {
        data: account,
        isLoading,
        isError,
        refetch,
    } = useAccount(id);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton
                    width="150px"
                    height="20px"
                />

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white">
                    <div className="bg-slate-950 p-6 sm:p-8">
                        <Skeleton
                            width="120px"
                            height="16px"
                            className="bg-white/10"
                        />

                        <Skeleton
                            width="280px"
                            height="48px"
                            className="mt-4 bg-white/10"
                        />
                    </div>

                    <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((item) => (
                            <Skeleton
                                key={item}
                                height="54px"
                            />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !account) {
        return (
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    onClick={() =>
                        navigate("/accounts")
                    }
                >
                    <ArrowLeft
                        className="h-4 w-4"
                        aria-hidden="true"
                    />
                    Back to accounts
                </Button>

                <ErrorState
                    title="Unable to load account"
                    description="We couldn't retrieve this account. Please try again."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    const formattedBalance =
        new Intl.NumberFormat("az-AZ", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(account.balance);

    const createdAt = new Intl.DateTimeFormat(
        "az-AZ",
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    ).format(new Date(account.createdAt));

    const updatedAt = new Intl.DateTimeFormat(
        "az-AZ",
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    ).format(new Date(account.updatedAt));

    const handleCopyIban = async () => {
        await navigator.clipboard.writeText(
            account.iban,
        );
    };

    const handleCopyAccountNumber = async () => {
        await navigator.clipboard.writeText(
            account.accountNumber,
        );
    };

    return (
        <>
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() => navigate("/accounts")}
                    className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-950"
                >
                    <ArrowLeft
                        className="h-4 w-4 transition-transform group-hover:-translate-x-0.5"
                        aria-hidden="true"
                    />
                    Back to accounts
                </button>

                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-8 sm:py-10">
                        <div className="absolute right-0 top-0 h-72 w-72 translate-x-1/3 -translate-y-1/3 rounded-full bg-indigo-500/10 blur-3xl" />

                        <div className="absolute bottom-0 left-1/2 h-40 w-40 -translate-x-1/2 translate-y-1/2 rounded-full bg-emerald-400/5 blur-3xl" />

                        <div className="relative">
                            <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                                        <CreditCard
                                            className="h-5 w-5 text-white"
                                            aria-hidden="true"
                                        />
                                    </div>

                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                            Account details
                                        </p>

                                        <div className="mt-2 flex flex-wrap items-center gap-2">
                                            <h1 className="font-mono text-lg font-semibold tracking-wide sm:text-xl">
                                                {account.iban}
                                            </h1>

                                            <button
                                                type="button"
                                                onClick={
                                                    handleCopyIban
                                                }
                                                aria-label="Copy IBAN"
                                                className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-white/10 hover:text-white"
                                            >
                                                <Copy
                                                    className="h-4 w-4"
                                                    aria-hidden="true"
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-slate-200 ring-1 ring-white/10">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                    {account.type}
                                </span>
                            </div>

                            <div className="mt-10">
                                <p className="text-sm text-slate-400">
                                    Available balance
                                </p>

                                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                                    <span className="text-4xl font-bold tracking-tight sm:text-5xl">
                                        {formattedBalance}
                                    </span>

                                    <span className="text-base font-semibold text-slate-400">
                                        {account.currency}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                <Button
                                    onClick={() =>
                                        setIsCashInOpen(
                                            true,
                                        )
                                    }
                                    className="text-slate-950 hover:bg-slate-100"
                                >
                                    <ArrowDownToLine
                                        className="h-4 w-4"
                                        aria-hidden="true"
                                    />
                                    Cash in
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className="grid divide-y divide-slate-100 sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
                        <div className="p-5">
                            <div className="flex items-center gap-2 text-slate-400">
                                <WalletCards
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />

                                <p className="text-xs font-medium uppercase tracking-wider">
                                    Account type
                                </p>
                            </div>

                            <p className="mt-2 text-sm font-semibold text-slate-900">
                                {account.type}
                            </p>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-2 text-slate-400">
                                <CircleDollarSign
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />

                                <p className="text-xs font-medium uppercase tracking-wider">
                                    Currency
                                </p>
                            </div>

                            <p className="mt-2 text-sm font-semibold text-slate-900">
                                {account.currency}
                            </p>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-2 text-slate-400">
                                <CalendarDays
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />

                                <p className="text-xs font-medium uppercase tracking-wider">
                                    Created
                                </p>
                            </div>

                            <p className="mt-2 text-sm font-semibold text-slate-900">
                                {createdAt}
                            </p>
                        </div>

                        <div className="p-5">
                            <div className="flex items-center gap-2 text-slate-400">
                                <Clock3
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />

                                <p className="text-xs font-medium uppercase tracking-wider">
                                    Last updated
                                </p>
                            </div>

                            <p className="mt-2 text-sm font-semibold text-slate-900">
                                {updatedAt}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                                <CreditCard
                                    className="h-4.5 w-4.5"
                                    aria-hidden="true"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-slate-950">
                                    Account information
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Basic information about this account.
                                </p>
                            </div>
                        </div>

                        <dl className="mt-6 divide-y divide-slate-100">
                            <div className="flex items-center justify-between gap-5 py-4 first:pt-0">
                                <dt className="text-sm text-slate-500">
                                    IBAN
                                </dt>

                                <dd className="flex min-w-0 items-center gap-2 text-right">
                                    <span className="truncate font-mono text-xs font-medium text-slate-800 sm:text-sm">
                                        {account.iban}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={
                                            handleCopyIban
                                        }
                                        aria-label="Copy IBAN"
                                        className="shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                    >
                                        <Copy
                                            className="h-3.5 w-3.5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-5 py-4">
                                <dt className="text-sm text-slate-500">
                                    Account Number
                                </dt>

                                <dd className="flex min-w-0 items-center gap-2 text-right">
                                    <span className="truncate font-mono text-xs font-medium text-slate-800 sm:text-sm">
                                        {account.accountNumber}
                                    </span>

                                    <button
                                        type="button"
                                        onClick={handleCopyAccountNumber}
                                        aria-label="Copy account number"
                                        className="shrink-0 rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                                    >
                                        <Copy
                                            className="h-3.5 w-3.5"
                                            aria-hidden="true"
                                        />
                                    </button>
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-5 py-4">
                                <dt className="text-sm text-slate-500">
                                    Currency
                                </dt>

                                <dd className="text-sm font-semibold text-slate-900">
                                    {account.currency}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-5 py-4 last:pb-0">
                                <dt className="text-sm text-slate-500">
                                    Account type
                                </dt>

                                <dd className="text-sm font-semibold text-slate-900">
                                    {account.type}
                                </dd>
                            </div>
                        </dl>
                    </section>

                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                                <CheckCircle2
                                    className="h-4.5 w-4.5"
                                    aria-hidden="true"
                                />
                            </div>

                            <div>
                                <h2 className="text-sm font-semibold text-slate-950">
                                    Account actions
                                </h2>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Manage available operations for this account.
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="button"
                                onClick={() =>
                                    setIsCashInOpen(
                                        true,
                                    )
                                }
                                className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-left transition-all hover:border-slate-300 hover:bg-white hover:shadow-sm"
                            >
                                <span className="flex items-center gap-3">
                                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-700 shadow-sm">
                                        <ArrowDownToLine
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        />
                                    </span>

                                    <span>
                                        <span className="block text-sm font-semibold text-slate-900">
                                            Cash in
                                        </span>

                                        <span className="mt-0.5 block text-xs text-slate-500">
                                            Add money to this account
                                        </span>
                                    </span>
                                </span>

                                <ArrowDownToLine
                                    className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-y-0.5 group-hover:text-slate-700"
                                    aria-hidden="true"
                                />
                            </button>
                        </div>
                    </section>
                </div>
            </div>

            <CashInModal
                account={
                    isCashInOpen
                        ? account
                        : null
                }
                onClose={() =>
                    setIsCashInOpen(false)
                }
            />
        </>
    );
}

export default AccountDetailPage;