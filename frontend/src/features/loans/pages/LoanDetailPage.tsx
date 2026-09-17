import { useNavigate, useParams } from "react-router";

import LoanPaymentForm from "../components/LoanPaymentForm.tsx";
import LoanPaymentHistory from "../components/LoanPaymentHistory.tsx";
import {
    loanStatusClasses,
    loanStatusLabels,
} from "../components/loan-status.ts";
import { useCancelLoan } from "../hooks/use-cancel-loan.ts";
import { useLoan } from "../hooks/use-loan.ts";
import { useLoanPayments } from "../hooks/use-loan-payments.ts";

function LoanDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const {
        data: loan,
        isLoading,
        isError,
    } = useLoan(id);

    const {
        data: payments,
        isLoading: isPaymentsLoading,
    } = useLoanPayments(id);

    const cancelLoan = useCancelLoan();

    if (isLoading) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-slate-500">
                    Loading loan...
                </p>
            </div>
        );
    }

    if (isError || !loan) {
        return (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
                <h2 className="font-semibold text-red-800">
                    Loan not found
                </h2>

                <p className="mt-1 text-sm text-red-600">
                    The requested loan could not be loaded.
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/loans")}
                    className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                >
                    Back to loans
                </button>
            </div>
        );
    }

    const paidAmount =
        loan.principalAmount - loan.remainingAmount;

    const progress =
        loan.principalAmount > 0
            ? Math.min(
                100,
                Math.max(
                    0,
                    (paidAmount / loan.principalAmount) * 100,
                ),
            )
            : 0;

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

    const handleCancel = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to cancel this loan?",
        );

        if (!confirmed) {
            return;
        }

        try {
            await cancelLoan.mutateAsync(loan.id);
        } catch {
            window.alert(
                "The loan could not be cancelled. Please try again.",
            );
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={() => navigate("/loans")}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
                ← Back to loans
            </button>

            <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Loan details
                    </h1>

                    <p className="mt-1 font-mono text-xs text-slate-400">
                        {loan.id}
                    </p>
                </div>

                <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                        loanStatusClasses[loan.status]
                    }`}
                >
          {loanStatusLabels[loan.status]}
        </span>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <p className="text-sm text-slate-500">
                            Remaining amount
                        </p>

                        <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-900">
                            {formatMoney(loan.remainingAmount)}{" "}
                            {loan.currency}
                        </p>
                    </div>

                    <div className="mt-6">
                        <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-slate-500">
                Repayment progress
              </span>

                            <span className="font-medium text-slate-700">
                {progress.toFixed(0)}%
              </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-slate-900 transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Principal
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {formatMoney(loan.principalAmount)}{" "}
                                {loan.currency}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Monthly payment
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {formatMoney(loan.monthlyPayment)}{" "}
                                {loan.currency}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Interest rate
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {loan.interestRate}%
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Term
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-900">
                                {loan.termMonths} months
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Account
                            </p>

                            <p className="mt-1 break-all font-mono text-xs text-slate-600">
                                {loan.accountId}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Created
                            </p>

                            <p className="mt-1 text-sm text-slate-900">
                                {formatDate(loan.createdAt)}
                            </p>
                        </div>
                    </div>

                    {(loan.status === "PENDING" ||
                        loan.status === "APPROVED") && (
                        <div className="mt-8 border-t border-slate-200 pt-6">
                            <button
                                type="button"
                                onClick={handleCancel}
                                disabled={cancelLoan.isPending}
                                className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {cancelLoan.isPending
                                    ? "Cancelling..."
                                    : "Cancel loan"}
                            </button>
                        </div>
                    )}
                </div>

                <div>
                    {loan.status === "ACTIVE" &&
                        loan.remainingAmount > 0 && (
                            <LoanPaymentForm
                                loan={loan}
                                onSuccess={() => undefined}
                            />
                        )}
                </div>
            </div>

            <div className="mt-6">
                {isPaymentsLoading ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">
                            Loading payment history...
                        </p>
                    </div>
                ) : (
                    <LoanPaymentHistory payments={payments ?? []} />
                )}
            </div>

            <div className="mt-6">
                <p className="text-xs text-slate-400">
                    Last updated: {formatDate(loan.updatedAt)}
                </p>
            </div>
        </div>
    );
}

export default LoanDetailPage;