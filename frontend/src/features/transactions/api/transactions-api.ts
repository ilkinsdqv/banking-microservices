import { apiClient } from "../../../lib/axios";

import type {
    CreateTransactionRequest,
    Transaction,
} from "../types/transaction";

export const transactionsApi = {
    create: async (
        request: CreateTransactionRequest,
    ): Promise<Transaction> => {
        const response = await apiClient.post<Transaction>(
            "/api/v1/transactions",
            request,
        );

        return response.data;
    },

    getById: async (id: string): Promise<Transaction> => {
        const response = await apiClient.get<Transaction>(
            `/api/v1/transactions/${id}`,
        );

        return response.data;
    },

    getByAccountId: async (
        accountId: string,
    ): Promise<Transaction[]> => {
        const response = await apiClient.get<Transaction[]>(
            `/api/v1/transactions/account/${accountId}`,
        );

        return response.data;
    },
};