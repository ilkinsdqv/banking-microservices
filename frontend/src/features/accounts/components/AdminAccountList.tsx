import {
    ChevronRight,
    CreditCard,
    WalletCards,
} from "lucide-react";
import { useNavigate } from "react-router";

import type { Account } from "../types/account";

import { EmptyState } from "../../../components/ui/EmptyState";

interface AdminAccountListProps {
    accounts: Account[];
}

function formatBalance(
    balance: number,
) {
    return new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(balance);
}

function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-GB", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(date));
}

function getAccountTypeLabel(type: Account["type"]) {
    return type === "CHECKING"
        ? "Checking"
        : "Savings";
}

function getAccountTypeClass(type: Account["type"]) {
    return type === "CHECKING"
        ? "bg-indigo-50 text-indigo-700 ring-indigo-600/10"
        : "bg-emerald-50 text-emerald-700 ring-emerald-600/10";
}

export function AdminAccountList({
                                     accounts,
                                 }: AdminAccountListProps) {
    const navigate = useNavigate();

    if (accounts.length === 0) {
        return (
            <div className="p-6">
                <EmptyState
                    icon={<CreditCard className="h-6 w-6" />}
                    title="No accounts found"
                    description="There are currently no customer accounts to display."
                />
            </div>
        );
    }

    return (
        <>
            <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-sm">
                    <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80">
                        <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Account
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            User ID
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Type
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Currency
                        </th>

                        <th className="px-4 py-3.5 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Balance
                        </th>

                        <th className="px-4 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Created
                        </th>

                        <th className="w-10 px-4 py-3.5" />
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {accounts.map((account) => (
                        <tr
                            key={account.id}
                            tabIndex={0}
                            role="button"
                            onClick={() =>
                                navigate(
                                    `/accounts/${account.id}`,
                                )
                            }
                            onKeyDown={(event) => {
                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {
                                    event.preventDefault();

                                    navigate(
                                        `/accounts/${account.id}`,
                                    );
                                }
                            }}
                            className="group cursor-pointer transition-colors hover:bg-slate-50 focus-visible:bg-slate-50"
                        >
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors group-hover:bg-slate-950 group-hover:text-white">
                                        <WalletCards className="h-4 w-4" />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate font-semibold text-slate-900">
                                            {account.iban}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-400">
                                            {account.id}
                                        </p>
                                    </div>
                                </div>
                            </td>

                            <td className="px-4 py-4">
                                    <span className="font-mono text-xs text-slate-500">
                                        {account.userId}
                                    </span>
                            </td>

                            <td className="px-4 py-4">
                                    <span
                                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${getAccountTypeClass(account.type)}`}
                                    >
                                        {getAccountTypeLabel(
                                            account.type,
                                        )}
                                    </span>
                            </td>

                            <td className="px-4 py-4">
                                    <span className="font-medium text-slate-700">
                                        {account.currency}
                                    </span>
                            </td>

                            <td className="px-4 py-4 text-right">
                                    <span className="font-semibold tabular-nums text-slate-900">
                                        {formatBalance(
                                            account.balance,
                                        )}{" "}
                                        <span className="text-xs font-medium text-slate-400">
                                            {account.currency}
                                        </span>
                                    </span>
                            </td>

                            <td className="whitespace-nowrap px-4 py-4 text-slate-500">
                                {formatDate(account.createdAt)}
                            </td>

                            <td className="px-4 py-4">
                                <ChevronRight className="h-4 w-4 text-slate-300 transition-all group-hover:translate-x-0.5 group-hover:text-slate-600" />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
                {accounts.map((account) => (
                    <button
                        key={account.id}
                        type="button"
                        onClick={() =>
                            navigate(
                                `/accounts/${account.id}`,
                            )
                        }
                        className="group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50"
                    >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 group-hover:bg-slate-950 group-hover:text-white">
                            <WalletCards className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                                <p className="truncate text-sm font-semibold text-slate-900">
                                    {account.iban}
                                </p>

                                <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                            </div>

                            <div className="mt-1.5 flex flex-wrap items-center gap-2">
                                <span
                                    className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${getAccountTypeClass(account.type)}`}
                                >
                                    {getAccountTypeLabel(
                                        account.type,
                                    )}
                                </span>

                                <span className="text-xs text-slate-400">
                                    {account.currency}
                                </span>
                            </div>

                            <div className="mt-2 flex items-center justify-between gap-3">
                                <span className="text-xs text-slate-400">
                                    {formatDate(account.createdAt)}
                                </span>

                                <span className="text-sm font-semibold tabular-nums text-slate-900">
                                    {formatBalance(
                                        account.balance,
                                    )}{" "}
                                    <span className="text-xs text-slate-400">
                                        {account.currency}
                                    </span>
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </>
    );
}