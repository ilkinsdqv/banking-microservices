import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../auth/hooks/use-auth";
import { useAccounts } from "../../accounts/hooks/use-accounts";
import { useCreateLoan } from "../hooks/use-create-loan";
import {
    createLoanSchema,
    type CreateLoanFormValues,
} from "../schemas/create-loan-schema";

interface CreateLoanFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

function CreateLoanForm({
                            onSuccess,
                            onCancel,
                        }: CreateLoanFormProps) {
    const { user } = useAuth();

    const {
        data: accounts,
        isLoading: isAccountsLoading,
        isError: isAccountsError,
    } = useAccounts(user?.id ?? null);

    const createLoan = useCreateLoan();

    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm<CreateLoanFormValues>({
        resolver: zodResolver(createLoanSchema),
        defaultValues: {
            accountId: "",
            principalAmount: undefined,
            interestRate: undefined,
            termMonths: undefined,
            currency: "AZN",
        },
    });

    const selectedAccountId = useWatch({
        control,
        name: "accountId",
    });

    useEffect(() => {
        const selectedAccount = accounts?.find(
            (account) => account.id === selectedAccountId,
        );

        if (selectedAccount) {
            setValue("currency", selectedAccount.currency);
        }
    }, [accounts, selectedAccountId, setValue]);

    const onSubmit = async (values: CreateLoanFormValues) => {
        try {
            await createLoan.mutateAsync({
                accountId: values.accountId,
                principalAmount: values.principalAmount,
                interestRate: values.interestRate,
                termMonths: values.termMonths,
                currency: values.currency,
            });

            onSuccess();
        } catch {
            // Server error is displayed below.
        }
    };

    if (!user) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm text-red-700">
                    User session could not be restored.
                </p>
            </div>
        );
    }

    if (isAccountsLoading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">
                    Loading your accounts...
                </p>
            </div>
        );
    }

    if (isAccountsError) {
        return (
            <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                <p className="text-sm font-medium text-red-800">
                    Could not load your accounts.
                </p>

                <p className="mt-1 text-sm text-red-600">
                    Please try again later.
                </p>
            </div>
        );
    }

    if (!accounts || accounts.length === 0) {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="font-semibold text-amber-900">
                    No accounts available
                </h3>

                <p className="mt-1 text-sm text-amber-700">
                    You need an account before applying for a loan.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <label
                    htmlFor="loan-account"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Loan account
                </label>

                <select
                    id="loan-account"
                    {...register("accountId")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                    <option value="">Select an account</option>

                    {accounts.map((account) => (
                        <option key={account.id} value={account.id}>
                            {account.iban} — {account.balance.toFixed(2)}{" "}
                            {account.currency}
                        </option>
                    ))}
                </select>

                {errors.accountId && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.accountId.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="principal-amount"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Loan amount
                </label>

                <input
                    id="principal-amount"
                    type="number"
                    min="100"
                    step="0.01"
                    placeholder="1000.00"
                    {...register("principalAmount", {
                        valueAsNumber: true,
                    })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                />

                {errors.principalAmount && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.principalAmount.message}
                    </p>
                )}
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="interest-rate"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Interest rate (%)
                    </label>

                    <input
                        id="interest-rate"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="12.5"
                        {...register("interestRate", {
                            valueAsNumber: true,
                        })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />

                    {errors.interestRate && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.interestRate.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="term-months"
                        className="mb-2 block text-sm font-medium text-slate-700"
                    >
                        Term (months)
                    </label>

                    <input
                        id="term-months"
                        type="number"
                        min="1"
                        max="120"
                        step="1"
                        placeholder="12"
                        {...register("termMonths", {
                            valueAsNumber: true,
                        })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                    />

                    {errors.termMonths && (
                        <p className="mt-1 text-sm text-red-600">
                            {errors.termMonths.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label
                    htmlFor="loan-currency"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Currency
                </label>

                <Controller
                    name="currency"
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            id="loan-currency"
                            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                        >
                            <option value="AZN">AZN</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    )}
                />

                {errors.currency && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.currency.message}
                    </p>
                )}
            </div>

            {createLoan.isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm text-red-700">
                        Could not create the loan. Please check your information and try
                        again.
                    </p>
                </div>
            )}

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={createLoan.isPending}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={createLoan.isPending}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {createLoan.isPending ? "Submitting..." : "Apply for loan"}
                </button>
            </div>
        </form>
    );
}

export default CreateLoanForm;