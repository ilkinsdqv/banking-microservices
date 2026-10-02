import { useState } from "react";

import { useAuth } from "../../auth/hooks/use-auth";
import { useAccounts } from "../../accounts/hooks/use-accounts";

import { loansApi } from "../api/loans-api";
import { useMakeThirdPartyLoanPayment } from "../hooks/use-make-third-party-loan-payment";
import type { CustomerLoanLookup, Loan } from "../types/loan";

function ThirdPartyLoanPayment() {
    const { user } = useAuth();
    const { data: accounts } = useAccounts(user?.id ?? null);
    const makePayment = useMakeThirdPartyLoanPayment();

    const [fin, setFin] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [customer, setCustomer] = useState<CustomerLoanLookup | null>(null);
    const [selectedLoan, setSelectedLoan] = useState<Loan | null>(null);
    const [paymentAccountId, setPaymentAccountId] = useState("");
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSearch = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");
        setCustomer(null);
        setSelectedLoan(null);

        if (!fin.trim() || !birthDate) {
            setError("Enter FIN and birth date.");
            return;
        }

        try {
            setLoading(true);
            const result = await loansApi.getCustomerLoans(
                fin.trim().toUpperCase(),
                birthDate,
            );
            setCustomer(result);
        } catch {
            setError("Customer not found or could not be loaded.");
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError("");

        if (!selectedLoan || !paymentAccountId) {
            setError("Select a loan and the account to pay from.");
            return;
        }

        const parsedAmount = Number(amount);
        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            setError("Enter a valid payment amount.");
            return;
        }

        if (parsedAmount > selectedLoan.remainingAmount) {
            setError("Payment amount cannot exceed the remaining loan amount.");
            return;
        }

        try {
            const updatedLoan = await makePayment.mutateAsync({
                loanId: selectedLoan.id,
                paymentAccountId,
                amount: parsedAmount,
            });

            setCustomer((current) =>
                current
                    ? {
                          ...current,
                          loans: current.loans.map((loan) =>
                              loan.id === updatedLoan.id ? updatedLoan : loan,
                          ),
                      }
                    : current,
            );
            setSelectedLoan(updatedLoan);
            setAmount("");
            setPaymentAccountId("");
        } catch {
            setError("Payment could not be completed. Please try again.");
        }
    };

    const paymentAccounts = accounts?.filter(
        (account) => account.currency === selectedLoan?.currency,
    ) ?? [];

    return (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-base font-semibold text-slate-900">
                    Pay another user's loan
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                    Find the customer with FIN and birth date, then select one of their loans.
                </p>
            </div>

            <form onSubmit={handleSearch} className="mt-5 grid gap-4 sm:grid-cols-3">
                <input
                    value={fin}
                    onChange={(event) => setFin(event.target.value)}
                    placeholder="FIN"
                    maxLength={7}
                    className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
                <input
                    type="date"
                    value={birthDate}
                    onChange={(event) => setBirthDate(event.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                >
                    {loading ? "Searching..." : "Find customer"}
                </button>
            </form>

            {error && (
                <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {customer && (
                <div className="mt-6">
                    <div className="rounded-lg bg-slate-50 p-4">
                        <p className="font-medium text-slate-900">
                            {customer.firstName} {customer.lastName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                            FIN: {customer.fin} · Birth date: {customer.birthDate}
                        </p>
                    </div>

                    {customer.loans.length === 0 ? (
                        <p className="mt-4 text-sm text-slate-500">
                            This customer has no loans.
                        </p>
                    ) : (
                        <div className="mt-4 space-y-3">
                            {customer.loans.map((loan) => (
                                <button
                                    key={loan.id}
                                    type="button"
                                    onClick={() => setSelectedLoan(loan)}
                                    className={`w-full rounded-xl border p-4 text-left transition hover:border-slate-400 ${
                                        selectedLoan?.id === loan.id
                                            ? "border-slate-900 bg-slate-50"
                                            : "border-slate-200"
                                    }`}
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="font-medium text-slate-900">
                                                {loan.principalAmount.toFixed(2)} {loan.currency}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Status: {loan.status}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-slate-900">
                                                {loan.remainingAmount.toFixed(2)} {loan.currency}
                                            </p>
                                            <p className="text-xs text-slate-500">Remaining</p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {selectedLoan && selectedLoan.status === "ACTIVE" && selectedLoan.remainingAmount > 0 && (
                        <form onSubmit={handlePayment} className="mt-6 space-y-4 border-t border-slate-200 pt-6">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Pay from your account
                                </label>
                                <select
                                    value={paymentAccountId}
                                    onChange={(event) => setPaymentAccountId(event.target.value)}
                                    disabled={makePayment.isPending}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                                >
                                    <option value="">Select an account</option>
                                    {paymentAccounts.map((account) => (
                                        <option key={account.id} value={account.id}>
                                            {account.iban} — {account.balance.toFixed(2)} {account.currency}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Payment amount
                                </label>
                                <div className="flex">
                                    <input
                                        type="number"
                                        min="0.01"
                                        max={selectedLoan.remainingAmount}
                                        step="0.01"
                                        value={amount}
                                        onChange={(event) => setAmount(event.target.value)}
                                        className="min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-sm"
                                    />
                                    <div className="flex items-center rounded-r-lg border border-slate-300 bg-slate-50 px-4 text-sm text-slate-600">
                                        {selectedLoan.currency}
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={makePayment.isPending || !paymentAccountId || paymentAccounts.length === 0}
                                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:opacity-50"
                            >
                                {makePayment.isPending ? "Processing..." : "Pay loan"}
                            </button>
                        </form>
                    )}
                </div>
            )}
        </div>
    );
}

export default ThirdPartyLoanPayment;
