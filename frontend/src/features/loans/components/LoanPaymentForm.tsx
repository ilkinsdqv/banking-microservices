import { useState } from "react";

import { useAuth } from "../../auth/hooks/use-auth";
import { useAccounts } from "../../accounts/hooks/use-accounts";

import { useMakeLoanPayment } from "../hooks/use-make-loan-payment";
import type { Loan } from "../types/loan";

interface LoanPaymentFormProps {
    loan: Loan;
    onSuccess: () => void;
}

function LoanPaymentForm({
                             loan,
                             onSuccess,
                         }: LoanPaymentFormProps) {
    const [amount, setAmount] = useState("");
    const [paymentAccountId, setPaymentAccountId] = useState("");
    const [error, setError] = useState("");

    const makePayment = useMakeLoanPayment();

    const { user } = useAuth();
    const { data: accounts, isLoading: isAccountsLoading, isError: isAccountsError } =
        useAccounts(user?.id ?? null);

    const paymentAccounts = accounts?.filter(
        (account) => account.currency === loan.currency,
    ) ?? [];

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setError("");

        const parsedAmount = Number(amount);

        if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
            setError("Enter a valid payment amount.");
            return;
        }

        if (!paymentAccountId) {
            setError("Please select the account to pay from.");
            return;
        }

        if (parsedAmount > loan.remainingAmount) {
            setError(
                "Payment amount cannot exceed the remaining loan amount.",
            );
            return;
        }

        try {
            await makePayment.mutateAsync({
                loanId: loan.id,
                paymentAccountId,
                amount: parsedAmount,
            });

            setAmount("");
            setPaymentAccountId("");
            onSuccess();
        } catch {
            setError(
                "Payment could not be completed. Please try again.",
            );
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div>
                <h2 className="text-base font-semibold text-slate-900">
                    Make a payment
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Remaining amount:{" "}
                    <span className="font-medium text-slate-700">
            {loan.remainingAmount.toFixed(2)} {loan.currency}
          </span>
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mt-5 space-y-4"
            >
                <div>
                    <label
                        htmlFor="payment-account"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Pay from account
                    </label>

                    {isAccountsLoading ? (
                        <div className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-500">
                            Loading your accounts...
                        </div>
                    ) : isAccountsError ? (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
                            Could not load your accounts.
                        </div>
                    ) : (
                        <select
                            id="payment-account"
                            value={paymentAccountId}
                            onChange={(event) => setPaymentAccountId(event.target.value)}
                            disabled={makePayment.isPending || paymentAccounts.length === 0}
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="">Select an account</option>
                            {paymentAccounts.map((account) => (
                                <option key={account.id} value={account.id}>
                                    {account.iban} — {account.balance.toFixed(2)} {account.currency}
                                </option>
                            ))}
                        </select>
                    )}

                    {paymentAccounts.length === 0 && !isAccountsLoading && !isAccountsError && (
                        <p className="mt-2 text-sm text-amber-700">
                            You do not have an account in {loan.currency} available for this payment.
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="payment-amount"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Payment amount
                    </label>

                    <div className="flex">
                        <input
                            id="payment-amount"
                            type="number"
                            min="0.01"
                            max={loan.remainingAmount}
                            step="0.01"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            placeholder="100.00"
                            disabled={makePayment.isPending}
                            className="min-w-0 flex-1 rounded-l-lg border border-r-0 border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        />

                        <div className="flex items-center rounded-r-lg border border-slate-300 bg-slate-50 px-4 text-sm font-medium text-slate-600">
                            {loan.currency}
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                        <p className="text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={
                        makePayment.isPending ||
                        loan.remainingAmount <= 0 ||
                        !paymentAccountId ||
                        paymentAccounts.length === 0
                    }
                    className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {makePayment.isPending
                        ? "Processing..."
                        : "Make payment"}
                </button>
            </form>
        </div>
    );
}

export default LoanPaymentForm;