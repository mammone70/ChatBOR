import { randomUUID } from "crypto";
import { index, integer, pgTable, text, vector } from "drizzle-orm/pg-core";
import { documents } from "@/drizzle/schemas/documents/documents";
import { relations } from "drizzle-orm";


export const document_chunks = pgTable('document_chunks', 
    {
        id: text('id')
            .primaryKey()
            .notNull()
            .$defaultFn(() => randomUUID()),
        documentId:   text('document_id')
                        .references(() => documents.id, {
                            onDelete : 'cascade'
                        })
                        .notNull(),
        pageNumber: integer('page_number').notNull(),
        fromLine: integer('from_line').notNull(),    
        toLine: integer('to_line').notNull(),
        content: text('content').notNull(),    
        embedding: vector('embedding', { dimensions: 1024 }),
    },
    (table) => ({
        embeddingIndex: index().using(
        'hnsw',
        table.embedding.op('vector_cosine_ops')
        ),
    }),
);

//document chunks to transctripts, many to one
export const documentChunkRelations = relations(document_chunks, ({ one }) => ({
    documents: one(documents, {
      fields: [document_chunks.documentId],
      references: [documents.id],
    }),
}));