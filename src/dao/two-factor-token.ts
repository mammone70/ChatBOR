import { db } from "@/drizzle/db";
import { twoFactorTokens, } from "@/drizzle/schemas/auth/twoFactorTokens";
import { eq } from "drizzle-orm";

export const getTwoFactorTokenByToken = async (token: string) =>{
    try {
        const twoFactorToken = 
            await  db
                .select()
                .from(twoFactorTokens)
                .where(eq(twoFactorTokens.token, token))
                .limit(1);
       return twoFactorToken;
    } catch {
        return null;
    }
}


export const getTwoFactorTokenByEmail = async (email: string) =>{
    try {
            const twoFactorToken = 
            await  db
                .select()
                .from(twoFactorTokens)
                .where(eq(twoFactorTokens.identifier, email))
                .limit(1);
       return twoFactorToken;
    } catch {
        return null;
    }
}