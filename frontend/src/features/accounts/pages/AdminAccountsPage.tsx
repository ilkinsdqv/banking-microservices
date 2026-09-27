import {
    CreditCard,
    Landmark,
    PiggyBank,
    WalletCards,
} from "lucide-react";

import { AdminAccountList } from "../components/AdminAccountList";
import { useAdminAccounts } from "../hooks/use-admin-accounts";

import { Card } from "../../../components/ui";
import { ErrorState } from "../../../components/ui";
import { Skeleton } from "../../../components/ui";

export function AdminAccountsPage() {
    const {
        data: accounts = [],
        isLoading,
        isError,
        refetch,
    } = useAdminAccounts();

    const checkingAccounts = accounts.filter(
        (account) => account.type === "CHECKING",
    ).length;

    const savingsAccounts = accounts.filter(
        (account) => account.type === "SAVINGS",
    ).length;

    const totalBalance = accounts.reduce(
        (total, account) => total + account.balance,
        0,
    );

    if (isLoading) {
        return (
            <div className="space-y-8">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-40" />
                    <Skeleton className="h-4 w-80" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                        <Card key={index} className="p-5">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <Skeleton className="mt-5 h-4 w-28" />
                            <Skeleton className="mt-2 h-8 w-20" />
                        </Card>
                    ))}
                </div>

                <Card className="overflow-hidden">
                    <div className="border-b px-6 py-5">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="mt-2 h-4 w-64" />
                    </div>

                    <div className="space-y-4 p-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <Skeleton
                                key={index}
                                className="h-12 w-full"
                            />
                        ))}
                    </div>
                </Card>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-8">
                <div>
                    <p className="text-sm font-medium text-slate-500">
                        Administration
                    </p>
                    <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">
                        Accounts
                    </h1>
                </div>

                <ErrorState
                    title="Unable to load accounts"
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-indigo-50 via-indigo-50/40 to-transparent" />

                <div className="relative flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-indigo-600">
                            <Landmark className="h-4 w-4" />
                            Account management
                        </div>

                        <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
                            Customer Accounts
                        </h1>

                        <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
                            Monitor customer accounts, balances, currencies,
                            and account activity from one place.
                        </p>
                    </div>

                    <div className="hidden shrink-0 lg:flex">
                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-sm">
                            <WalletCards className="h-7 w-7" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <Card className="group relative overflow-hidden p-5 transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total Accounts
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {accounts.length}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <CreditCard className="h-5 w-5" />
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                        All customer accounts
                    </p>
                </Card>

                <Card className="group relative overflow-hidden p-5 transition-shadow hover:shadow-md">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Checking Accounts
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {checkingAccounts}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <WalletCards className="h-5 w-5" />
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                        Day-to-day transaction accounts
                    </p>
                </Card>

                <Card className="group relative overflow-hidden p-5 transition-shadow hover:shadow-md sm:col-span-2 xl:col-span-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Savings Accounts
                            </p>

                            <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                                {savingsAccounts}
                            </p>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                            <PiggyBank className="h-5 w-5" />
                        </div>
                    </div>

                    <p className="mt-4 text-xs text-slate-400">
                        Customer savings accounts
                    </p>
                </Card>
            </section>

            <Card className="overflow-hidden">
                <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-base font-semibold text-slate-950">
                            Account Directory
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Browse all customer accounts and their balances.
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right">
                        <p className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            Combined Balance
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-slate-900">
                            {new Intl.NumberFormat("en-US", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            }).format(totalBalance)}
                        </p>
                    </div>
                </div>

                <AdminAccountList accounts={accounts} />
            </Card>
        </div>
    );
}