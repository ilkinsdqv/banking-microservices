import { z } from "zod";

export const cashInSchema = z.object({
    amount: z
        .number({
            error: "Məbləğ daxil edin.",
        })
        .min(0.01, {
            error: "Məbləğ ən azı 0.01 olmalıdır.",
        }),
});

export type CashInFormValues = z.infer<typeof cashInSchema>;