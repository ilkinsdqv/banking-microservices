import {
    ArrowLeft,
    Banknote,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Landmark,
    Percent,
    ShieldCheck,
    WalletCards,
    XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";

import {
    Button,
    ErrorState,
    Skeleton,
} from "../../../components/ui";
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
        refetch,
    } = useLoan(id);

    const {
        data: payments,
        isLoading: isPaymentsLoading,
    } = useLoanPayments(id);

    const cancelLoan = useCancelLoan();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <Skeleton className="h-5 w-36" />

                <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 sm:p-8">
                    <Skeleton className="h-12 w-12 rounded-2xl bg-white/10" />
                    <Skeleton className="mt-6 h-4 w-24 bg-white/10" />
                    <Skeleton className="mt-3 h-9 w-56 bg-white/10" />
                    <Skeleton className="mt-3 h-4 w-80 max-w-full bg-white/10" />
                </div>

                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <Skeleton className="h-96 rounded-3xl" />
                    <Skeleton className="h-72 rounded-3xl" />
                </div>
            </div>
        );
    }

    if (isError || !loan) {
        return (
            <ErrorState
                title="Loan not found"
                description="The requested loan could not be loaded."
                onRetry={() => refetch()}
            />
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
        <div className="space-y-6">
            <button
                type="button"
                onClick={() => navigate("/loans")}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-900"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to loans
            </button>

            <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-950/10 sm:px-8 sm:py-10">
                <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                            <Landmark className="h-6 w-6 text-indigo-300" />
                        </div>

                        <p className="mt-5 text-sm font-medium text-indigo-300">
                            Loan details
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                            {formatMoney(loan.remainingAmount)}{" "}
                            <span className="text-slate-400">
                                {loan.currency}
                            </span>
                        </h1>

                        <p className="mt-3 font-mono text-xs text-slate-500">
                            {loan.id}
                        </p>
                    </div>

                    <div
                        className={`inline-flex w-fit items-center gap-2 rounded-full px-3.5 py-2 text-xs font-semibold ${
                            loanStatusClasses[loan.status]
                        }`}
                    >
                        {loan.status === "ACTIVE" ? (
                            <CheckCircle2 className="h-4 w-4" />
                        ) : loan.status === "PENDING" ||
                        loan.status === "APPROVED" ? (
                            <Clock3 className="h-4 w-4" />
                        ) : (
                            <XCircle className="h-4 w-4" />
                        )}

                        {loanStatusLabels[loan.status]}
                    </div>
                </div>
            </section>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                                <Banknote className="h-5 w-5 text-indigo-600" />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Loan overview
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Current balance and repayment progress.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-5 sm:p-6">
                        <div className="rounded-2xl bg-slate-50 p-5">
                            <div className="flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Remaining amount
                                    </p>

                                    <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                                        {formatMoney(loan.remainingAmount)}{" "}
                                        {loan.currency}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-xs text-slate-400">
                                        Paid
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-emerald-600">
                                        {formatMoney(paidAmount)}{" "}
                                        {loan.currency}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="mb-2 flex items-center justify-between text-xs font-medium">
                                    <span className="text-slate-500">
                                        Repayment progress
                                    </span>

                                    <span className="text-slate-700">
                                        {progress.toFixed(0)}%
                                    </span>
                                </div>

                                <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
                                    <div
                                        className="h-full rounded-full bg-slate-900 transition-all duration-500"
                                        style={{
                                            width: `${progress}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-slate-200 bg-slate-200 sm:grid-cols-2">
                            <div className="bg-white p-5">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    <CircleDollarIcon />
                                    Principal
                                </div>

                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                    {formatMoney(
                                        loan.principalAmount,
                                    )}{" "}
                                    {loan.currency}
                                </p>
                            </div>

                            <div className="bg-white p-5">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    Monthly payment
                                </div>

                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                    {formatMoney(
                                        loan.monthlyPayment,
                                    )}{" "}
                                    {loan.currency}
                                </p>
                            </div>

                            <div className="bg-white p-5">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    <Percent className="h-3.5 w-3.5" />
                                    Interest rate
                                </div>

                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                    {loan.interestRate}%
                                </p>
                            </div>

                            <div className="bg-white p-5">
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    <Clock3 className="h-3.5 w-3.5" />
                                    Term
                                </div>

                                <p className="mt-2 text-sm font-semibold text-slate-900">
                                    {loan.termMonths} months
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-5 border-t border-slate-100 pt-6 sm:grid-cols-2">
                            <div>
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    <WalletCards className="h-3.5 w-3.5" />
                                    Account
                                </div>

                                <p className="mt-2 break-all font-mono text-xs text-slate-600">
                                    {loan.accountId}
                                </p>
                            </div>

                            <div>
                                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    <CalendarDays className="h-3.5 w-3.5" />
                                    Created
                                </div>

                                <p className="mt-2 text-sm text-slate-900">
                                    {formatDate(loan.createdAt)}
                                </p>
                            </div>
                        </div>

                        {(loan.status === "PENDING" ||
                            loan.status === "APPROVED") && (
                            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-red-100 bg-red-50/60 p-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-100">
                                        <XCircle className="h-4 w-4 text-red-600" />
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">
                                            Cancel application
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            This action cannot be undone.
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    type="button"
                                    variant="danger"
                                    onClick={handleCancel}
                                    disabled={cancelLoan.isPending}
                                >
                                    {cancelLoan.isPending
                                        ? "Cancelling..."
                                        : "Cancel"}
                                </Button>
                            </div>
                        )}
                    </div>
                </section>

                <div className="space-y-6">
                    {loan.status === "ACTIVE" &&
                        loan.remainingAmount > 0 && (
                            <LoanPaymentForm
                                loan={loan}
                                onSuccess={() => undefined}
                            />
                        )}

                    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                                <ShieldCheck className="h-5 w-5 text-emerald-600" />
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-slate-900">
                                    Loan information
                                </p>

                                <p className="text-xs text-slate-500">
                                    Your loan details are protected.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <section>
                {isPaymentsLoading ? (
                    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-xl" />
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-3 w-48" />
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Skeleton className="h-16 rounded-xl" />
                            <Skeleton className="h-16 rounded-xl" />
                        </div>
                    </div>
                ) : (
                    <LoanPaymentHistory
                        payments={payments ?? []}
                    />
                )}
            </section>

            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
                <p className="text-xs text-slate-400">
                    Last updated: {formatDate(loan.updatedAt)}
                </p>

                <button
                    type="button"
                    onClick={() => navigate("/loans")}
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 transition hover:text-slate-900"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    All loans
                </button>
            </div>
        </div>
    );
}

function CircleDollarIcon() {
    return <Banknote className="h-3.5 w-3.5" />;
}

export default LoanDetailPage;