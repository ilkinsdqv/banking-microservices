import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    disabled?: boolean;
}

export function Pagination({
                               page,
                               totalPages,
                               onPageChange,
                               disabled = false,
                           }: PaginationProps) {
    if (totalPages <= 1) {
        return null;
    }

    const currentPage = page + 1;

    return (
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
            </p>

            <div className="flex items-center gap-2">
                <button
                    type="button"
                    disabled={
                        disabled || page === 0
                    }
                    onClick={() =>
                        onPageChange(
                            Math.max(page - 1, 0),
                        )
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
                >
                    <ChevronLeft
                        className="h-4 w-4"
                        aria-hidden="true"
                    />
                    Previous
                </button>

                <button
                    type="button"
                    disabled={
                        disabled ||
                        page >= totalPages - 1
                    }
                    onClick={() =>
                        onPageChange(page + 1)
                    }
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:pointer-events-none disabled:opacity-50"
                >
                    Next
                    <ChevronRight
                        className="h-4 w-4"
                        aria-hidden="true"
                    />
                </button>
            </div>
        </div>
    );
}