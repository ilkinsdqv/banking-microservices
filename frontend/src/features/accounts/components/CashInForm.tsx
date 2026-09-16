import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    cashInSchema,
    type CashInFormValues,
} from "../schemas/cash-in-schema";
import { useCashIn } from "../hooks/use-cash-in";
import type { Account } from "../types/account";

interface CashInFormProps {
    account: Account;
    onSuccess?: () => void;
    onCancel?: () => void;
}

function CashInForm({
                        account,
                        onSuccess,
                        onCancel,
                    }: CashInFormProps) {
    const cashIn = useCashIn();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<CashInFormValues>({
        resolver: zodResolver(cashInSchema),
    });

    const onSubmit = async (values: CashInFormValues) => {
        await cashIn.mutateAsync({
            accountId: account.id,
            amount: values.amount,
        });

        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Cash in
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Add money to your account.
                </p>
            </div>

            <div className="rounded-lg bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Account</p>

                <p className="mt-1 text-sm font-medium text-slate-800">
                    {account.iban}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    Current balance:{" "}
                    <span className="font-medium text-slate-700">
            {account.balance.toFixed(2)} {account.currency}
          </span>
                </p>
            </div>

            {cashIn.isError && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    Cash In əməliyyatı uğursuz oldu. Zəhmət olmasa yenidən
                    cəhd edin.
                </div>
            )}

            <div>
                <label
                    htmlFor="cash-in-amount"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    Amount ({account.currency})
                </label>

                <input
                    id="cash-in-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    disabled={cashIn.isPending}
                    {...register("amount", {
                        valueAsNumber: true,
                    })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                {errors.amount && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.amount.message}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={cashIn.isPending}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={cashIn.isPending}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {cashIn.isPending ? "Processing..." : "Cash in"}
                </button>
            </div>
        </form>
    );
}

export default CashInForm;