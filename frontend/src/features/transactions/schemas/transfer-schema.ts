import { z } from "zod";

export const transferSchema = z
    .object({
        fromAccountId: z.string().min(1, {
            error: "Göndərən hesabı seçin.",
        }),

        toAccountId: z.string().min(1, {
            error: "Qəbul edən hesabı seçin.",
        }),

        amount: z
            .number({
                error: "Məbləğ daxil edin.",
            })
            .min(0.01, {
                error: "Məbləğ ən azı 0.01 olmalıdır.",
            }),

        currency: z.enum(["AZN", "USD", "EUR"], {
            error: "Valyuta seçin.",
        }),

        description: z
            .string()
            .max(500, {
                error: "Açıqlama maksimum 500 simvol ola bilər.",
            })
            .optional(),
    })
    .refine(
        (data) => data.fromAccountId !== data.toAccountId,
        {
            path: ["toAccountId"],
            error: "Göndərən və qəbul edən hesab eyni ola bilməz.",
        },
    );

export type TransferFormValues = z.infer<typeof transferSchema>;