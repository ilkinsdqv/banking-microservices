import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAccounts } from "../../accounts/hooks/use-accounts";
import { useAuth } from "../../auth/hooks/use-auth";
import {
    transferSchema,
    type TransferFormValues,
} from "../schemas/transfer-schema";
import { useCreateTransaction } from "../hooks/use-create-transaction";

interface TransferFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

function TransferForm({
                          onSuccess,
                          onCancel,
                      }: TransferFormProps) {
    const { user } = useAuth();

    const {
        data: accounts,
        isLoading: isAccountsLoading,
    } = useAccounts(user?.id ?? null);

    const createTransaction = useCreateTransaction();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TransferFormValues>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            fromAccountId: "",
            toAccountId: "",
            amount: undefined,
            currency: "AZN",
            description: "",
        },
    });

    const onSubmit = async (values: TransferFormValues) => {
        await createTransaction.mutateAsync({
            fromAccountId: values.fromAccountId,
            toAccountId: values.toAccountId,
            amount: values.amount,
            currency: values.currency,
            type: "TRANSFER",
            description: values.description || undefined,
        });

        onSuccess?.();
    };

    if (isAccountsLoading) {
        return (
            <div className="space-y-4">
                <div className="h-6 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-11 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-11 animate-pulse rounded-lg bg-slate-200" />
                <div className="h-11 animate-pulse rounded-lg bg-slate-200" />
            </div>
        );
    }

    if (!accounts || accounts.length === 0) {
        return (
            <div className="space-y-5">
                <div>
                    <h2 className="text-lg font-semibold text-slate-900">
                        Transfer money
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        You need at least one account to make a transfer.
                    </p>
                </div>

                <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    No accounts are available.
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
        >
            <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Transfer money
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Transfer money between accounts.
                </p>
            </div>

            {createTransaction.isError && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    Transfer failed. Please check the account details and
                    try again.
                </div>
            )}

            <div>
                <label
                    htmlFor="fromAccountId"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    From account
                </label>

                <select
                    id="fromAccountId"
                    disabled={createTransaction.isPending}
                    {...register("fromAccountId")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                    <option value="">Select account</option>

                    {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.iban} — {account.balance.toFixed(2)}{" "}
                            {account.currency}
                        </option>
                    ))}
                </select>

                {errors.fromAccountId && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.fromAccountId.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="toAccountId"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    To account
                </label>

                <select
                    id="toAccountId"
                    disabled={createTransaction.isPending}
                    {...register("toAccountId")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                    <option value="">Select account</option>

                    {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.iban} — {account.currency}
                        </option>
                    ))}
                </select>

                {errors.toAccountId && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.toAccountId.message}
                    </p>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="amount"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Amount
                    </label>

                    <input
                        id="amount"
                        type="number"
                        min="0.01"
                        step="0.01"
                        inputMode="decimal"
                        placeholder="0.00"
                        disabled={createTransaction.isPending}
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

                <div>
                    <label
                        htmlFor="currency"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Currency
                    </label>

                    <select
                        id="currency"
                        disabled={createTransaction.isPending}
                        {...register("currency")}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        <option value="AZN">AZN</option>
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                    </select>

                    {errors.currency && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.currency.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label
                    htmlFor="description"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    Description
                </label>

                <textarea
                    id="description"
                    rows={3}
                    maxLength={500}
                    placeholder="Optional description"
                    disabled={createTransaction.isPending}
                    {...register("description")}
                    className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                {errors.description && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={createTransaction.isPending}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={createTransaction.isPending}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {createTransaction.isPending
                        ? "Processing..."
                        : "Transfer money"}
                </button>
            </div>
        </form>
    );
}

export default TransferForm;