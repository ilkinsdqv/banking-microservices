import {
    ArrowDownToLine,
    ArrowUpRight,
    Copy,
    CreditCard,
    Eye,
    EyeOff,
    MoreHorizontal,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "../../../components/ui";
import type { Account } from "../types/account";

interface AccountCardProps {
    account: Account;
    onCashIn: (account: Account) => void;
}

function AccountCard({
                         account,
                         onCashIn,
                     }: AccountCardProps) {
    const navigate = useNavigate();

    const [isBalanceVisible, setIsBalanceVisible] =
        useState(true);

    const formattedBalance = new Intl.NumberFormat(
        "az-AZ",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        },
    ).format(account.balance);

    const maskedIban =
        account.iban.length > 12
            ? `${account.iban.slice(0, 8)} •••• •••• ${account.iban.slice(-4)}`
            : account.iban;

    const handleCopyIban = async () => {
        await navigator.clipboard.writeText(
            account.iban,
        );
    };

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-12 -translate-y-12 rounded-full bg-slate-100/80 blur-2xl transition-transform duration-500 group-hover:translate-x-8" />

            <div className="relative p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                            <CreditCard
                                className="h-5 w-5"
                                aria-hidden="true"
                            />
                        </div>

                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                {account.type}
                            </p>

                            <p className="mt-0.5 text-sm font-medium text-slate-700">
                                {account.currency} account
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        aria-label="Account options"
                        className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                    >
                        <MoreHorizontal
                            className="h-5 w-5"
                            aria-hidden="true"
                        />
                    </button>
                </div>

                <div className="mt-7">
                    <div className="flex items-center justify-between">
                        <p className="text-xs font-medium text-slate-500">
                            Available balance
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                setIsBalanceVisible(
                                    (visible) =>
                                        !visible,
                                )
                            }
                            aria-label={
                                isBalanceVisible
                                    ? "Hide balance"
                                    : "Show balance"
                            }
                            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                        >
                            {isBalanceVisible ? (
                                <EyeOff
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Eye
                                    className="h-4 w-4"
                                    aria-hidden="true"
                                />
                            )}
                        </button>
                    </div>

                    <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-slate-950">
                            {isBalanceVisible
                                ? formattedBalance
                                : "••••••"}
                        </span>

                        <span className="text-sm font-semibold text-slate-500">
                            {account.currency}
                        </span>
                    </div>
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 px-3.5 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                                IBAN
                            </p>

                            <p className="mt-1 truncate font-mono text-xs font-medium text-slate-600">
                                {maskedIban}
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={handleCopyIban}
                            aria-label="Copy IBAN"
                            className="shrink-0 rounded-lg p-2 text-slate-400 transition-colors hover:bg-white hover:text-slate-700"
                        >
                            <Copy
                                className="h-4 w-4"
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() =>
                            onCashIn(account)
                        }
                    >
                        <ArrowDownToLine
                            className="h-4 w-4"
                            aria-hidden="true"
                        />
                        Cash in
                    </Button>

                    <Button
                        className="w-full"
                        onClick={() =>
                            navigate(
                                `/accounts/${account.id}`,
                            )
                        }
                    >
                        <ArrowUpRight
                            className="h-4 w-4"
                            aria-hidden="true"
                        />
                        Details
                    </Button>
                </div>
            </div>
        </article>
    );
}

export default AccountCard;