import { useState } from "react";
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
    } = useUsers({
        page,
        size: PAGE_SIZE,
    });

    const users = data?.content ?? [];
    const totalPages = data?.totalPages ?? 0;

    const goToPreviousPage = () => {
        setPage((currentPage) =>
            Math.max(currentPage - 1, 0),
        );
    };

    const goToNextPage = () => {
        setPage((currentPage) =>
            Math.min(
                currentPage + 1,
                Math.max(totalPages - 1, 0),
            ),
        );
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Users
                    </h1>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Manage registered bank customers.
                    </p>
                </div>

                {data && (
                    <div className="text-sm text-muted-foreground">
                        {data.totalElements} total users
                    </div>
                )}
            </div>

            {isLoading && (
                <div className="rounded-xl border bg-card p-8 text-center">
                    <p className="text-sm text-muted-foreground">
                        Loading users...
                    </p>
                </div>
            )}

            {isError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                    <h2 className="font-semibold">
                        Failed to load users
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                        Please try again.
                    </p>
                </div>
            )}

            {!isLoading && !isError && (
                <>
                    <UserList users={users} />

                    {totalPages > 0 && (
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-muted-foreground">
                                Page {page + 1} of {totalPages}
                            </p>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    disabled={page === 0 || isFetching}
                                    onClick={goToPreviousPage}
                                    className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <button
                                    type="button"
                                    disabled={
                                        page >= totalPages - 1 ||
                                        isFetching
                                    }
                                    onClick={goToNextPage}
                                    className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}