import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import CashInModal from "../components/CashInModal";
import { useAccount } from "../hooks/use-account";

function AccountDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [isCashInOpen, setIsCashInOpen] = useState(false);

    const {
        data: account,
        isLoading,
        isError,
    } = useAccount(id);

    if (isLoading) {
        return (
            <div>
                <div className="h-8 w-48 animate-pulse rounded-lg bg-slate-200" />

                <div className="mt-6 h-72 animate-pulse rounded-2xl bg-slate-200" />
            </div>
        );
    }

    if (isError || !account) {
        return (
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/accounts")}
                    className="text-sm font-medium text-slate-600 hover:text-slate-900"
                >
                    ← Back to accounts
                </button>

                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                    Account məlumatlarını yükləmək mümkün olmadı.
                </div>
            </div>
        );
    }

    const formattedBalance = new Intl.NumberFormat("az-AZ", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(account.balance);

    const createdAt = new Intl.DateTimeFormat("az-AZ", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(account.createdAt));

    const updatedAt = new Intl.DateTimeFormat("az-AZ", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(new Date(account.updatedAt));

    return (
        <>
            <div>
                <button
                    type="button"
                    onClick={() => navigate("/accounts")}
                    className="text-sm font-medium text-slate-600 transition hover:text-slate-900"
                >
                    ← Back to accounts
                </button>

                <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Account details
                        </p>

                        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                            {account.iban}
                        </h1>
                    </div>

                    <span className="w-fit rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
                        {account.type}
                    </span>
                </div>

                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <p className="text-sm text-slate-500">
                            Available balance
                        </p>

                        <p className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
                            {formattedBalance} {account.currency}
                        </p>
                    </div>

                    <div className="mt-8 grid gap-6 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-xs text-slate-400">
                                Account type
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-800">
                                {account.type}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Currency
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-800">
                                {account.currency}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Created
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-800">
                                {createdAt}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-slate-400">
                                Last updated
                            </p>

                            <p className="mt-1 text-sm font-medium text-slate-800">
                                {updatedAt}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold text-slate-900">
                            Account information
                        </p>

                        <dl className="mt-4 space-y-4">
                            <div className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    IBAN
                                </dt>

                                <dd className="text-right text-sm font-medium text-slate-800">
                                    {account.iban}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Currency
                                </dt>

                                <dd className="text-sm font-medium text-slate-800">
                                    {account.currency}
                                </dd>
                            </div>

                            <div className="flex items-center justify-between gap-4">
                                <dt className="text-sm text-slate-500">
                                    Account type
                                </dt>

                                <dd className="text-sm font-medium text-slate-800">
                                    {account.type}
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold text-slate-900">
                            Account actions
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            Available actions for this account.
                        </p>

                        <div className="mt-5">
                            <button
                                type="button"
                                onClick={() => setIsCashInOpen(true)}
                                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                            >
                                Cash in
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <CashInModal
                account={isCashInOpen ? account : null}
                onClose={() => setIsCashInOpen(false)}
            />
        </>
    );
}

export default AccountDetailPage;