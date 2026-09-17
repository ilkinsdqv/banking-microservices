import { useNavigate } from "react-router";

import CreateLoanForm from "../components/CreateLoanForm.tsx";

function CreateLoanPage() {
    const navigate = useNavigate();

    return (
        <div>
            <button
                type="button"
                onClick={() => navigate("/loans")}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
                ← Back to loans
            </button>

            <div className="mt-5">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Apply for a loan
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Submit a new loan application.
                </p>
            </div>

            <div className="mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <CreateLoanForm
                    onSuccess={() => navigate("/loans")}
                    onCancel={() => navigate("/loans")}
                />
            </div>
        </div>
    );
}

export default CreateLoanPage;