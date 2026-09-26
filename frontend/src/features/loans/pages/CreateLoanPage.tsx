import {
    ArrowLeft,
    ArrowRight,
    FilePlus2,
    Landmark,
    ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "../../../components/ui";
import CreateLoanForm from "../components/CreateLoanForm.tsx";

function CreateLoanPage() {
    const navigate = useNavigate();

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

                <div className="relative max-w-3xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                        <FilePlus2 className="h-6 w-6 text-indigo-300" />
                    </div>

                    <p className="mt-5 text-sm font-medium text-indigo-300">
                        New application
                    </p>

                    <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                        Apply for a loan
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                        Complete the application below to submit a new loan
                        request.
                    </p>

                    <div className="mt-6 flex flex-wrap gap-3">
                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">
                            <ShieldCheck className="h-4 w-4 text-emerald-400" />
                            Secure application
                        </div>

                        <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">
                            <Landmark className="h-4 w-4 text-cyan-400" />
                            Flexible loan options
                        </div>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Application details
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Enter the requested loan information.
                            </p>
                        </div>

                        <div className="hidden h-10 w-10 items-center justify-center rounded-xl bg-slate-100 sm:flex">
                            <ArrowRight className="h-5 w-5 text-slate-500" />
                        </div>
                    </div>

                    <CreateLoanForm
                        onSuccess={() => navigate("/loans")}
                        onCancel={() => navigate("/loans")}
                    />
                </div>

                <aside className="h-fit rounded-3xl border border-slate-200 bg-slate-50 p-5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-slate-900">
                        Before applying
                    </h3>

                    <ul className="mt-3 space-y-3 text-sm leading-5 text-slate-500">
                        <li>
                            Review the requested amount and repayment term
                            carefully.
                        </li>
                        <li>
                            Make sure the selected account details are
                            correct.
                        </li>
                        <li>
                            Verify all information before submitting your
                            application.
                        </li>
                    </ul>

                    <Button
                        type="button"
                        variant="ghost"
                        className="mt-5 w-full"
                        onClick={() => navigate("/loans")}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Cancel application
                    </Button>
                </aside>
            </section>
        </div>
    );
}

export default CreateLoanPage;