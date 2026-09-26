import {
    ArrowRight,
    Banknote,
    CalendarClock,
    CircleDollarSign,
    FilePlus2,
    Landmark,
    ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router";

import {
    Button,
    EmptyState,
    ErrorState,
    Skeleton,
} from "../../../components/ui";
import LoanList from "../components/LoanList";
import { useLoans } from "../hooks/use-loans";

function LoansPage() {
    const navigate = useNavigate();

    const {
        data: loans,
        isLoading,
        isError,
        refetch,
    } = useLoans();

    if (isLoading) {
        return (
            <div className="space-y-6">
                <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-950/10 sm:px-8">
                    <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

                    <div className="relative">
                        <Skeleton className="h-4 w-20 bg-white/10" />
                        <Skeleton className="mt-3 h-9 w-48 bg-white/10" />
                        <Skeleton className="mt-3 h-5 w-full max-w-xl bg-white/10" />
                    </div>
                </section>

                <div className="grid gap-4 sm:grid-cols-3">
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                </div>

                <div className="space-y-3">
                    <Skeleton className="h-24 rounded-2xl" />
                    <Skeleton className="h-24 rounded-2xl" />
                    <Skeleton className="h-24 rounded-2xl" />
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <ErrorState
                title="Could not load loans"
                description="Please try again later."
                onRetry={() => refetch()}
            />
        );
    }

    const loanItems = loans ?? [];
    const loanCount = loanItems.length;

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-3xl bg-slate-950 px-6 py-8 text-white shadow-xl shadow-slate-950/10 sm:px-8 sm:py-10">
                <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
                    <div className="max-w-2xl">
                        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                            <Landmark className="h-6 w-6 text-indigo-300" />
                        </div>

                        <p className="text-sm font-medium text-indigo-300">
                            Lending
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                            Loans
                        </h1>

                        <p className="mt-3 text-sm leading-6 text-slate-300 sm:text-base">
                            Manage your loan applications, active loans and
                            repayments in one place.
                        </p>
                    </div>

                    <Button
                        type="button"
                        onClick={() => navigate("/loans/new")}
                        className="w-full text-slate-950 hover:bg-slate-100 sm:w-auto"
                    >
                        <FilePlus2 className="h-4 w-4" />
                        Apply for loan
                    </Button>
                </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                            <Banknote className="h-5 w-5 text-indigo-600" />
                        </div>

                        <span className="text-xs font-medium text-slate-400">
                            Portfolio
                        </span>
                    </div>

                    <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
                        {loanCount}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Total loan records
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50">
                            <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        </div>

                        <span className="text-xs font-medium text-slate-400">
                            Service
                        </span>
                    </div>

                    <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
                        Secure
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Protected loan management
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
                            <CalendarClock className="h-5 w-5 text-cyan-600" />
                        </div>

                        <span className="text-xs font-medium text-slate-400">
                            Payments
                        </span>
                    </div>

                    <p className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
                        Track
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Monitor your repayment schedule
                    </p>
                </div>
            </div>

            {loanItems.length === 0 ? (
                <EmptyState
                    icon={<CircleDollarSign className="h-6 w-6" />}
                    title="No loans yet"
                    description="You don't have any loan records. Start a new application when you're ready."
                    action={
                        <Button
                            type="button"
                            onClick={() => navigate("/loans/new")}
                        >
                            <FilePlus2 className="h-4 w-4" />
                            Apply for loan
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    }
                />
            ) : (
                <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Your loans
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Review applications and repayment details.
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <CircleDollarSign className="h-4 w-4" />
                            {loanCount} {loanCount === 1 ? "loan" : "loans"}
                        </div>
                    </div>

                    <div className="p-4 sm:p-6">
                        <LoanList loans={loanItems} />
                    </div>
                </section>
            )}
        </div>
    );
}

export default LoansPage;