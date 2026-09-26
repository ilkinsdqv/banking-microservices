import {
    ArrowLeft,
    FileWarning,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";
import { useNavigate } from "react-router";

import CreateComplaintForm from "../components/CreateComplaintForm";

function CreateComplaintPage() {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <button
                type="button"
                onClick={() => navigate("/complaints")}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to complaints
            </button>

            <div className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
                <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/10">
                        <FileWarning className="h-6 w-6" />
                    </div>

                    <div>
                        <p className="text-sm font-medium text-slate-300">
                            Customer support
                        </p>

                        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
                            New complaint
                        </h1>

                        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                            Submit an issue or request to the bank. Our support
                            team will review it and update its status.
                        </p>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                    <CreateComplaintForm
                        onSuccess={() => navigate("/complaints")}
                        onCancel={() => navigate("/complaints")}
                    />
                </section>

                <aside className="space-y-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <h2 className="mt-4 text-sm font-semibold text-slate-950">
                            Secure submission
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-500">
                            Your complaint is submitted securely and can be
                            tracked from your complaints page.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <div className="flex items-center gap-2">
                            <LockKeyhole className="h-4 w-4 text-slate-600" />
                            <p className="text-sm font-semibold text-slate-900">
                                Before submitting
                            </p>
                        </div>

                        <ul className="mt-3 space-y-2 text-sm leading-5 text-slate-500">
                            <li>• Use a clear subject.</li>
                            <li>• Include relevant details.</li>
                            <li>• Select the appropriate priority.</li>
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}

export default CreateComplaintPage;