import { Outlet } from "react-router";

function AuthLayout() {
    return (
        <div className="min-h-screen bg-slate-950">
            <div className="flex min-h-screen items-center justify-center px-4 py-8">
                <div className="w-full max-w-md">
                    <div className="mb-8 text-center">
                        <p className="text-sm font-medium uppercase tracking-[0.25em] text-slate-400">
                            Banking System
                        </p>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                        <Outlet />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthLayout;