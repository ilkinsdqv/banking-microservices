import { z } from "zod";

export const createAccountSchema = z.object({
    currency: z.enum(["AZN", "USD", "EUR"], {
        error: "Valyuta seçin.",
    }),

    type: z.enum(["SAVINGS", "CHECKING"], {
        error: "Hesab növü seçin.",
    }),
});

export type CreateAccountFormValues = z.infer<
    typeof createAccountSchema
>;