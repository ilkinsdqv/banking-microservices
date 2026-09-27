import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

import RegisterForm from "../components/RegisterForm";

function RegisterPage() {
    const navigate = useNavigate();

    const handleSuccess = (email: string) => {
        navigate("/verify-email", {
            replace: true,
            state: { email },
        });
    };

    return (
        <div>
            <div className="mb-7">
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to sign in
                </button>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    New customer
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    Open your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Enter your personal information to create your banking
                    account.
                </p>
            </div>

            <RegisterForm
                onSuccess={handleSuccess}
            />
        </div>
    );
}

export default RegisterPage;