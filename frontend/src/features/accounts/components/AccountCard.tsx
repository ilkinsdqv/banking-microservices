import { useNavigate } from "react-router";

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

    const formattedBalance = new Intl.NumberFormat("az-AZ", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(account.balance);

    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        {account.type}
                    </p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                        {account.iban}
                    </p>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
          {account.currency}
        </span>
            </div>

            <div className="mt-8">
                <p className="text-xs text-slate-500">
                    Available balance
                </p>

                <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                    {formattedBalance} {account.currency}
                </p>
            </div>

            <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={() => onCashIn(account)}
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    Cash in
                </button>

                <button
                    type="button"
                    onClick={() => navigate(`/accounts/${account.id}`)}
                    className="flex-1 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                    View details
                </button>
            </div>
        </article>
    );
}

export default AccountCard;