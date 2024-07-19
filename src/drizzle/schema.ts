import {
    index,
    integer,
    pgTable,
    text,
    vector,
    timestamp,
    primaryKey,
    boolean,
    pgEnum
} from 'drizzle-orm/pg-core'


import { relations } from 'drizzle-orm';

import { randomUUID } from 'crypto'

import { AdapterAccount } from 'next-auth/adapters';
import { z } from 'zod';

export const transcripts= pgTable('transcripts', 
    {
        id: text('id')
            .primaryKey()
            .notNull()
            .$defaultFn(() => randomUUID()),
        name: text('name').notNull(),
        totalPages: integer('total_pages'),
    },
);

//transcripts to transcript_chunks one-to-many relationship
export const transcriptRelations = relations(transcripts, 
    ({ many }) => ({
        transcript_chunks: many(transcript_chunks),
    })
);

export const transcript_chunks = pgTable('transcript_chunks', 
    {
        id: text('id')
            .primaryKey()
            .notNull()
            .$defaultFn(() => randomUUID()),
        transcriptId:   text('transcript_id')
                        .references(() => transcripts.id, {
                            onDelete : 'cascade'
                        })
                        .notNull(),
        pageNumber: integer('page_number').notNull(),
        fromLine: integer('from_line').notNull(),    
        toLine: integer('to_line').notNull(),
        content: text('content').notNull(),    
        embedding: vector('embedding', { dimensions: 768 }),
    },
    (table) => ({
        embeddingIndex: index().using(
        'hnsw',
        table.embedding.op('vector_cosine_ops')
        ),
    }),
);

//transcript chunks to transctripts, many to one
export const transcriptChunkRelations = relations(transcript_chunks, ({ one }) => ({
    transcripts: one(transcripts, {
      fields: [transcript_chunks.transcriptId],
      references: [transcripts.id],
    }),
}));

//auth.js schema

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
})

export const accounts = pgTable(
"account",
{
    userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccount>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
},
(account) => ({
        compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
        }),
    })
)

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
})

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
)

export const authenticators = pgTable(
    "authenticator",
    {
        credentialID: text("credentialID").notNull().unique(),
        userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
        providerAccountId: text("providerAccountId").notNull(),
        credentialPublicKey: text("credentialPublicKey").notNull(),
        counter: integer("counter").notNull(),
        credentialDeviceType: text("credentialDeviceType").notNull(),
        credentialBackedUp: boolean("credentialBackedUp").notNull(),
        transports: text("transports"),
    },
    (authenticator) => ({
        compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
        }),
    })
)