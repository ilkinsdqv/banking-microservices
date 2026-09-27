import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, type LoginFormValues } from "../schemas/login-schema";
import { useAuth } from "../hooks/use-auth";

interface LoginFormProps {
    onSuccess?: () => void;
}

function LoginForm({ onSuccess }: LoginFormProps) {
    const { login } = useAuth();
    const [serverError, setServerError] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setServerError(null);

        try {
            await login(values);
            onSuccess?.();
        } catch {
            setServerError(
                "Login uğursuz oldu. Email və şifrənizi yoxlayın.",
            );
        }
    };

    return (
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            <div>
                <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                    Welcome back
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Sign in to your banking account
                </p>
            </div>

            {serverError && (
                <div
                    role="alert"
                    className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {serverError}
                </div>
            )}

            <div>
                <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    Email
                </label>

                <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    disabled={isSubmitting}
                    {...register("email")}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div>
                <div className="mb-1.5 flex items-center justify-between">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-slate-700"
                    >
                        Password
                    </label>
                </div>

                <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    disabled={isSubmitting}
                    {...register("password")}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                />

                {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
        </form>
    );
}

export default LoginForm;