import { pgTable, text } from "drizzle-orm/pg-core";
import { users } from "@/drizzle/schemas/auth/users";

export const twoFactorConfirmations = pgTable(
    "twoFactorConfirmations",
    {
        id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
        userId: text("userId")
                .notNull()
                .references(() => users.id, { onDelete: "cascade" }),
    }
)
