import { z } from "zod";

export const createComplaintSchema = z.object({
    subject: z
        .string()
        .min(1, {
            error: "Mövzu daxil edin.",
        })
        .max(200, {
            error: "Mövzu maksimum 200 simvol ola bilər.",
        }),

    description: z
        .string()
        .min(1, {
            error: "Şikayətinizin açıqlamasını daxil edin.",
        })
        .max(5000, {
            error: "Açıqlama maksimum 5000 simvol ola bilər.",
        }),

    priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
        error: "Prioritet seçin.",
    }),
});

export type CreateComplaintFormValues = z.infer<
    typeof createComplaintSchema
>;