import {
    ArrowDownToLine,
    CheckCircle2,
    WalletCards,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Button,
    Input,
} from "../../../components/ui";
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

    const onSubmit = async (
        values: CashInFormValues,
    ) => {
        await cashIn.mutateAsync({
            accountId: account.id,
            amount: values.amount,
        });

        onSuccess?.();
    };

    const formattedBalance =
        new Intl.NumberFormat("az-AZ", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(account.balance);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
        >
            <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <ArrowDownToLine
                        className="h-5 w-5"
                        aria-hidden="true"
                    />
                </div>

                <div>
                    <h2 className="text-lg font-semibold tracking-tight text-slate-950">
                        Cash in
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Add funds to your bank account.
                    </p>
                </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl bg-slate-950 p-5 text-white">
                <div className="absolute right-0 top-0 h-32 w-32 translate-x-10 -translate-y-10 rounded-full bg-emerald-400/10 blur-2xl" />

                <div className="relative">
                    <div className="flex items-center gap-2 text-slate-400">
                        <WalletCards
                            className="h-4 w-4"
                            aria-hidden="true"
                        />

                        <span className="text-xs font-medium uppercase tracking-wider">
                            Account
                        </span>
                    </div>

                    <p className="mt-3 font-mono text-sm font-medium tracking-wide text-white">
                        {account.iban}
                    </p>

                    <div className="mt-5 border-t border-white/10 pt-4">
                        <p className="text-xs text-slate-400">
                            Current balance
                        </p>

                        <p className="mt-1 text-xl font-semibold tracking-tight">
                            {formattedBalance}{" "}
                            <span className="text-sm font-medium text-slate-400">
                                {account.currency}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            {cashIn.isError && (
                <div
                    role="alert"
                    className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3"
                >
                    <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                    <p className="text-sm text-red-700">
                        Cash in əməliyyatı uğursuz oldu.
                        Zəhmət olmasa yenidən cəhd edin.
                    </p>
                </div>
            )}

            <div>
                <Input
                    label={`Amount (${account.currency})`}
                    type="number"
                    min="0.01"
                    step="0.01"
                    inputMode="decimal"
                    placeholder="0.00"
                    disabled={cashIn.isPending}
                    error={errors.amount?.message}
                    leftElement={
                        <span className="text-sm font-semibold">
                            {account.currency}
                        </span>
                    }
                    {...register("amount", {
                        valueAsNumber: true,
                    })}
                />

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                    <CheckCircle2
                        className="h-3.5 w-3.5 text-emerald-500"
                        aria-hidden="true"
                    />
                    Funds will be added directly to this account.
                </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                <Button
                    type="button"
                    variant="outline"
                    disabled={cashIn.isPending}
                    onClick={onCancel}
                    className="w-full sm:w-auto"
                >
                    Cancel
                </Button>

                <Button
                    type="submit"
                    loading={cashIn.isPending}
                    className="w-full sm:w-auto"
                >
                    <ArrowDownToLine
                        className="h-4 w-4"
                        aria-hidden="true"
                    />
                    {cashIn.isPending
                        ? "Processing..."
                        : "Cash in"}
                </Button>
            </div>
        </form>
    );
}

export default CashInForm;