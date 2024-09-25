import { pgTable, primaryKey, text, timestamp } from "drizzle-orm/pg-core";

export const twoFactorTokens = pgTable(
    "twoFactorToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (twoFactorToken) => ({
        compositePk: primaryKey({
        columns: [twoFactorToken.identifier, twoFactorToken.token],
        }),
    })
)
