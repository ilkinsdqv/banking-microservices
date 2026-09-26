import {
    ArrowLeftRight,
    ArrowUpRight,
    ReceiptText,
    WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router";

import {
    Button,
    EmptyState,
    ErrorState,
    Skeleton,
} from "../../../components/ui";
import { useAuth } from "../../auth/hooks/use-auth";
import { useAccounts } from "../../accounts/hooks/use-accounts";
import TransactionList from "../components/TransactionList";
import { useUserTransactions } from "../hooks/use-user-transactions";

function TransactionsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        data: accounts,
        isLoading: isAccountsLoading,
        isError: isAccountsError,
        refetch: refetchAccounts,
    } = useAccounts(user?.id ?? null);

    const {
        transactions,
        isLoading: isTransactionsLoading,
        isError: isTransactionsError,
    } = useUserTransactions(accounts);

    const isLoading =
        isAccountsLoading ||
        isTransactionsLoading;

    const isError =
        isAccountsError ||
        isTransactionsError;

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-2">
                        <Skeleton
                            width="180px"
                            height="32px"
                        />
                        <Skeleton
                            width="300px"
                            height="20px"
                        />
                    </div>

                    <Skeleton
                        width="150px"
                        height="42px"
                    />
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <div className="space-y-4">
                        {[1, 2, 3, 4, 5].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="flex items-center gap-4"
                                >
                                    <Skeleton
                                        className="h-11 w-11 rounded-xl"
                                    />

                                    <div className="flex-1 space-y-2">
                                        <Skeleton
                                            width="180px"
                                            height="16px"
                                        />
                                        <Skeleton
                                            width="120px"
                                            height="14px"
                                        />
                                    </div>

                                    <Skeleton
                                        width="90px"
                                        height="18px"
                                    />
                                </div>
                            ),
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
                        Transactions
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        View and manage your account transactions.
                    </p>
                </div>

                <ErrorState
                    title="Unable to load transactions"
                    description="We couldn't retrieve your transaction history. Please try again."
                    onRetry={() => refetchAccounts()}
                />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-7 text-white shadow-sm sm:px-8">
                <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 rounded-full bg-indigo-500/10 blur-3xl" />

                <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                            <ReceiptText
                                className="h-5 w-5 text-white"
                                aria-hidden="true"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                Activity
                            </p>

                            <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                                Transactions
                            </h1>

                            <p className="mt-1 max-w-xl text-sm text-slate-400">
                                Review your recent account activity
                                and manage transfers.
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={() =>
                            navigate(
                                "/transactions/transfer",
                            )
                        }
                        className="text-slate-950 hover:bg-slate-100"
                    >
                        <ArrowLeftRight
                            className="h-4 w-4"
                            aria-hidden="true"
                        />
                        Transfer money
                        <ArrowUpRight
                            className="h-3.5 w-3.5"
                            aria-hidden="true"
                        />
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                            <WalletCards
                                className="h-4.5 w-4.5"
                                aria-hidden="true"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Accounts
                            </p>

                            <p className="mt-0.5 text-xl font-bold tracking-tight text-slate-950">
                                {accounts?.length ?? 0}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <ReceiptText
                                className="h-4.5 w-4.5"
                                aria-hidden="true"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Transactions
                            </p>

                            <p className="mt-0.5 text-xl font-bold tracking-tight text-slate-950">
                                {transactions.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {transactions.length > 0 ? (
                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                        <div>
                            <h2 className="text-sm font-semibold text-slate-950">
                                Recent transactions
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Your latest account activity.
                            </p>
                        </div>
                    </div>

                    <div className="p-2 sm:p-3">
                        <TransactionList
                            transactions={transactions}
                        />
                    </div>
                </section>
            ) : (
                <EmptyState
                    icon={
                        <ReceiptText className="h-6 w-6" />
                    }
                    title="No transactions yet"
                    description="Your account activity will appear here once you make a transaction."
                    action={
                        <Button
                            onClick={() =>
                                navigate(
                                    "/transactions/transfer",
                                )
                            }
                        >
                            <ArrowLeftRight
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                            Make a transfer
                        </Button>
                    }
                />
            )}
        </div>
    );
}

export default TransactionsPage;