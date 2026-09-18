import { AdminAccountList } from "../components/AdminAccountList";
import { useAdminAccounts } from "../hooks/use-admin-accounts";

export function AdminAccountsPage() {
    const {
        data: accounts = [],
        isLoading,
        isError,
        refetch,
    } = useAdminAccounts();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Accounts
                    </h1>
                    <p className="text-muted-foreground">
                        Manage and view all customer accounts.
                    </p>
                </div>

                <div className="rounded-lg border p-8 text-center">
                    Loading accounts...
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Accounts
                    </h1>
                    <p className="text-muted-foreground">
                        Manage and view all customer accounts.
                    </p>
                </div>

                <div className="rounded-lg border p-8 text-center">
                    <p className="text-destructive">
                        Failed to load accounts.
                    </p>

                    <button
                        type="button"
                        onClick={() => refetch()}
                        className="mt-4 rounded-md border px-4 py-2 text-sm"
                    >
                        Try again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold">
                    Accounts
                </h1>

                <p className="text-muted-foreground">
                    View all customer accounts and their balances.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        Total Accounts
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                        {accounts.length}
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        Checking Accounts
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                        {
                            accounts.filter(
                                (account) =>
                                    account.type === "CHECKING",
                            ).length
                        }
                    </p>
                </div>

                <div className="rounded-lg border p-4">
                    <p className="text-sm text-muted-foreground">
                        Savings Accounts
                    </p>

                    <p className="mt-1 text-2xl font-semibold">
                        {
                            accounts.filter(
                                (account) =>
                                    account.type === "SAVINGS",
                            ).length
                        }
                    </p>
                </div>
            </div>

            <AdminAccountList accounts={accounts} />
        </div>
    );
}