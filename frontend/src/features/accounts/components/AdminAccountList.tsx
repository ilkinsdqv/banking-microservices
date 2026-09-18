import { useNavigate } from "react-router";

import type { Account } from "../types/account";

interface AdminAccountListProps {
    accounts: Account[];
}

function formatBalance(balance: number, currency: Account["currency"]) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(balance) + ` ${currency}`;
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}

export function AdminAccountList({
                                     accounts,
                                 }: AdminAccountListProps) {
    const navigate = useNavigate();

    if (accounts.length === 0) {
        return (
            <div className="rounded-lg border p-8 text-center">
                <p className="text-muted-foreground">
                    No accounts found.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
                <thead>
                <tr className="border-b bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium">
                        IBAN
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                        User ID
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                        Type
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                        Currency
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                        Balance
                    </th>
                    <th className="px-4 py-3 text-left font-medium">
                        Created
                    </th>
                </tr>
                </thead>

                <tbody>
                {accounts.map((account) => (
                    <tr
                        key={account.id}
                        className="cursor-pointer border-b last:border-0 hover:bg-muted/50"
                        onClick={() =>
                            navigate(
                                `/accounts/${account.id}`,
                            )
                        }
                    >
                        <td className="px-4 py-3 font-medium">
                            {account.iban}
                        </td>

                        <td className="px-4 py-3 font-mono text-xs">
                            {account.userId}
                        </td>

                        <td className="px-4 py-3">
                            {account.type}
                        </td>

                        <td className="px-4 py-3">
                            {account.currency}
                        </td>

                        <td className="px-4 py-3 text-right font-medium">
                            {formatBalance(
                                account.balance,
                                account.currency,
                            )}
                        </td>

                        <td className="px-4 py-3">
                            {formatDate(account.createdAt)}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}