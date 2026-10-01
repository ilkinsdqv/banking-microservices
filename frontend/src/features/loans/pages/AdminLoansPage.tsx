import { useAdminLoans } from "../hooks/use-admin-loans";
import { useUpdateLoanStatus } from "../hooks/use-update-loan-status";

function AdminLoansPage() {
    const { data: loans, isLoading, isError } = useAdminLoans();
    const updateLoanStatus = useUpdateLoanStatus();

    if (isLoading) {
        return (
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Loan Applications
                </h1>
                <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm text-slate-500">
                        Loading loan applications...
                    </p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Loan Applications
                </h1>
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-6">
                    <h2 className="font-semibold text-red-800">
                        Could not load loan applications
                    </h2>
                    <p className="mt-1 text-sm text-red-600">
                        Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Loan Applications
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    Review customer loan applications and manage their status.
                </p>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                {(loans ?? []).length === 0 ? (
                    <div className="p-8 text-center">
                        <p className="text-sm text-slate-500">
                            No loan applications found.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[1000px] text-left">
                            <thead className="border-b border-slate-200 bg-slate-50">
                                <tr>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">Loan</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">User ID</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">Account ID</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">Amount</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">Interest</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">Term</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">Status</th>
                                    <th className="px-5 py-4 text-xs font-bold uppercase tracking-wide text-slate-500">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {(loans ?? []).map((loan) => {
                                    const pending = loan.status === "PENDING";
                                    const updating =
                                        updateLoanStatus.isPending &&
                                        updateLoanStatus.variables?.loanId === loan.id;

                                    return (
                                        <tr key={loan.id} className="hover:bg-slate-50/70">
                                            <td className="px-5 py-4">
                                                <p className="font-semibold text-slate-900">{loan.id}</p>
                                                <p className="mt-1 text-xs text-slate-400">
                                                    {new Date(loan.createdAt).toLocaleString()}
                                                </p>
                                            </td>
                                            <td className="px-5 py-4 font-mono text-xs text-slate-600">{loan.userId}</td>
                                            <td className="px-5 py-4 font-mono text-xs text-slate-600">{loan.accountId}</td>
                                            <td className="px-5 py-4 font-semibold text-slate-900">
                                                {loan.principalAmount.toLocaleString(undefined, {
                                                    minimumFractionDigits: 2,
                                                    maximumFractionDigits: 2,
                                                })}{" "}
                                                {loan.currency}
                                            </td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{loan.interestRate}%</td>
                                            <td className="px-5 py-4 text-sm text-slate-600">{loan.termMonths} months</td>
                                            <td className="px-5 py-4">
                                                <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700">
                                                    {loan.status}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                {pending ? (
                                                    <div className="flex gap-2">
                                                        <button
                                                            type="button"
                                                            disabled={updating}
                                                            onClick={() =>
                                                                updateLoanStatus.mutate({
                                                                    loanId: loan.id,
                                                                    action: "approve",
                                                                })
                                                            }
                                                            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            type="button"
                                                            disabled={updating}
                                                            onClick={() =>
                                                                updateLoanStatus.mutate({
                                                                    loanId: loan.id,
                                                                    action: "reject",
                                                                })
                                                            }
                                                            className="rounded-lg bg-red-600 px-3 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span className="text-xs text-slate-400">
                                                        No action
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminLoansPage;
