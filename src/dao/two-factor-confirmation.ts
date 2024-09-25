import { db } from "@/drizzle/db";
import { twoFactorConfirmations } from "@/drizzle/schemas/auth/twoFactorConfirmations";
import { eq } from "drizzle-orm";

export const getTwoFactorConfirmationByUserId = async (
    userId: string
) => {
    try {
        const twoFactorConfirmation = 
        await  db
            .select()
            .from(twoFactorConfirmations)
            .where(eq(twoFactorConfirmations.userId, userId))
            .limit(1);


       return twoFactorConfirmation;
    } catch {
        return null;
    }
}