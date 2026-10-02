import { useCallback, useEffect, useState } from "react";
import { ArrowRightLeft, RefreshCw } from "lucide-react";

type RateResponse = {
    date: string;
    base: string;
    quote: string;
    rate: number;
};

const currencies = [
    "AZN",
    "USD",
    "EUR",
    "GBP",
    "TRY",
    "RUB",
    "GEL",
    "AED",
];

const API_BASE_URL = "https://api.frankfurter.dev/v2";

function formatAmount(value: number) {
    return new Intl.NumberFormat("az-AZ", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4,
    }).format(value);
}

function CurrencyConverter() {
    const [amount, setAmount] = useState("100");
    const [from, setFrom] = useState("USD");
    const [to, setTo] = useState("AZN");
    const [rate, setRate] = useState<number | null>(null);
    const [rateDate, setRateDate] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadRate = useCallback(
        async (
            sourceCurrency = from,
            targetCurrency = to,
        ) => {
            if (sourceCurrency === targetCurrency) {
                setRate(1);
                setRateDate(null);
                setError(null);
                return;
            }

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `${API_BASE_URL}/rate/${sourceCurrency.toLowerCase()}/${targetCurrency.toLowerCase()}`,
                );

                if (!response.ok) {
                    throw new Error(
                        "Exchange rate request failed",
                    );
                }

                const data =
                    (await response.json()) as RateResponse;

                setRate(data.rate);
                setRateDate(data.date);
            } catch {
                setRate(null);
                setRateDate(null);
                setError(
                    "Məzənnəni yükləmək mümkün olmadı.",
                );
            } finally {
                setIsLoading(false);
            }
        },
        [from, to],
    );

    useEffect(() => {
        void loadRate();
    }, [loadRate]);

    function handleSwap() {
        const nextFrom = to;
        const nextTo = from;

        setFrom(nextFrom);
        setTo(nextTo);
    }

    const numericAmount = Number.parseFloat(amount);
    const convertedAmount =
        rate !== null &&
        Number.isFinite(numericAmount)
            ? numericAmount * rate
            : null;

    return (
        <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_12px_40px_rgba(15,23,42,0.05)] sm:p-6">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-400">
                        Currency converter
                    </p>

                    <h2 className="mt-1 text-lg font-bold text-slate-950">
                        Convert currencies
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Internetdən gündəlik reference məzənnə.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => void loadRate()}
                    disabled={isLoading}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    title="Refresh rate"
                >
                    <RefreshCw
                        className={`h-4 w-4 ${
                            isLoading ? "animate-spin" : ""
                        }`}
                    />
                </button>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-end">
                <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-500">
                        Amount
                    </span>

                    <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-slate-50 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={amount}
                            onChange={(event) =>
                                setAmount(event.target.value)
                            }
                            className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm font-semibold text-slate-900 outline-none"
                            placeholder="100"
                        />

                        <select
                            value={from}
                            onChange={(event) =>
                                setFrom(event.target.value)
                            }
                            className="border-l border-slate-200 bg-white px-3 text-sm font-bold text-slate-700 outline-none"
                            aria-label="Source currency"
                        >
                            {currencies.map((currency) => (
                                <option
                                    key={currency}
                                    value={currency}
                                >
                                    {currency}
                                </option>
                            ))}
                        </select>
                    </div>
                </label>

                <button
                    type="button"
                    onClick={handleSwap}
                    className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                    title="Swap currencies"
                >
                    <ArrowRightLeft className="h-4 w-4" />
                </button>

                <label className="block">
                    <span className="mb-2 block text-xs font-semibold text-slate-500">
                        Convert to
                    </span>

                    <select
                        value={to}
                        onChange={(event) =>
                            setTo(event.target.value)
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm font-bold text-slate-700 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                        aria-label="Target currency"
                    >
                        {currencies.map((currency) => (
                            <option
                                key={currency}
                                value={currency}
                            >
                                {currency}
                            </option>
                        ))}
                    </select>
                </label>
            </div>

            <div className="mt-4 rounded-2xl bg-slate-950 p-4 text-white">
                {error ? (
                    <p className="text-sm text-rose-300">
                        {error}
                    </p>
                ) : (
                    <>
                        <p className="text-xs font-medium text-slate-400">
                            Converted amount
                        </p>

                        <p className="mt-1 text-2xl font-bold tracking-tight">
                            {convertedAmount !== null
                                ? `${formatAmount(
                                    convertedAmount,
                                )} ${to}`
                                : "Loading..."}
                        </p>

                        {rate !== null && (
                            <p className="mt-2 text-xs text-slate-400">
                                1 {from} ={" "}
                                {formatAmount(rate)} {to}
                                {rateDate
                                    ? ` • ${rateDate}`
                                    : ""}
                            </p>
                        )}
                    </>
                )}
            </div>
        </section>
    );
}

export default CurrencyConverter;
