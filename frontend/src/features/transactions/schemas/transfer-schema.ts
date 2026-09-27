import { z } from "zod";

export const transferSchema = z
    .object({
        fromAccountId: z.string().min(1, {
            error: "Göndərən hesabı seçin.",
        }),

        destinationType: z.enum(["OWN_ACCOUNT", "OTHER_ACCOUNT"]),

        toAccountId: z.string().optional(),

        toAccountNumber: z.string().optional(),

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
    .superRefine((data, ctx) => {
        if (data.destinationType === "OWN_ACCOUNT") {
            if (!data.toAccountId) {
                ctx.addIssue({
                    code: "custom",
                    path: ["toAccountId"],
                    message: "Qəbul edən hesabı seçin.",
                });
            }

            if (data.toAccountId === data.fromAccountId) {
                ctx.addIssue({
                    code: "custom",
                    path: ["toAccountId"],
                    message: "Göndərən və qəbul edən hesab eyni ola bilməz.",
                });
            }

            return;
        }

        const accountNumber = data.toAccountNumber ?? "";

        if (!/^\d{16}$/.test(accountNumber)) {
            ctx.addIssue({
                code: "custom",
                path: ["toAccountNumber"],
                message: "Qəbul edən hesab nömrəsi 16 rəqəm olmalıdır.",
            });
            return;
        }

        let sum = 0;
        let shouldDouble = false;

        for (let index = accountNumber.length - 1; index >= 0; index--) {
            let digit = Number(accountNumber[index]);

            if (shouldDouble) {
                digit *= 2;
                if (digit > 9) {
                    digit -= 9;
                }
            }

            sum += digit;
            shouldDouble = !shouldDouble;
        }

        if (sum % 10 !== 0) {
            ctx.addIssue({
                code: "custom",
                path: ["toAccountNumber"],
                message: "Qəbul edən hesab nömrəsi yanlışdır.",
            });
        }
    });

export type TransferFormValues = z.infer<typeof transferSchema>;
