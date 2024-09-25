import { boolean, pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod";

export const userRoleEnum = pgEnum('userRole', ['USER', 'ADMIN']);
export const userRoleEnumSchema = z.enum(userRoleEnum.enumValues);

export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").notNull(),
    password: text("password"),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
    userRole : userRoleEnum('userRole').default("USER").notNull(),
    authorized : boolean('authorized').default(false).notNull(),
});
