export type TransactionType =
    | "DEPOSIT"
    | "WITHDRAW"
    | "TRANSFER"
    | "LOAN_DISBURSEMENT";

export type TransactionStatus =
    | "PENDING"
    | "COMPLETED"
    | "FAILED";

export type Currency = "AZN" | "USD" | "EUR";

export interface Transaction {
    id: string;
    fromAccountId: string | null;
    toAccountId: string | null;
    amount: number;
    currency: Currency;
    type: TransactionType;
    status: TransactionStatus;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTransactionRequest {
    fromAccountId?: string;
    toAccountId?: string;
    amount: number;
    currency: Currency;
    type: TransactionType;
    description?: string;
}