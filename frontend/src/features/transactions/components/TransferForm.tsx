import {
    ArrowDownToLine,
    ArrowRight,
    ArrowRightLeft,
    CheckCircle2,
    CircleDollarSign,
    CreditCard,
    FileText,
    ShieldCheck,
    WalletCards,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button, Input } from "../../../components/ui";
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
        watch,
        formState: { errors },
    } = useForm<TransferFormValues>({
        resolver: zodResolver(transferSchema),
        defaultValues: {
            fromAccountId: "",
            destinationType: "OWN_ACCOUNT",
            toAccountId: "",
            toAccountNumber: "",
            amount: undefined,
            currency: "AZN",
            description: "",
        },
    });

    const fromAccountId = watch("fromAccountId");
    const toAccountId = watch("toAccountId");
    const destinationType = watch("destinationType");
    const amount = watch("amount");

    const sourceAccount = accounts?.find(
        (account) => account.id === fromAccountId,
    );

    const destinationAccount =
        destinationType === "OWN_ACCOUNT"
            ? accounts?.find(
                  (account) => account.id === toAccountId,
              )
            : undefined;

    const sourceCurrency = sourceAccount?.currency;
    const destinationCurrency = destinationAccount?.currency;

    const isCrossCurrency =
        Boolean(sourceCurrency) &&
        Boolean(destinationCurrency) &&
        sourceCurrency !== destinationCurrency;

    const onSubmit = async (values: TransferFormValues) => {
        const selectedSourceAccount = accounts?.find(
            (account) => account.id === values.fromAccountId,
        );

        if (!selectedSourceAccount) {
            return;
        }

        await createTransaction.mutateAsync({
            fromAccountId: values.fromAccountId,

            ...(values.destinationType === "OWN_ACCOUNT"
                ? { toAccountId: values.toAccountId }
                : { toAccountNumber: values.toAccountNumber }),

            amount: values.amount,

            currency: selectedSourceAccount.currency,

            type: "TRANSFER",

            description: values.description || undefined,
        });

        onSuccess?.();
    };

    if (isAccountsLoading) {
        return (
            <div className="space-y-5">
                <div className="h-5 w-36 animate-pulse rounded-lg bg-slate-200" />

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
                        <h2 className="font-semibold text-slate-900">
                            No accounts available
                        </h2>

                        <p className="mt-1 text-sm leading-5 text-slate-600">
                            You need at least one account to make a transfer.
                        </p>
                    </div>
                </div>

                <div className="mt-5 flex justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            {createTransaction.isError && (
                <div
                    role="alert"
                    className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4"
                >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-100">
                        <ArrowRightLeft className="h-4 w-4 text-red-600" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-red-800">
                            Transfer failed
                        </p>

                        <p className="mt-0.5 text-sm text-red-700">
                            Please check the account details and try again.
                        </p>
                    </div>
                </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                        <ArrowRightLeft className="h-4 w-4 text-slate-700" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-900">
                            Transfer accounts
                        </p>

                        <p className="text-xs text-slate-500">
                            Transfer between your own accounts or send to another account.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
                    <div>
                        <label
                            htmlFor="fromAccountId"
                            className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500"
                        >
                            From account
                        </label>

                        <div className="relative">
                            <WalletCards className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                            <select
                                id="fromAccountId"
                                disabled={createTransaction.isPending}
                                {...register("fromAccountId")}
                                className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-100"
                            >
                                <option value="">
                                    Select account
                                </option>

                                {accounts.map((account) => (
                                    <option
                                        key={account.id}
                                        value={account.id}
                                    >
                                        {account.accountNumber} —{" "}
                                        {account.balance.toFixed(2)}{" "}
                                        {account.currency}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {errors.fromAccountId && (
                            <p className="mt-1.5 text-xs font-medium text-red-600">
                                {errors.fromAccountId.message}
                            </p>
                        )}
                    </div>

                    <div className="hidden h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm md:flex">
                        <ArrowRight className="h-4 w-4 text-slate-400" />
                    </div>

                    <div>
                        <div className="mb-2 flex items-center gap-4">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Destination
                            </label>

                            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                                <input
                                    type="radio"
                                    value="OWN_ACCOUNT"
                                    disabled={createTransaction.isPending}
                                    {...register("destinationType")}
                                />
                                My account
                            </label>

                            <label className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                                <input
                                    type="radio"
                                    value="OTHER_ACCOUNT"
                                    disabled={createTransaction.isPending}
                                    {...register("destinationType")}
                                />
                                Other account
                            </label>
                        </div>

                        {destinationType === "OWN_ACCOUNT" ? (
                            <>
                                <div className="relative">
                                    <WalletCards className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <select
                                        id="toAccountId"
                                        disabled={createTransaction.isPending}
                                        {...register("toAccountId")}
                                        className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-medium text-slate-800 outline-none transition hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-100"
                                    >
                                        <option value="">
                                            Select account
                                        </option>

                                        {accounts.map((account) => (
                                            <option
                                                key={account.id}
                                                value={account.id}
                                            >
                                                {account.accountNumber} —{" "}
                                                {account.currency}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {errors.toAccountId && (
                                    <p className="mt-1.5 text-xs font-medium text-red-600">
                                        {errors.toAccountId.message}
                                    </p>
                                )}
                            </>
                        ) : (
                            <>
                                <div className="relative">
                                    <CreditCard className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />

                                    <input
                                        id="toAccountNumber"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="off"
                                        maxLength={16}
                                        placeholder="16-digit account number"
                                        disabled={createTransaction.isPending}
                                        {...register("toAccountNumber")}
                                        className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 font-mono text-sm font-medium tracking-wider text-slate-800 outline-none transition placeholder:font-sans placeholder:tracking-normal placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-100"
                                    />
                                </div>

                                {errors.toAccountNumber && (
                                    <p className="mt-1.5 text-xs font-medium text-red-600">
                                        {errors.toAccountNumber.message}
                                    </p>
                                )}

                                {sourceCurrency && (
                                    <p className="mt-1.5 text-xs text-slate-500">
                                        Transfer currency:{" "}
                                        <span className="font-semibold text-slate-700">
                                            {sourceCurrency}
                                        </span>
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1fr_180px]">
                <Input
                    label="Amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    disabled={createTransaction.isPending}
                    leftElement={
                        <CircleDollarSign className="h-4 w-4" />
                    }
                    error={errors.amount?.message}
                    {...register("amount", {
                        valueAsNumber: true,
                    })}
                />

                <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                        Transfer currency
                    </label>

                    <div className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3">
                        <CircleDollarSign className="h-4 w-4 text-slate-400" />

                        <span className="text-sm font-semibold text-slate-800">
                            {sourceCurrency ?? "—"}
                        </span>

                        <span className="text-xs text-slate-400">
                            Source account
                        </span>
                    </div>
                </div>
            </div>

            {destinationCurrency && sourceCurrency && (
                <div
                    className={
                        isCrossCurrency
                            ? "rounded-2xl border border-blue-200 bg-blue-50/70 p-4"
                            : "rounded-2xl border border-slate-200 bg-slate-50/70 p-4"
                    }
                >
                    <div className="flex items-start gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
                            <ArrowRightLeft className="h-4 w-4 text-slate-600" />
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                {isCrossCurrency
                                    ? "Currency conversion"
                                    : "Transfer currency"}
                            </p>

                            <p className="mt-1 text-sm text-slate-600">
                                {isCrossCurrency
                                    ? `${sourceCurrency} → ${destinationCurrency}`
                                    : `Both accounts use ${sourceCurrency}.`}
                            </p>

                            {isCrossCurrency && amount > 0 && (
                                <p className="mt-2 text-xs text-slate-500">
                                    The final converted amount and exchange
                                    rate will be calculated by the bank
                                    backend when the transfer is processed.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div>
                <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-medium text-slate-700"
                >
                    Description
                </label>

                <div className="relative">
                    <FileText className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />

                    <textarea
                        id="description"
                        rows={3}
                        maxLength={500}
                        placeholder="Optional description"
                        disabled={createTransaction.isPending}
                        {...register("description")}
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                </div>

                {errors.description && (
                    <p className="mt-1.5 text-xs font-medium text-red-600">
                        {errors.description.message}
                    </p>
                )}
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-600" />

                <p className="text-xs leading-5 text-slate-500">
                    Review the destination account and transfer amount before
                    confirming the transaction.
                </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={createTransaction.isPending}
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    disabled={
                        createTransaction.isPending ||
                        !sourceCurrency
                    }
                    className="min-w-40"
                >
                    {createTransaction.isPending ? (
                        <>
                            <ArrowDownToLine className="h-4 w-4 animate-pulse" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="h-4 w-4" />
                            Transfer money
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}

export default TransferForm;