import { z } from "zod";

export const registerSchema = z
    .object({
        // DX-NOTE: Refer to the userAccount entity - username is by default set to emailAddress here
        email_address: z.string().email().max(150),
        password: z.string().min(8, "Requires at least 8 characters")
            .max(50)
            .regex(/^(?=.*[A-Z])/, "Must contain a capital letter")
            .regex(/^(?=.*[a-z])/, "Must contain a small letter")
            .regex(/^(?=.*[0-9])/, "Must contain a number")
            .regex(/^(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹])/, "Must contain a special character"),
        confirm_password: z.string().min(8, { message: "Requires at least 8 characters" })
    })
    .refine((data) => data.password === data.confirm_password, {
        message: "Passwords don't match",
        path: ["confirm_password"] // Path of error
    });
