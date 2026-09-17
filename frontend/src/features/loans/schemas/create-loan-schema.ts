import { z } from "zod";

export const createLoanSchema = z.object({
    accountId: z.string().min(1, {
        error: "Hesab seçin.",
    }),

    principalAmount: z
        .number({
            error: "Kredit məbləği daxil edin.",
        })
        .min(100, {
            error: "Kredit məbləği minimum 100 olmalıdır.",
        }),

    interestRate: z
        .number({
            error: "Faiz dərəcəsini daxil edin.",
        })
        .min(0, {
            error: "Faiz dərəcəsi mənfi ola bilməz.",
        }),

    termMonths: z
        .number({
            error: "Müddət daxil edin.",
        })
        .int({
            error: "Müddət tam ədəd olmalıdır.",
        })
        .min(1, {
            error: "Müddət minimum 1 ay olmalıdır.",
        })
        .max(120, {
            error: "Müddət maksimum 120 ay ola bilər.",
        }),

    currency: z.enum(["AZN", "USD", "EUR"], {
        error: "Valyuta seçin.",
    }),
});

export type CreateLoanFormValues = z.infer<typeof createLoanSchema>;