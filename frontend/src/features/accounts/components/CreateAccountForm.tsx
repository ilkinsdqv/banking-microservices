import {
    Check,
    ChevronDown,
    CircleDollarSign,
    CreditCard,
    WalletCards,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../../../components/ui";
import {
    createAccountSchema,
    type CreateAccountFormValues,
} from "../schemas/create-account-schema";
import { useCreateAccount } from "../hooks/use-create-account";

interface CreateAccountFormProps {
    onSuccess?: () => void;
    onCancel?: () => void;
}

function CreateAccountForm({
                               onSuccess,
                               onCancel,
                           }: CreateAccountFormProps) {
    const createAccount = useCreateAccount();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<CreateAccountFormValues>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            currency: "AZN",
            type: "CHECKING",
        },
    });

    const selectedCurrency = watch("currency");
    const selectedType = watch("type");

    const onSubmit = async (
        values: CreateAccountFormValues,
    ) => {
        await createAccount.mutateAsync(values);
        onSuccess?.();
    };

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
                    <WalletCards
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                </div>

                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                        Create account
                    </h2>

                    <p className="mt-1 text-sm leading-5 text-slate-500">
                        Set up a new bank account in a few
                        steps.
                    </p>
                </div>
            </div>

            {createAccount.isError && (
                <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                >
                    <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                    <p className="text-sm leading-5 text-red-700">
                        Account yaratmaq mümkün olmadı.
                        Zəhmət olmasa yenidən cəhd edin.
                    </p>
                </div>
            )}

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor="currency"
                        className="text-sm font-semibold text-slate-800"
                    >
                        Currency
                    </label>

                    <span className="text-xs text-slate-400">
                        Choose account currency
                    </span>
                </div>

                <div className="relative">
                    <CircleDollarSign className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />

                    <select
                        id="currency"
                        disabled={createAccount.isPending}
                        {...register("currency")}
                        className={[
                            "h-12 w-full appearance-none rounded-xl",
                            "border border-slate-200 bg-white",
                            "pl-10 pr-10 text-sm font-medium text-slate-800",
                            "shadow-sm transition-all",
                            "hover:border-slate-300",
                            "focus:border-slate-400 focus:outline-none",
                            "focus:ring-4 focus:ring-slate-100",
                            "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
                            errors.currency
                                ? "border-red-300 focus:border-red-400 focus:ring-red-50"
                                : "",
                        ].join(" ")}
                    >
                        <option value="AZN">
                            AZN — Azerbaijani Manat
                        </option>
                        <option value="USD">
                            USD — US Dollar
                        </option>
                        <option value="EUR">
                            EUR — Euro
                        </option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                </div>

                {errors.currency && (
                    <p className="text-xs font-medium text-red-600">
                        {errors.currency.message}
                    </p>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <label
                        htmlFor="type"
                        className="text-sm font-semibold text-slate-800"
                    >
                        Account type
                    </label>

                    <span className="text-xs text-slate-400">
                        Select account purpose
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <label
                        className={[
                            "relative cursor-pointer rounded-xl border p-4 transition-all",
                            selectedType === "CHECKING"
                                ? "border-slate-900 bg-slate-950 text-white shadow-md"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                            createAccount.isPending
                                ? "pointer-events-none opacity-60"
                                : "",
                        ].join(" ")}
                    >
                        <input
                            type="radio"
                            value="CHECKING"
                            className="sr-only"
                            disabled={
                                createAccount.isPending
                            }
                            {...register("type")}
                        />

                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <CreditCard
                                    className={[
                                        "h-5 w-5",
                                        selectedType ===
                                        "CHECKING"
                                            ? "text-white"
                                            : "text-slate-500",
                                    ].join(" ")}
                                    aria-hidden="true"
                                />

                                <p className="mt-3 text-sm font-semibold">
                                    Checking
                                </p>

                                <p
                                    className={[
                                        "mt-1 text-xs",
                                        selectedType ===
                                        "CHECKING"
                                            ? "text-slate-300"
                                            : "text-slate-500",
                                    ].join(" ")}
                                >
                                    Everyday banking
                                </p>
                            </div>

                            {selectedType ===
                                "CHECKING" && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-950">
                                    <Check
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                    />
                                </span>
                                )}
                        </div>
                    </label>

                    <label
                        className={[
                            "relative cursor-pointer rounded-xl border p-4 transition-all",
                            selectedType === "SAVINGS"
                                ? "border-slate-900 bg-slate-950 text-white shadow-md"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
                            createAccount.isPending
                                ? "pointer-events-none opacity-60"
                                : "",
                        ].join(" ")}
                    >
                        <input
                            type="radio"
                            value="SAVINGS"
                            className="sr-only"
                            disabled={
                                createAccount.isPending
                            }
                            {...register("type")}
                        />

                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <WalletCards
                                    className={[
                                        "h-5 w-5",
                                        selectedType ===
                                        "SAVINGS"
                                            ? "text-white"
                                            : "text-slate-500",
                                    ].join(" ")}
                                    aria-hidden="true"
                                />

                                <p className="mt-3 text-sm font-semibold">
                                    Savings
                                </p>

                                <p
                                    className={[
                                        "mt-1 text-xs",
                                        selectedType ===
                                        "SAVINGS"
                                            ? "text-slate-300"
                                            : "text-slate-500",
                                    ].join(" ")}
                                >
                                    Save your money
                                </p>
                            </div>

                            {selectedType ===
                                "SAVINGS" && (
                                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-slate-950">
                                    <Check
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                    />
                                </span>
                                )}
                        </div>
                    </label>
                </div>

                {errors.type && (
                    <p className="text-xs font-medium text-red-600">
                        {errors.type.message}
                    </p>
                )}
            </div>

            <div className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                    <p className="text-xs font-medium text-slate-600">
                        New {selectedCurrency}{" "}
                        {selectedType === "CHECKING"
                            ? "checking"
                            : "savings"}{" "}
                        account
                    </p>
                </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    disabled={createAccount.isPending}
                    onClick={onCancel}
                    className="w-full sm:w-auto"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    loading={createAccount.isPending}
                    className="w-full sm:w-auto"
                >
                    <WalletCards
                        className="h-4 w-4"
                        aria-hidden="true"
                    />
                    {createAccount.isPending
                        ? "Creating..."
                        : "Create account"}
                </Button>
            </div>
        </form>
    );
}

export default CreateAccountForm;