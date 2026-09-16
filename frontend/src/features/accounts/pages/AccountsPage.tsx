import { useState } from "react";

import { useAuth } from "../../auth/hooks/use-auth";
import AccountCard from "../components/AccountCard";
import CashInModal from "../components/CashInModal";
import CreateAccountForm from "../components/CreateAccountForm";
import CreateAccountModal from "../components/CreateAccountModal";
import { useAccounts } from "../hooks/use-accounts";
import type { Account } from "../types/account";

function AccountsPage() {
    const { user } = useAuth();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] =
        useState<Account | null>(null);

    const {
        data: accounts,
        isLoading,
        isError,
    } = useAccounts(user?.id ?? null);

    if (isLoading) {
        return (
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                    Accounts
                </h1>

                <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2].map((item) => (
                        <div
                            key={item}
                            className="h-48 animate-pulse rounded-2xl bg-slate-200"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <h1 className="text-2xl font-semibold text-slate-900">
                    Accounts
                </h1>

                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Hesabları yükləmək mümkün olmadı.
                </div>
            </div>
        );
    }

    return (
        <>
            <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">
                            Accounts
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your bank accounts and balances.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsCreateModalOpen(true)}
                        className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        + Create account
                    </button>
                </div>

                {accounts && accounts.length > 0 ? (
                    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {accounts.map((account) => (
                            <AccountCard
                                key={account.id}
                                account={account}
                                onCashIn={setSelectedAccount}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
                        <h2 className="text-lg font-semibold text-slate-900">
                            No accounts yet
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Create your first bank account to get started.
                        </p>

                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(true)}
                            className="mt-5 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                        >
                            Create your first account
                        </button>
                    </div>
                )}
            </div>

            <CreateAccountModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            >
                <CreateAccountForm
                    onSuccess={() => setIsCreateModalOpen(false)}
                    onCancel={() => setIsCreateModalOpen(false)}
                />
            </CreateAccountModal>

            <CashInModal
                account={selectedAccount}
                onClose={() => setSelectedAccount(null)}
            />
        </>
    );
}

export default AccountsPage;