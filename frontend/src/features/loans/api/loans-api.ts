import { apiClient } from "../../../lib/axios";

import type {
    CreateLoanRequest,
    Loan,
    LoanPayment,
} from "../types/loan";

export const loansApi = {
    create: async (request: CreateLoanRequest): Promise<Loan> => {
        const response = await apiClient.post<Loan>(
            "/api/v1/loans",
            request,
        );

        return response.data;
    },

    getMyLoans: async (): Promise<Loan[]> => {
        const response = await apiClient.get<Loan[]>(
            "/api/v1/loans/my",
        );

        return response.data;
    },

    getById: async (id: string): Promise<Loan> => {
        const response = await apiClient.get<Loan>(
            `/api/v1/loans/${id}`,
        );

        return response.data;
    },

    getPayments: async (loanId: string): Promise<LoanPayment[]> => {
        const response = await apiClient.get<LoanPayment[]>(
            `/api/v1/loans/${loanId}/payments`,
        );

        return response.data;
    },

    makePayment: async (
        loanId: string,
        amount: number,
    ): Promise<Loan> => {
        const response = await apiClient.post<Loan>(
            `/api/v1/loans/${loanId}/payment`,
            null,
            {
                params: {
                    amount,
                },
            },
        );

        return response.data;
    },

    cancel: async (loanId: string): Promise<Loan> => {
        const response = await apiClient.post<Loan>(
            `/api/v1/loans/${loanId}/cancel`,
        );

        return response.data;
    },
};