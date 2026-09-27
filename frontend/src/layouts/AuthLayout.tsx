import { Outlet } from "react-router";
import {
    ArrowUpRight,
    CheckCircle2,
    LockKeyhole,
    ShieldCheck,
} from "lucide-react";

function AuthLayout() {
    return (
        <div className="min-h-screen bg-[#07111f] text-white">
            <div className="relative flex min-h-screen overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(59,130,246,0.18),transparent_32%),radial-gradient(circle_at_85%_80%,rgba(14,165,233,0.12),transparent_30%)]" />

                <div className="relative hidden w-[46%] border-r border-white/10 lg:flex">
                    <div className="flex w-full flex-col justify-between p-10 xl:p-14">
                        <div className="flex items-center gap-3">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-slate-950">
                                <span className="text-lg font-black">B</span>
                            </div>

                            <div>
                                <p className="text-sm font-semibold tracking-wide">
                                    Banking System
                                </p>
                                <p className="text-xs text-slate-400">
                                    Digital banking platform
                                </p>
                            </div>
                        </div>

                        <div className="max-w-xl">
                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Secure digital banking
                            </div>

                            <h1 className="text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                                Your finances,
                                <br />
                                <span className="text-slate-400">
                                    designed around you.
                                </span>
                            </h1>

                            <p className="mt-6 max-w-lg text-sm leading-7 text-slate-400 xl:text-base">
                                Manage accounts, transfers, loans and financial
                                activity from one secure banking experience.
                            </p>

                            <div className="mt-10 grid max-w-lg grid-cols-3 gap-3">
                                <div className="border-l border-white/10 pl-4">
                                    <ShieldCheck className="mb-3 h-5 w-5 text-sky-400" />
                                    <p className="text-sm font-semibold">
                                        Secure
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Protected access
                                    </p>
                                </div>

                                <div className="border-l border-white/10 pl-4">
                                    <ArrowUpRight className="mb-3 h-5 w-5 text-sky-400" />
                                    <p className="text-sm font-semibold">
                                        Flexible
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Banking anywhere
                                    </p>
                                </div>

                                <div className="border-l border-white/10 pl-4">
                                    <CheckCircle2 className="mb-3 h-5 w-5 text-sky-400" />
                                    <p className="text-sm font-semibold">
                                        Reliable
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-slate-500">
                                        Built for everyday use
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <LockKeyhole className="h-3.5 w-3.5" />
                            Your connection is protected
                        </div>
                    </div>
                </div>

                <div className="relative flex min-h-screen flex-1 items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
                    <div className="w-full max-w-[460px]">
                        <div className="mb-8 flex items-center gap-3 lg:hidden">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
                                B
                            </div>

                            <div>
                                <p className="text-sm font-semibold">
                                    Banking System
                                </p>
                                <p className="text-xs text-slate-500">
                                    Digital banking platform
                                </p>
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-white/10 bg-white p-6 text-slate-950 shadow-2xl shadow-black/30 sm:p-8">
                            <Outlet />
                        </div>

                        <p className="mt-6 text-center text-xs text-slate-500">
                            Banking System · Secure digital access
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;