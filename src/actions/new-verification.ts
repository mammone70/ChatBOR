"use server";

import { getUserByEmail } from "@/dao/user";
import {getVerificationTokenByToken } from "@/dao/verification-token";
import { db } from "@/drizzle/db";
import { users, verificationTokens } from "@/drizzle/schemas/auth";
import { and, eq } from "drizzle-orm";

export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
        return { error: "Token does not exist." };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if(hasExpired){
        return { error: "Token has expired." };
    }

    const existingUser = await getUserByEmail(existingToken.identifier);

    if(!existingUser) {
        return { error : "Email does not exist." };
    }

    await   db
            .update(users)
            .set({
                emailVerified : new Date(),
            })
            .where(
                and(
                    eq(users.id, existingUser.id),
                    //this is if user is changing their email
                    eq(users.email, existingToken.identifier)
                )
            );

    await   db
            .delete(verificationTokens)
            .where(eq(verificationTokens.identifier, existingToken.identifier));

    return { success: "Email verified." };
}
