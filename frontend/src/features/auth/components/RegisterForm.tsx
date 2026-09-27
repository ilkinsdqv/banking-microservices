import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Eye, EyeOff, UserPlus } from "lucide-react";

import { authApi } from "../api/auth-api";
import {
    registerSchema,
    type RegisterFormValues,
} from "../schemas/register-schema";

interface RegisterFormProps {
    onSuccess?: (email: string) => void;
}

function RegisterForm({ onSuccess }: RegisterFormProps) {
    const [serverError, setServerError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            confirmPassword: "",
            fin: "",
            phoneNumber: "+994",
            birthDate: "",
        },
    });

    const onSubmit = async (values: RegisterFormValues) => {
        setServerError(null);

        try {
            await authApi.register({
                firstName: values.firstName.trim(),
                lastName: values.lastName.trim(),
                email: values.email.trim(),
                password: values.password,
                fin: values.fin.toUpperCase().trim(),
                phoneNumber: values.phoneNumber.trim(),
                birthDate: values.birthDate,
            });

            onSuccess?.(values.email.trim());
        } catch {
            setServerError(
                "Qeydiyyat uğursuz oldu. Daxil etdiyiniz məlumatları yoxlayın.",
            );
        }
    };

    return (
        <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
        >
            {serverError && (
                <div
                    role="alert"
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-700"
                >
                    {serverError}
                </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="firstName"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Ad
                    </label>

                    <input
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        placeholder="Adınız"
                        disabled={isSubmitting}
                        {...register("firstName")}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                    {errors.firstName && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.firstName.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="lastName"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Soyad
                    </label>

                    <input
                        id="lastName"
                        type="text"
                        autoComplete="family-name"
                        placeholder="Soyadınız"
                        disabled={isSubmitting}
                        {...register("lastName")}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                    {errors.lastName && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.lastName.message}
                        </p>
                    )}
                </div>
            </div>

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
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

                {errors.email && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.email.message}
                    </p>
                )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label
                        htmlFor="fin"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        FIN
                    </label>

                    <input
                        id="fin"
                        type="text"
                        maxLength={7}
                        autoComplete="off"
                        placeholder="ABC1234"
                        disabled={isSubmitting}
                        {...register("fin", {
                            onChange: (event) => {
                                event.target.value =
                                    event.target.value
                                        .toUpperCase()
                                        .replace(/[^A-Z0-9]/g, "");
                            },
                        })}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm uppercase tracking-[0.12em] outline-none transition placeholder:text-slate-400 placeholder:normal-case placeholder:tracking-normal focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                    {errors.fin && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.fin.message}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="phoneNumber"
                        className="mb-1.5 block text-sm font-medium text-slate-700"
                    >
                        Telefon
                    </label>

                    <input
                        id="phoneNumber"
                        type="tel"
                        autoComplete="tel"
                        placeholder="+994501234567"
                        disabled={isSubmitting}
                        {...register("phoneNumber")}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                    {errors.phoneNumber && (
                        <p className="mt-1.5 text-xs text-red-600">
                            {errors.phoneNumber.message}
                        </p>
                    )}
                </div>
            </div>

            <div>
                <label
                    htmlFor="birthDate"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    Doğum tarixi
                </label>

                <input
                    id="birthDate"
                    type="date"
                    autoComplete="bday"
                    disabled={isSubmitting}
                    {...register("birthDate")}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-50"
                />

                {errors.birthDate && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.birthDate.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    Şifrə
                </label>

                <div className="relative">
                    <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Minimum 8 simvol"
                        disabled={isSubmitting}
                        {...register("password")}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowPassword((current) => !current)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                        aria-label={
                            showPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>

                {errors.password && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.password.message}
                    </p>
                )}
            </div>

            <div>
                <label
                    htmlFor="confirmPassword"
                    className="mb-1.5 block text-sm font-medium text-slate-700"
                >
                    Şifrəni təkrar daxil edin
                </label>

                <div className="relative">
                    <input
                        id="confirmPassword"
                        type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                        }
                        autoComplete="new-password"
                        placeholder="Şifrəni yenidən daxil edin"
                        disabled={isSubmitting}
                        {...register("confirmPassword")}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 pr-11 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-900 focus:ring-4 focus:ring-slate-900/5 disabled:cursor-not-allowed disabled:bg-slate-50"
                    />

                    <button
                        type="button"
                        onClick={() =>
                            setShowConfirmPassword(
                                (current) => !current,
                            )
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-700"
                        aria-label={
                            showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                        }
                    >
                        {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4" />
                        ) : (
                            <Eye className="h-4 w-4" />
                        )}
                    </button>
                </div>

                {errors.confirmPassword && (
                    <p className="mt-1.5 text-xs text-red-600">
                        {errors.confirmPassword.message}
                    </p>
                )}
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-950/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
                {isSubmitting ? (
                    "Creating account..."
                ) : (
                    <>
                        <UserPlus className="h-4 w-4" />
                        Create account
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </>
                )}
            </button>
        </form>
    );
}

export default RegisterForm;