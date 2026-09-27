export type AccountType = "SAVINGS" | "CHECKING";

export type Currency = "AZN" | "USD" | "EUR";

export interface Account {
    id: string;
    userId: string;
    iban: string;
    balance: number;
    currency: Currency;
    type: AccountType;
    createdAt: string;
    updatedAt: string;
}

export interface CreateAccountRequest {
    currency: Currency;
    type: AccountType;
}

export interface BalanceOperationRequest {
    amount: number;
}