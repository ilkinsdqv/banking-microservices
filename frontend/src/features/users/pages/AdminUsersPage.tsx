import {
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Users,
} from "lucide-react";
import { useState } from "react";

import {
    Button,
    Card,
    ErrorState,
    Skeleton,
} from "../../../components/ui";
import UserList from "../components/UserList";
import { useUsers } from "../hooks/use-users";

const PAGE_SIZE = 10;

export default function AdminUsersPage() {
    const [page, setPage] = useState(0);

    const {
        data,
        isLoading,
        isError,
        isFetching,
        refetch,
    } = useUsers({
        page,
        size: PAGE_SIZE,
    });

    const users = data?.content ?? [];
    const totalPages = data?.totalPages ?? 0;

    const goToPreviousPage = () => {
        setPage((currentPage) => Math.max(currentPage - 1, 0));
    };

    const goToNextPage = () => {
        setPage((currentPage) =>
            Math.min(
                currentPage + 1,
                Math.max(totalPages - 1, 0),
            ),
        );
    };

    if (isLoading) {
        return (
            <div className="space-y-6">
                <div className="rounded-3xl bg-slate-950 p-6 sm:p-8">
                    <Skeleton className="h-5 w-28 bg-white/10" />
                    <Skeleton className="mt-4 h-9 w-56 bg-white/10" />
                    <Skeleton className="mt-3 h-4 w-full max-w-xl bg-white/10" />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <Skeleton className="h-28 rounded-2xl" />
                    <Skeleton className="h-28 rounded-2xl" />
                </div>

                <Skeleton className="h-96 rounded-2xl" />
            </div>
        );
    }

    if (isError) {
        return (
            <ErrorState
                title="Failed to load users"
                description="Something went wrong while loading registered customers."
                onRetry={() => refetch()}
            />
        );
    }

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-3xl bg-slate-950 p-6 text-white sm:p-8">
                <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
                <div className="absolute -bottom-24 left-1/3 h-52 w-52 rounded-full bg-cyan-400/10 blur-3xl" />

                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <div className="flex items-center gap-2 text-sm font-medium text-slate-300">
                            <Users className="h-4 w-4" />
                            User management
                        </div>

                        <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
                            Users
                        </h1>

                        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                            Manage registered bank customers, account
                            information, and user status.
                        </p>
                    </div>

                    {data && (
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur">
                            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                Total customers
                            </p>
                            <p className="mt-1 text-2xl font-semibold">
                                {data.totalElements}
                            </p>
                        </div>
                    )}
                </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
                <Card className="p-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <Users className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Registered users
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-slate-950">
                                {data?.totalElements ?? 0}
                            </p>
                        </div>
                    </div>
                </Card>

                <Card className="p-5">
                    <div className="flex items-center gap-4">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <ShieldCheck className="h-5 w-5" />
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Current page
                            </p>
                            <p className="mt-1 text-2xl font-semibold text-slate-950">
                                {page + 1}
                                <span className="ml-1 text-sm font-medium text-slate-400">
                                    / {Math.max(totalPages, 1)}
                                </span>
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-base font-semibold text-slate-950">
                            Customer directory
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Review and manage registered users.
                        </p>
                    </div>

                    {isFetching && (
                        <span className="text-xs font-medium text-slate-400">
                            Updating...
                        </span>
                    )}
                </div>

                <div className="p-4 sm:p-6">
                    <UserList users={users} />
                </div>
            </section>

            {totalPages > 0 && (
                <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">
                        Page{" "}
                        <span className="font-semibold text-slate-900">
                            {page + 1}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-slate-900">
                            {totalPages}
                        </span>
                    </p>

                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={page === 0 || isFetching}
                            onClick={goToPreviousPage}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={
                                page >= totalPages - 1 || isFetching
                            }
                            onClick={goToNextPage}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}