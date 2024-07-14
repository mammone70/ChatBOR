import { db } from "@/drizzle/db";

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db
            .query
            .users
            .findFirst({
                with: {
                    email,
                }
            }
        );
        return user;
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
                with: {
                    id,
                }
            }
        );
        return user;
    } catch {
        return null;
    }
}