import { useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";

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
            <div className="space-y-6">
                <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                <div className="h-80 animate-pulse rounded-xl bg-muted" />
            </div>
        );
    }

    if (isError || !user || !id) {
        return (
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() => navigate("/admin/users")}
                    className="text-sm text-muted-foreground hover:text-foreground"
                >
                    ← Back to users
                </button>

                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                    <h2 className="font-semibold">
                        User could not be loaded
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        The requested user does not exist or could not be retrieved.
                    </p>
                </div>
            </div>
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
        <div className="mx-auto max-w-2xl space-y-6">
            <button
                type="button"
                onClick={() => navigate(`/admin/users/${id}`)}
                className="text-sm text-muted-foreground hover:text-foreground"
            >
                ← Back to user
            </button>

            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Edit user
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                    Update the user's profile information.
                </p>
            </div>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 rounded-xl border bg-card p-6 shadow-sm"
            >
                <div className="grid gap-6 sm:grid-cols-2">
                    <div>
                        <label
                            htmlFor="firstName"
                            className="mb-2 block text-sm font-medium"
                        >
                            First name
                        </label>

                        <input
                            id="firstName"
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
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />

                        {errors.firstName && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            htmlFor="lastName"
                            className="mb-2 block text-sm font-medium"
                        >
                            Last name
                        </label>

                        <input
                            id="lastName"
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
                            className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        />

                        {errors.lastName && (
                            <p className="mt-1 text-sm text-destructive">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="phoneNumber"
                        className="mb-2 block text-sm font-medium"
                    >
                        Phone number
                    </label>

                    <input
                        id="phoneNumber"
                        {...register("phoneNumber", {
                            required: "Phone number is required",
                            pattern: {
                                value: /^\+994\d{9}$/,
                                message:
                                    "Phone number must be in the format +994XXXXXXXXX",
                            },
                        })}
                        placeholder="+994501234567"
                        className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                    />

                    {errors.phoneNumber && (
                        <p className="mt-1 text-sm text-destructive">
                            {errors.phoneNumber.message}
                        </p>
                    )}
                </div>

                <div className="rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground">
                    Email, FIN, birth date and roles cannot be changed from
                    this form.
                </div>

                {updateUser.isError && (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                        Failed to update user. Please try again.
                    </div>
                )}

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(`/admin/users/${id}`)}
                        className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={updateUser.isPending}
                        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {updateUser.isPending
                            ? "Saving..."
                            : "Save changes"}
                    </button>
                </div>
            </form>
        </div>
    );
}