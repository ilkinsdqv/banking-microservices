import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().check(
        z.email({
            error: "Düzgün email formatı daxil edin.",
        }),
    ),

    password: z.string().min(1, {
        error: "Şifrə daxil edin.",
    }),
});

export type LoginFormValues = z.infer<typeof loginSchema>;