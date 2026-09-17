import { useNavigate } from "react-router";

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
    } = useAccounts(user?.id ?? null);

    const {
        transactions,
        isLoading: isTransactionsLoading,
        isError: isTransactionsError,
    } = useUserTransactions(accounts);

    const isLoading =
        isAccountsLoading || isTransactionsLoading;

    const isError =
        isAccountsError || isTransactionsError;

    if (isLoading) {
        return (
            <div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />
                        <div className="mt-2 h-4 w-72 animate-pulse rounded bg-slate-200" />
                    </div>

                    <div className="hidden h-10 w-36 animate-pulse rounded-lg bg-slate-200 sm:block" />
                </div>

                <div className="mt-6 h-96 animate-pulse rounded-2xl bg-slate-200" />
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                    Transactions
                </h1>

                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Transactions məlumatlarını yükləmək mümkün olmadı.
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Transactions
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        View and manage your account transactions.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/transactions/transfer")}
                    className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    Transfer money
                </button>
            </div>

            <div className="mt-6">
                <TransactionList transactions={transactions} />
            </div>
        </div>
    );
}

export default TransactionsPage;