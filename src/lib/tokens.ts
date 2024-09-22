import { getPasswordResetTokenByEmail } from "@/dao/password-reset-token";
import { getVerificationTokenByEmail } from "@/dao/verification-token";
import { getTwoFactorTokenByEmail } from "@/dao/two-factor-token";

import { db } from "@/drizzle/db";

import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import { verificationTokens } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100_000, 1_000_000).toString();
    const expires = new Date(new Date().getTime() + 10 * 60 * 1000);

    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken){
        await   db
                .delete(verificationTokens)
                .where(eq(verificationTokens.identifier, existingToken.identifier));
    }

    const twoFactorToken = 
        await   db
                .insert(verificationTokens)
                .values({
                    identifier : email,
                    token,
                    expires
                }
        );
    return twoFactorToken;
}

export const generatePasswordResetToken = async (email: string) => {
    const token = uuidv4();

    //expires in 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getPasswordResetTokenByEmail(email);

    if (existingToken) {
        //delete existing token so we can create a new one
        await   db
                .delete(verificationTokens)
                .where(eq(verificationTokens.identifier, existingToken.identifier));
    }

    const passwordResetToken = 
        await   db
        .insert(verificationTokens)
        .values({
            identifier : email,
            token,
            expires
        }
    ).returning();

    return passwordResetToken[0];
}

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4();

    //expires in 1 hour
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken){
        await   db
                .delete(verificationTokens)
                .where(eq(verificationTokens.identifier, existingToken.identifier));
    }

    const verificationToken = 
        await   db
                .insert(verificationTokens)
                .values({
                    identifier : email,
                    token,
                    expires
                })
                .returning();

    return verificationToken[0];
}