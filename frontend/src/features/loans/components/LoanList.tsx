import {
    ArrowUpRight,
    Banknote,
    CalendarDays,
    ChevronRight,
    CircleDollarSign,
    Clock3,
    CreditCard,
} from "lucide-react";
import { useNavigate } from "react-router";

import type { Loan } from "../types/loan";
import {
    loanStatusClasses,
    loanStatusLabels,
} from "./loan-status";

interface LoanListProps {
    loans: Loan[];
}

function LoanList({ loans }: LoanListProps) {
    const navigate = useNavigate();

    const formatMoney = (amount: number, currency: string) =>
        new Intl.NumberFormat("az-AZ", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount) + ` ${currency}`;

    if (loans.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-6 py-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
                    <Banknote className="h-6 w-6 text-slate-400" />
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                    No loans yet
                </h3>

                <p className="mt-1 max-w-sm text-sm leading-5 text-slate-500">
                    You do not have any loan applications.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {loans.map((loan) => (
                <button
                    key={loan.id}
                    type="button"
                    onClick={() => navigate(`/loans/${loan.id}`)}
                    className="group w-full rounded-2xl border border-slate-200 bg-white p-4 text-left transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg hover:shadow-slate-900/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20 sm:p-5"
                >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center">
                        <div className="flex min-w-0 flex-1 items-center gap-4">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                                <CreditCard className="h-5 w-5 text-indigo-600" />
                            </div>

                            <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <p className="font-semibold text-slate-900">
                                        {loan.termMonths} months
                                    </p>

                                    <span
                                        className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                            loanStatusClasses[loan.status]
                                        }`}
                                    >
                                        {loanStatusLabels[loan.status]}
                                    </span>
                                </div>

                                <p className="mt-1 truncate font-mono text-xs text-slate-400">
                                    {loan.id}
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:flex lg:items-center">
                            <div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                    <CircleDollarSign className="h-3.5 w-3.5" />
                                    Principal
                                </div>

                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {formatMoney(
                                        loan.principalAmount,
                                        loan.currency,
                                    )}
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    Monthly
                                </div>

                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {formatMoney(
                                        loan.monthlyPayment,
                                        loan.currency,
                                    )}
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    Remaining
                                </div>

                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    {formatMoney(
                                        loan.remainingAmount,
                                        loan.currency,
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="flex shrink-0 items-center justify-end border-t border-slate-100 pt-3 lg:border-0 lg:pt-0">
                            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition group-hover:bg-slate-900 group-hover:text-white">
                                <ChevronRight className="h-4 w-4" />
                            </span>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                        <span className="text-xs text-slate-400">
                            View loan details
                        </span>

                        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition group-hover:text-slate-900">
                            Open
                            <ArrowUpRight className="h-3.5 w-3.5" />
                        </span>
                    </div>
                </button>
            ))}
        </div>
    );
}

export default LoanList;