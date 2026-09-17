import type { LoanPayment } from "../types/loan";

interface LoanPaymentHistoryProps {
    payments: LoanPayment[];
}

function LoanPaymentHistory({
                                payments,
                            }: LoanPaymentHistoryProps) {
    const formatMoney = (amount: number) =>
        new Intl.NumberFormat("az-AZ", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(amount);

    const formatDate = (date: string) =>
        new Intl.DateTimeFormat("az-AZ", {
            dateStyle: "medium",
            timeStyle: "short",
        }).format(new Date(date));

    if (payments.length === 0) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-base font-semibold text-slate-900">
                    Payment history
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    No payments have been made yet.
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-base font-semibold text-slate-900">
                    Payment history
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Your loan repayment history.
                </p>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead className="border-b border-slate-200 bg-slate-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Date
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Amount
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Remaining
                        </th>

                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Status
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {payments.map((payment) => (
                        <tr key={payment.id}>
                            <td className="px-6 py-4 text-sm text-slate-700">
                                {formatDate(payment.createdAt)}
                            </td>

                            <td className="px-6 py-4 text-sm font-medium text-slate-900">
                                {formatMoney(payment.amount)}
                            </td>

                            <td className="px-6 py-4 text-sm text-slate-700">
                                {formatMoney(payment.remainingAmount)}
                            </td>

                            <td className="px-6 py-4">
                  <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          payment.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                      }`}
                  >
                    {payment.status}
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

export default LoanPaymentHistory;