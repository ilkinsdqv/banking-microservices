import { useNavigate } from "react-router";

import CreateComplaintForm from "../components/CreateComplaintForm";

function CreateComplaintPage() {
    const navigate = useNavigate();

    return (
        <div>
            <button
                type="button"
                onClick={() => navigate("/complaints")}
                className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
            >
                ← Back to complaints
            </button>

            <div className="mt-5">
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    New complaint
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Submit an issue or request to the bank.
                </p>
            </div>

            <div className="mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <CreateComplaintForm
                    onSuccess={() => navigate("/complaints")}
                    onCancel={() => navigate("/complaints")}
                />
            </div>
        </div>
    );
}

export default CreateComplaintPage;