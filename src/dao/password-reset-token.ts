import { db } from "@/drizzle/db";
import { passwordResetTokens } from "@/drizzle/schemas/auth/passwordResetTokens";
import { eq } from "drizzle-orm";

export const getPasswordResetTokenByToken = async (token: string) => {
    try {
        const resetToken = 
            await  db
                .select()
                .from(passwordResetTokens)
                .where(eq(passwordResetTokens.token, token))
                .limit(1);

       return resetToken ? resetToken[0] : null;
    } catch {
        return null;
    }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
    try {
        const passwordResetToken = 
            await  db
                .select()
                .from(passwordResetTokens)
                .where(eq(passwordResetTokens.identifier, email));

            return passwordResetToken ? passwordResetToken[0] : null;
    } catch {
        return null;
    }
}