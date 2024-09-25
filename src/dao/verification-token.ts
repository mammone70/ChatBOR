import { db } from "@/drizzle/db";
import { verificationTokens } from "@/drizzle/schemas/auth/verificationTokens";
import { eq } from "drizzle-orm";

export const getVerificationTokenByEmail = async (
    email: string
) => {
    try {
        const verificationToken = 
            await  db
                .select()
                .from(verificationTokens)
                .where(eq(verificationTokens.identifier, email))
                .limit(1);

            return verificationToken ? verificationToken[0] : null; 
    } catch {
        return null;
    }
}


export const getVerificationTokenByToken = async (
    token: string
) => {
    try {
        const verificationToken = 
        await  db
            .select()
            .from(verificationTokens)
            .where(eq(verificationTokens.token, token))
            .limit(1);

       return verificationToken ? verificationToken[0] : null; 
    } catch {
        return null;
    }
}