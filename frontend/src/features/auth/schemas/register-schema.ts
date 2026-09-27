import { z } from "zod";

export const registerSchema = z
    .object({
        firstName: z
            .string()
            .min(2, "Ad ən azı 2 simvol olmalıdır.")
            .max(50, "Ad maksimum 50 simvol ola bilər."),

        lastName: z
            .string()
            .min(2, "Soyad ən azı 2 simvol olmalıdır.")
            .max(50, "Soyad maksimum 50 simvol ola bilər."),

        email: z
            .string()
            .check(
                z.email({
                    error: "Düzgün email formatı daxil edin.",
                }),
            ),

        password: z
            .string()
            .min(8, "Şifrə ən azı 8 simvol olmalıdır.")
            .max(100, "Şifrə maksimum 100 simvol ola bilər."),

        confirmPassword: z
            .string()
            .min(1, "Şifrə təkrar daxil edilməlidir."),

        fin: z
            .string()
            .regex(
                /^[A-Z0-9]{7}$/,
                "FIN 7 simvol olmalı və yalnız böyük hərf/rəqəmlərdən ibarət olmalıdır.",
            ),

        phoneNumber: z
            .string()
            .regex(
                /^\+994\d{9}$/,
                "Telefon nömrəsi +994XXXXXXXXX formatında olmalıdır.",
            ),

        birthDate: z
            .string()
            .min(1, "Doğum tarixi daxil edin.")
            .refine(
                (value) => {
                    const date = new Date(`${value}T00:00:00`);
                    return date < new Date();
                },
                "Doğum tarixi keçmiş tarix olmalıdır.",
            ),
    })
    .refine(
        (values) => values.password === values.confirmPassword,
        {
            path: ["confirmPassword"],
            message: "Şifrələr uyğun gəlmir.",
        },
    );

export type RegisterFormValues = z.infer<typeof registerSchema>;