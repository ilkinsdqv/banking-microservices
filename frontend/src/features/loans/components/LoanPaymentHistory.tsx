import {
    Banknote,
    CalendarDays,
    CheckCircle2,
    Clock3,
    CircleDollarSign,
    History,
    XCircle,
} from "lucide-react";

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
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                            <History className="h-5 w-5 text-slate-500" />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Payment history
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Your loan repayment history.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-200">
                        <Banknote className="h-6 w-6 text-slate-400" />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-slate-900">
                        No payments yet
                    </h3>

                    <p className="mt-1 max-w-sm text-sm text-slate-500">
                        No payments have been made toward this loan yet.
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                            <History className="h-5 w-5 text-indigo-600" />
                        </div>

                        <div>
                            <h2 className="text-base font-semibold text-slate-900">
                                Payment history
                            </h2>

                            <p className="mt-0.5 text-xs text-slate-500">
                                Your loan repayment history.
                            </p>
                        </div>
                    </div>

                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {payments.length}{" "}
                        {payments.length === 1 ? "payment" : "payments"}
                    </span>
                </div>
            </div>

            <div className="hidden overflow-x-auto md:block">
                <table className="w-full">
                    <thead className="border-b border-slate-100 bg-slate-50/70">
                    <tr>
                        <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Date
                        </th>

                        <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Amount
                        </th>

                        <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Remaining
                        </th>

                        <th className="px-6 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Status
                        </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                    {payments.map((payment) => {
                        const isCompleted =
                            payment.status === "COMPLETED";

                        return (
                            <tr
                                key={payment.id}
                                className="transition hover:bg-slate-50/70"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                                            <CalendarDays className="h-4 w-4 text-slate-500" />
                                        </div>

                                        <span className="text-sm text-slate-700">
                                                {formatDate(
                                                    payment.createdAt,
                                                )}
                                            </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <CircleDollarSign className="h-4 w-4 text-emerald-500" />

                                        <span className="text-sm font-semibold text-slate-900">
                                                {formatMoney(
                                                    payment.amount,
                                                )}
                                            </span>
                                    </div>
                                </td>

                                <td className="px-6 py-4">
                                        <span className="text-sm font-medium text-slate-700">
                                            {formatMoney(
                                                payment.remainingAmount,
                                            )}
                                        </span>
                                </td>

                                <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                                                isCompleted
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : "bg-red-50 text-red-700"
                                            }`}
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="h-3.5 w-3.5" />
                                            ) : (
                                                <XCircle className="h-3.5 w-3.5" />
                                            )}

                                            {payment.status}
                                        </span>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            </div>

            <div className="divide-y divide-slate-100 md:hidden">
                {payments.map((payment) => {
                    const isCompleted =
                        payment.status === "COMPLETED";

                    return (
                        <div
                            key={payment.id}
                            className="p-5"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
                                        <Banknote className="h-5 w-5 text-slate-500" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            {formatMoney(payment.amount)}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-400">
                                            {formatDate(
                                                payment.createdAt,
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <span
                                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                        isCompleted
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-red-50 text-red-700"
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="h-3 w-3" />
                                    ) : (
                                        <XCircle className="h-3 w-3" />
                                    )}

                                    {payment.status}
                                </span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-3">
                                <div className="rounded-xl bg-slate-50 p-3">
                                    <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                        <Clock3 className="h-3 w-3" />
                                        Remaining
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {formatMoney(
                                            payment.remainingAmount,
                                        )}
                                    </p>
                                </div>

                                <div className="rounded-xl bg-slate-50 p-3">
                                    <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                                        <CircleDollarSign className="h-3 w-3" />
                                        Payment
                                    </div>

                                    <p className="mt-1 text-sm font-semibold text-emerald-600">
                                        {formatMoney(payment.amount)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}

export default LoanPaymentHistory;