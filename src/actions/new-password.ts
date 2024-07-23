"use server";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { NewPasswordSchema } from "@/schemas";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { passwordResetTokens, users } from "@/drizzle/schema";

export const newPassword = async (
    values : z.infer<typeof NewPasswordSchema>,
    token? : string | null,
) => {
    if(!token){
        return { error: "Missing token" };
    }

    const validatedFields = NewPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Invalid fields." };
    }

    const {password} = validatedFields.data;

    const existingToken = await getPasswordResetTokenByToken(token);

    if(!existingToken){
        return { error: "Invalid token." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired) {
        return { error: "Token has expired." };
    }

    const existingUser = await getUserByEmail(existingToken.identifier);

    if(!existingUser){
        return { error: "Email does not exist." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await   db
            .update(users)
            .set({
                password : hashedPassword,
            })
            .where(eq(users.id, existingUser.id)),

    await   db
            .delete(passwordResetTokens)
            .where(eq(passwordResetTokens.identifier,  existingToken.identifier));

    return { success: "Password Updated." };
};