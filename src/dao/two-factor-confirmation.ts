import { db } from "@/drizzle/db";
import { twoFactorConfirmations } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getTwoFactorConfirmationByUserId = async (
    userId: string
) => {
    try {
        const twoFactorConfirmation = 
        await  db
            .query
            .twoFactorConfirmations
            .findFirst({
                where: eq(twoFactorConfirmations.userId, userId)
            });


       return twoFactorConfirmation;
    } catch {
        return null;
    }
}