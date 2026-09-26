import { useState } from "react";

import { Button, EmptyState, ErrorState, Skeleton } from "../../../components/ui";
import { useAuth } from "../../auth/hooks/use-auth";
import AccountCard from "../components/AccountCard";
import CashInModal from "../components/CashInModal";
import CreateAccountForm from "../components/CreateAccountForm";
import CreateAccountModal from "../components/CreateAccountModal";
import { useAccounts } from "../hooks/use-accounts";
import type { Account } from "../types/account";

function AccountsPage() {
    const { user } = useAuth();

    const [isCreateModalOpen, setIsCreateModalOpen] =
        useState(false);

    const [selectedAccount, setSelectedAccount] =
        useState<Account | null>(null);

    const {
        data: accounts,
        isLoading,
        isError,
        refetch,
    } = useAccounts(user?.id ?? null);

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-2">
                        <Skeleton
                            width="140px"
                            height="32px"
                        />

                        <Skeleton
                            width="280px"
                            height="20px"
                        />
                    </div>

                    <Skeleton
                        width="150px"
                        height="40px"
                    />
                </div>

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <Skeleton
                            key={item}
                            className="h-48 w-full rounded-2xl"
                        />
                    ))}
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Accounts
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your bank accounts and balances.
                    </p>
                </div>

                <ErrorState
                    title="Unable to load accounts"
                    description="We couldn't retrieve your bank accounts. Please try again."
                    onRetry={() => refetch()}
                />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                            Accounts
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Manage your bank accounts and balances.
                        </p>
                    </div>

                    <Button
                        onClick={() =>
                            setIsCreateModalOpen(true)
                        }
                    >
                        + Create account
                    </Button>
                </div>

                {accounts && accounts.length > 0 ? (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {accounts.map((account) => (
                            <AccountCard
                                key={account.id}
                                account={account}
                                onCashIn={setSelectedAccount}
                            />
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        title="No accounts yet"
                        description="Create your first bank account to get started."
                        action={
                            <Button
                                onClick={() =>
                                    setIsCreateModalOpen(true)
                                }
                            >
                                Create your first account
                            </Button>
                        }
                    />
                )}
            </div>

            <CreateAccountModal
                open={isCreateModalOpen}
                onClose={() =>
                    setIsCreateModalOpen(false)
                }
            >
                <CreateAccountForm
                    onSuccess={() =>
                        setIsCreateModalOpen(false)
                    }
                    onCancel={() =>
                        setIsCreateModalOpen(false)
                    }
                />
            </CreateAccountModal>

            <CashInModal
                account={selectedAccount}
                onClose={() =>
                    setSelectedAccount(null)
                }
            />
        </>
    );
}

export default AccountsPage;