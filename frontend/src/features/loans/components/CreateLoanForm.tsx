import {
    Banknote,
    ChevronDown,
    CircleDollarSign,
    CreditCard,
    FilePlus2,
    Percent,
    ShieldCheck,
    WalletCards,
} from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "../../../components/ui";
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
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
                    <ShieldCheck className="h-4 w-4 text-red-600" />
                </div>

                <div>
                    <p className="text-sm font-semibold text-red-800">
                        User session could not be restored.
                    </p>

                    <p className="mt-1 text-xs text-red-600">
                        Please sign in again and try submitting the application.
                    </p>
                </div>
            </div>
        );
    }

    if (isAccountsLoading) {
        return (
            <div className="space-y-5">
                <div className="space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                    <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                </div>

                <div className="space-y-2">
                    <div className="h-4 w-28 animate-pulse rounded bg-slate-200" />
                    <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
                    <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
                </div>

                <div className="h-12 animate-pulse rounded-xl bg-slate-100" />
            </div>
        );
    }

    if (isAccountsError) {
        return (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
                    <WalletCards className="h-4 w-4 text-red-600" />
                </div>

                <div>
                    <p className="text-sm font-semibold text-red-800">
                        Could not load your accounts.
                    </p>

                    <p className="mt-1 text-xs text-red-600">
                        Please try again later.
                    </p>
                </div>
            </div>
        );
    }

    if (!accounts || accounts.length === 0) {
        return (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5">
                <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-100">
                        <WalletCards className="h-5 w-5 text-amber-700" />
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-900">
                            No accounts available
                        </h3>

                        <p className="mt-1 text-sm leading-5 text-slate-600">
                            You need an account before applying for a loan.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                        <WalletCards className="h-4 w-4 text-slate-600" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Loan account
                        </p>

                        <p className="text-xs text-slate-500">
                            Select the account associated with this loan.
                        </p>
                    </div>
                </div>

                <div className="relative">
                    <WalletCards className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <select
                        id="loan-account"
                        disabled={createLoan.isPending}
                        {...register("accountId")}
                        className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-100"
                    >
                        <option value="">Select an account</option>

                        {accounts.map((account) => (
                            <option
                                key={account.id}
                                value={account.id}
                            >
                                {account.iban} —{" "}
                                {account.balance.toFixed(2)}{" "}
                                {account.currency}
                            </option>
                        ))}
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                {errors.accountId && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.accountId.message}
                    </p>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="Loan amount"
                    type="number"
                    min="100"
                    step="0.01"
                    placeholder="1000.00"
                    disabled={createLoan.isPending}
                    leftElement={
                        <CircleDollarSign className="h-4 w-4" />
                    }
                    error={errors.principalAmount?.message}
                    {...register("principalAmount", {
                        valueAsNumber: true,
                    })}
                />

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
                            <div className="relative">
                                <CircleDollarSign className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                <select
                                    {...field}
                                    id="loan-currency"
                                    disabled={createLoan.isPending}
                                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-semibold text-slate-800 outline-none transition hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-100"
                                >
                                    <option value="AZN">AZN</option>
                                    <option value="USD">USD</option>
                                    <option value="EUR">EUR</option>
                                </select>

                                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            </div>
                        )}
                    />

                    {errors.currency && (
                        <p className="mt-1.5 text-xs font-medium text-red-600">
                            {errors.currency.message}
                        </p>
                    )}
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Input
                    label="Interest rate"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="12.5"
                    disabled={createLoan.isPending}
                    leftElement={
                        <Percent className="h-4 w-4" />
                    }
                    rightElement="%"
                    error={errors.interestRate?.message}
                    {...register("interestRate", {
                        valueAsNumber: true,
                    })}
                />

                <Input
                    label="Term"
                    type="number"
                    min="1"
                    max="120"
                    step="1"
                    placeholder="12"
                    disabled={createLoan.isPending}
                    leftElement={
                        <CalendarIcon />
                    }
                    rightElement="months"
                    error={errors.termMonths?.message}
                    {...register("termMonths", {
                        valueAsNumber: true,
                    })}
                />
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />

                <p className="text-xs leading-5 text-slate-600">
                    Review the loan amount, interest rate and repayment term
                    carefully before submitting your application.
                </p>
            </div>

            {createLoan.isError && (
                <div
                    role="alert"
                    className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
                        <Banknote className="h-4 w-4 text-red-600" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-red-800">
                            Could not create the loan
                        </p>

                        <p className="mt-0.5 text-sm text-red-700">
                            Please check your information and try again.
                        </p>
                    </div>
                </div>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={createLoan.isPending}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={createLoan.isPending}
                    className="min-w-40"
                >
                    {createLoan.isPending ? (
                        <>
                            <Banknote className="h-4 w-4 animate-pulse" />
                            Submitting...
                        </>
                    ) : (
                        <>
                            <FilePlus2 className="h-4 w-4" />
                            Apply for loan
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

function CalendarIcon() {
    return <CreditCard className="h-4 w-4" />;
}

export default CreateLoanForm;