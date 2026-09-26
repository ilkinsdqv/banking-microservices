import { ArrowLeft, MailCheck } from "lucide-react";
import { Link } from "react-router";

function VerifyEmailPage() {
    return (
        <div>
            <div className="mb-7">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <MailCheck className="h-5 w-5" />
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Account verification
                </p>

                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                    Verify your email
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                    Check your inbox for the verification message sent to your
                    registered email address.
                </p>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-5">
                <p className="text-sm font-medium text-emerald-950">
                    Verification required
                </p>

                <p className="mt-1 text-xs leading-5 text-emerald-800/80">
                    Complete email verification to continue using your banking
                    account.
                </p>
            </div>

            <Link
                to="/login"
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
            </Link>
        </div>
    );
}

export default VerifyEmailPage;