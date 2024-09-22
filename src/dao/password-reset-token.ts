import { db } from "@/drizzle/db";
import { passwordResetTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const verificationToken = 
        await  db
            .query
            .verificationTokens
            .findFirst({
                where: eq(passwordResetTokens.token, token)
            });


       return verificationToken;
    } catch {
        return null;
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = 
            await  db
                .query
                .verificationTokens
                .findFirst({
                    where: eq(passwordResetTokens.identifier, email)
                });

       return passwordResetToken;
    } catch {
        return null;
    }
}