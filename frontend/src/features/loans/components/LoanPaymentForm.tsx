import {
    Banknote,
    CheckCircle2,
    CircleDollarSign,
    CreditCard,
    ShieldCheck,
} from "lucide-react";
import { useState } from "react";

import { Button, Input } from "../../../components/ui";
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

    const remainingAmount = loan.remainingAmount.toFixed(2);

    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-slate-50/70 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
                        <Banknote className="h-5 w-5 text-indigo-600" />
                    </div>

                    <div>
                        <h2 className="text-base font-semibold text-slate-900">
                            Make a payment
                        </h2>

                        <p className="mt-0.5 text-xs text-slate-500">
                            Make a payment toward your active loan.
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-5 sm:p-6">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                                <CircleDollarSign className="h-4 w-4 text-slate-600" />
                            </div>

                            <div>
                                <p className="text-xs font-medium text-slate-400">
                                    Remaining balance
                                </p>

                                <p className="mt-0.5 text-sm font-semibold text-slate-900">
                                    {remainingAmount} {loan.currency}
                                </p>
                            </div>
                        </div>

                        <CreditCard className="h-5 w-5 text-slate-300" />
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-5 space-y-5"
                >
                    <Input
                        label="Payment amount"
                        type="number"
                        min="0.01"
                        max={loan.remainingAmount}
                        step="0.01"
                        inputMode="decimal"
                        placeholder="100.00"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        disabled={makePayment.isPending}
                        leftElement={
                            <CircleDollarSign className="h-4 w-4" />
                        }
                        rightElement={
                            <span className="font-semibold">
                                {loan.currency}
                            </span>
                        }
                    />

                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
                                <CreditCard className="h-4 w-4 text-red-600" />
                            </div>

                            <p className="pt-1 text-sm font-medium text-red-700">
                                {error}
                            </p>
                        </div>
                    )}

                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3.5">
                        <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />

                        <p className="text-xs leading-5 text-slate-600">
                            Your payment will be applied to this loan after
                            confirmation.
                        </p>
                    </div>

                    <Button
                        type="submit"
                        disabled={
                            makePayment.isPending ||
                            loan.remainingAmount <= 0
                        }
                        className="w-full"
                    >
                        {makePayment.isPending ? (
                            <>
                                <Banknote className="h-4 w-4 animate-pulse" />
                                Processing...
                            </>
                        ) : (
                            <>
                                <CheckCircle2 className="h-4 w-4" />
                                Make payment
                            </>
                        )}
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default LoanPaymentForm;