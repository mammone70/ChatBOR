import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const passwordResetTokens = pgTable(
    "passwordResetToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (passwordResetToken) => ({
        compositePk: primaryKey({
        columns: [passwordResetToken.identifier, passwordResetToken.token],
        }),
    })
)
