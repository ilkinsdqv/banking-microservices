import { useState } from "react";

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
    const [error, setError] = useState("");

    const makePayment = useMakeLoanPayment();

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

        if (parsedAmount > loan.remainingAmount) {
            setError(
                "Payment amount cannot exceed the remaining loan amount.",
            );
            return;
        }

        try {
            await makePayment.mutateAsync({
                loanId: loan.id,
                amount: parsedAmount,
            });

            setAmount("");
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
                        loan.remainingAmount <= 0
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