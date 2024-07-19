import { db } from "@/drizzle/db";
import { users } from "@/drizzle/schema";
import { eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db
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
        const user = await db
            .query
            .users
            .findFirst({
                where : eq(users.id, id)
            });
        return user;
    } catch {
        return null;
    }
}