import { useNavigate } from "react-router";

import LoanList from "../components/LoanList";
import { useLoans } from "../hooks/use-loans";

function LoansPage() {
    const navigate = useNavigate();

    const {
        data: loans,
        isLoading,
        isError,
    } = useLoans();

    if (isLoading) {
        return (
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Loans
                </h1>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading loans...
                    </p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Loans
                </h1>

                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
                    <h2 className="font-semibold text-red-800">
                        Could not load loans
                    </h2>

                    <p className="mt-1 text-sm text-red-600">
                        Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                        Loans
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your loan applications and repayments.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => navigate("/loans/new")}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                    Apply for loan
                </button>
            </div>

            <div className="mt-6">
                <LoanList loans={loans ?? []} />
            </div>
        </div>
    );
}

export default LoansPage;