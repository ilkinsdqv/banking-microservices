import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
        formState: { errors },
    } = useForm<CreateAccountFormValues>({
        resolver: zodResolver(createAccountSchema),
        defaultValues: {
            currency: "AZN",
            type: "CHECKING",
        },
    });

    const onSubmit = async (values: CreateAccountFormValues) => {
        await createAccount.mutateAsync(values);
        onSuccess?.();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
                <h2 className="text-lg font-semibold text-slate-900">
                    Create account
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Choose the currency and account type for your new account.
                </p>
            </div>

            {createAccount.isError && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    Account yaratmaq mümkün olmadı. Zəhmət olmasa yenidən cəhd edin.
                </div>
            )}

            <div>
                <label
                    htmlFor="currency"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    Currency
                </label>

                <select
                    id="currency"
                    disabled={createAccount.isPending}
                    {...register("currency")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                    <option value="AZN">AZN — Azerbaijani Manat</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                </select>

                {errors.currency && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.currency.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="type"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    Account type
                </label>

                <select
                    id="type"
                    disabled={createAccount.isPending}
                    {...register("type")}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                    <option value="CHECKING">Checking</option>
                    <option value="SAVINGS">Savings</option>
                </select>

                {errors.type && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.type.message}
                    </p>
                )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={createAccount.isPending}
                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={createAccount.isPending}
                    className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {createAccount.isPending ? "Creating..." : "Create account"}
                </button>
            </div>
        </form>
    );
}

export default CreateAccountForm;