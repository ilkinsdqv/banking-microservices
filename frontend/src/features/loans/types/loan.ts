export type Currency = "AZN" | "USD" | "EUR";

export type LoanStatus =
    | "PENDING"
    | "APPROVED"
    | "REJECTED"
    | "ACTIVE"
    | "PAID"
    | "DEFAULTED"
    | "CANCELLED";

export type LoanPaymentStatus = "COMPLETED" | "FAILED";

export interface Loan {
    id: string;
    userId: string;
    accountId: string;
    principalAmount: number;
    interestRate: number;
    termMonths: number;
    monthlyPayment: number;
    remainingAmount: number;
    currency: Currency;
    status: LoanStatus;
    createdAt: string;
    updatedAt: string;
}

export interface CreateLoanRequest {
    accountId: string;
    principalAmount: number;
    interestRate: number;
    termMonths: number;
    currency: Currency;
}

export interface LoanPayment {
    id: string;
    loanId: string;
    amount: number;
    remainingAmount: number;
    status: LoanPaymentStatus;
    createdAt: string;
}