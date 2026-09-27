import type { LoanStatus } from "../types/loan";

export const loanStatusLabels: Record<LoanStatus, string> = {
    PENDING: "Pending",
    APPROVED: "Approved",
    REJECTED: "Rejected",
    ACTIVE: "Active",
    PAID: "Paid",
    DEFAULTED: "Defaulted",
    CANCELLED: "Cancelled",
};

export const loanStatusClasses: Record<LoanStatus, string> = {
    PENDING: "bg-amber-100 text-amber-700",
    APPROVED: "bg-blue-100 text-blue-700",
    REJECTED: "bg-red-100 text-red-700",
    ACTIVE: "bg-emerald-100 text-emerald-700",
    PAID: "bg-slate-100 text-slate-700",
    DEFAULTED: "bg-red-100 text-red-700",
    CANCELLED: "bg-slate-100 text-slate-600",
};