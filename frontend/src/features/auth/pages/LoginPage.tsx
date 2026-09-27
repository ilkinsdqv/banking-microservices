import { ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

import LoginForm from "../components/LoginForm";

interface LoginLocationState {
    from?: {
        pathname?: string;
    };
}

function LoginPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const state = location.state as LoginLocationState | null;

    const handleSuccess = () => {
        const destination = state?.from?.pathname ?? "/dashboard";

        navigate(destination, { replace: true });
    };

    return (
        <div>
            <div className="mb-7">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Welcome back
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    Sign in to your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Access your accounts, transactions and financial services.
                </p>
            </div>

            <LoginForm onSuccess={handleSuccess} />

            <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200" />
                <span className="text-xs font-medium text-slate-400">
                    OR
                </span>
                <div className="h-px flex-1 bg-slate-200" />
            </div>

            <Link
                to="/register"
                className="group flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
                <span>
                    Don't have an account?
                </span>

                <span className="flex items-center gap-2 font-semibold text-slate-950">
                    Create account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
            </Link>
        </div>
    );
}

export default LoginPage;