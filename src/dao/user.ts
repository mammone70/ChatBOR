import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schemas/auth/users";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
    try {
        const user = 
            await db
                .select()
                .from(users)
                .where(eq(users.email, email));

            return user[0];
    } catch {
        return null;
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = 
            await db
                .select()
                .from(users)
                .where(eq(users.id, id));

        return user;
    } catch {
        return null;
    }
}