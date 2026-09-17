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
            <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">
                    No loans yet
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                    You do not have any loan applications.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
                <table className="w-full min-w-[720px]">
                    <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Loan
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Principal
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Monthly payment
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Remaining
                        </th>

                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Status
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {loans.map((loan) => (
                        <tr
                            key={loan.id}
                            onClick={() => navigate(`/loans/${loan.id}`)}
                            className="cursor-pointer transition hover:bg-slate-50"
                        >
                            <td className="px-6 py-4">
                                <p className="font-medium text-slate-900">
                                    {loan.termMonths} months
                                </p>

                                <p className="mt-1 font-mono text-xs text-slate-400">
                                    {loan.id}
                                </p>
                            </td>

                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                {formatMoney(
                                    loan.principalAmount,
                                    loan.currency,
                                )}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-700">
                                {formatMoney(
                                    loan.monthlyPayment,
                                    loan.currency,
                                )}
                            </td>

                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                {formatMoney(
                                    loan.remainingAmount,
                                    loan.currency,
                                )}
                            </td>

                            <td className="px-6 py-4">
                  <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          loanStatusClasses[loan.status]
                      }`}
                  >
                    {loanStatusLabels[loan.status]}
                  </span>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default LoanList;