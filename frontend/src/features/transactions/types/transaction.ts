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

    destinationAmount: number | null;
    destinationCurrency: Currency | null;
    exchangeRate: number | null;

    type: TransactionType;
    status: TransactionStatus;
    description: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface CreateTransactionRequest {
    fromAccountId?: string;
    toAccountId?: string;
    toAccountNumber?: string;

    amount: number;
    currency: Currency;

    type: TransactionType;
    description?: string;
}