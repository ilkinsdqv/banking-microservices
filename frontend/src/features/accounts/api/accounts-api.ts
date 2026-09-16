import { apiClient } from "../../../lib/axios";

import type {
    Account,
    BalanceOperationRequest,
    CreateAccountRequest,
} from "../types/account";

export const accountsApi = {
    getById: async (id: string): Promise<Account> => {
        const response = await apiClient.get<Account>(
            `/api/v1/accounts/${id}`,
        );

        return response.data;
    },

    getByUserId: async (userId: string): Promise<Account[]> => {
        const response = await apiClient.get<Account[]>(
            `/api/v1/accounts/user/${userId}`,
        );

        return response.data;
    },

    create: async (
        request: CreateAccountRequest,
    ): Promise<Account> => {
        const response = await apiClient.post<Account>(
            "/api/v1/accounts",
            request,
        );

        return response.data;
    },

    cashIn: async (
        accountId: string,
        request: BalanceOperationRequest,
    ): Promise<Account> => {
        const response = await apiClient.post<Account>(
            `/api/v1/accounts/${accountId}/cash-in`,
            request,
        );

        return response.data;
    },
};