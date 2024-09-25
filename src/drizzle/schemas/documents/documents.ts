import { randomUUID } from "crypto";
import { relations } from "drizzle-orm";
import { integer, pgTable, text } from "drizzle-orm/pg-core";
import { document_chunks } from "@/drizzle/schemas/documents/document_chunks";

export const documents = pgTable('documents', 
    {
        id: text('id')
            .primaryKey()
            .notNull()
            .$defaultFn(() => randomUUID()),
        name: text('name').notNull(),
        totalPages: integer('total_pages'),
        blobURL: text('blobURL'),
    },
);

//documents to document_chunks one-to-many relationship
export const documentRelations = relations(documents, 
    ({ many }) => ({
        document_chunks: many(document_chunks),
    })
);
