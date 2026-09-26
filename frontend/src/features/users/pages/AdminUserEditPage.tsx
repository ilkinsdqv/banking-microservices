import {
    ArrowLeft,
    CheckCircle2,
    Phone,
    Save,
    UserRound,
} from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";

import {
    Button,
    ErrorState,
    Input,
    Skeleton,
} from "../../../components/ui";
import { useUser } from "../hooks/use-user";
import { useUpdateUser } from "../hooks/use-user-actions";
import type { UpdateUserRequest } from "../types/user";

export default function AdminUserEditPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const {
        data: user,
        isLoading,
        isError,
        refetch,
    } = useUser(id);

    const updateUser = useUpdateUser();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<UpdateUserRequest>();

    useEffect(() => {
        if (user) {
            reset({
                firstName: user.firstName,
                lastName: user.lastName,
                phoneNumber: user.phoneNumber,
            });
        }
    }, [user, reset]);

    if (isLoading) {
        return (
            <div className="mx-auto max-w-3xl space-y-6">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-40 rounded-3xl" />
                <Skeleton className="h-96 rounded-2xl" />
            </div>
        );
    }

    if (isError || !user || !id) {
        return (
            <ErrorState
                title="User could not be loaded"
                description="The requested user does not exist or could not be retrieved."
                onRetry={() => refetch()}
            />
        );
    }

    const onSubmit = (data: UpdateUserRequest) => {
        updateUser.mutate(
            {
                id,
                request: data,
            },
            {
                onSuccess: () => {
                    navigate(`/admin/users/${id}`);
                },
            },
        );
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            <button
                type="button"
                onClick={() => navigate(`/admin/users/${id}`)}
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
                <ArrowLeft className="h-4 w-4" />
                Back to user
            </button>

            <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
                <div className="absolute -right-20 -top-24 h-60 w-60 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="relative flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/10">
                        <UserRound className="h-6 w-6" />
                    </div>

                    <div>
                        <p className="text-sm text-slate-400">
                            User management
                        </p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                            Edit user
                        </h1>
                        <p className="mt-2 text-sm text-slate-400">
                            Update the user's profile information.
                        </p>
                    </div>
                </div>
            </section>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
                <div className="border-b border-slate-100 px-5 py-5 sm:px-6">
                    <h2 className="text-base font-semibold text-slate-950">
                        Profile information
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                        Update the fields that are editable by an administrator.
                    </p>
                </div>

                <div className="space-y-6 p-5 sm:p-6">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Input
                            label="First name"
                            leftElement={<UserRound className="h-4 w-4" />}
                            error={errors.firstName?.message}
                            {...register("firstName", {
                                required: "First name is required",
                                minLength: {
                                    value: 2,
                                    message:
                                        "First name must be at least 2 characters",
                                },
                                maxLength: {
                                    value: 50,
                                    message:
                                        "First name must not exceed 50 characters",
                                },
                            })}
                        />

                        <Input
                            label="Last name"
                            leftElement={<UserRound className="h-4 w-4" />}
                            error={errors.lastName?.message}
                            {...register("lastName", {
                                required: "Last name is required",
                                minLength: {
                                    value: 2,
                                    message:
                                        "Last name must be at least 2 characters",
                                },
                                maxLength: {
                                    value: 50,
                                    message:
                                        "Last name must not exceed 50 characters",
                                },
                            })}
                        />
                    </div>

                    <Input
                        label="Phone number"
                        placeholder="+994501234567"
                        leftElement={<Phone className="h-4 w-4" />}
                        error={errors.phoneNumber?.message}
                        {...register("phoneNumber", {
                            required: "Phone number is required",
                            pattern: {
                                value: /^\+994\d{9}$/,
                                message:
                                    "Phone number must be in the format +994XXXXXXXXX",
                            },
                        })}
                    />

                    <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                        <p className="text-sm leading-6 text-slate-500">
                            Email, FIN, birth date and roles cannot be changed
                            from this form.
                        </p>
                    </div>

                    {updateUser.isError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                            Failed to update user. Please try again.
                        </div>
                    )}
                </div>

                <div className="flex flex-col-reverse gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                    <Button
                        type="button"
                        variant="outline"
                        disabled={updateUser.isPending}
                        onClick={() => navigate(`/admin/users/${id}`)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="submit"
                        disabled={updateUser.isPending}
                    >
                        <Save className="h-4 w-4" />
                        {updateUser.isPending
                            ? "Saving..."
                            : "Save changes"}
                    </Button>
                </div>
            </form>
        </div>
    );
}