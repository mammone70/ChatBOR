'use server';

import { RegisterSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";

import { db } from "@/drizzle/db";
import { getUserByEmail } from "@/dao/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
import { users } from "@/drizzle/schemas/auth/users";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validateFields = RegisterSchema.safeParse(values);

    if (!validateFields.success){
        return { error: "Invalid fields!" };
    }

    const { email, password, name } = validateFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if(existingUser){
        return { error: "Email already in use!" };
    }

    await   db
            .insert(users)
            .values({
                name,
                email,
                password: hashedPassword,    
            });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(verificationToken.identifier, verificationToken.token)
    return { success: "Confirmation Email Sent" };
};