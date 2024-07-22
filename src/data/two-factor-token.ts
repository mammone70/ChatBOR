import { db } from "@/drizzle/db";
import { verificationTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getTwoFactorTokenByToken = async (token: string) =>{
    try {
        const verificationToken = 
        await  db
            .query
            .verificationTokens
            .findFirst({
                where: eq(verificationTokens.token, token)
            });


       return verificationToken;
    } catch {
        return null;
    }
}


export const getTwoFactorTokenByEmail = async (email: string) =>{
    try {
        const verificationToken = 
            await  db
                .query
                .verificationTokens
                .findFirst({
                    where: eq(verificationTokens.identifier, email)
                });

       return verificationToken;
    } catch {
        return null;
    }
}