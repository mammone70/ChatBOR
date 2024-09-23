import * as z from "zod";

const DEFAULT_CHAT_MESSAGE_SIZE : string = "1500";

export const NewPasswordSchema = z.object({
    password: z.string().min(6, {
        message: "Minimum of 6 characters required.",
    }),
});

export const ResetSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
});

export const LoginSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(1, {
        message: "Password is required",
    }),
    code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
    email: z.string().email({
        message: "Email is required",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
    name: z.string().min(1, {
        message: "Name is required.",
    }),
});

export const ChatSchema = z.object({
    message: z.string()
        .min(1, {
            message: "Chat message must contain at least 1 character.",
        })
        .max(parseInt(process.env.MAX_CHAT_MESSAGE_SIZE || DEFAULT_CHAT_MESSAGE_SIZE), {
            message: `Chat message must not be longer than ${process.env.MAX_CHAT_MESSAGE_SIZE}`,
        }),
    // conversation : z.string()
    //     .max(parseInt(process.env.MAX_CHAT_MESSAGE_SIZE || DEFAULT_CHAT_MESSAGE_SIZE), {
    //         message: `Chat conversation must not be longer than ${process.env.MAX_CHAT_MESSAGE_SIZE}`,
    //     }),
})

export const UploadFileSchema = z.object({
    // title: z.string().min(1).max(200),
    file: z
        .instanceof(File)
        .refine(
            (file) => file.size > 0 && file.size < 1000000,
            "File must be less than 1 MB"
        )
});

export const DeleteFileSchema = z.object({
    id: z.string({
        required_error : "ID is required!",
    }),
});
