import {
    boolean,
    index,
    integer,
    pgTable,
    text,
    vector,
} from 'drizzle-orm/pg-core'

import { relations } from 'drizzle-orm';

import { randomUUID } from 'crypto'

export const transcripts= pgTable('transcripts', 
    {
        id: text('id')
            .primaryKey()
            .notNull()
            .$defaultFn(() => randomUUID()),
        name: text('name').notNull(),
        totalPages: integer('total_pages').notNull(),
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
        transcriptId: integer('transcript_id').notNull(),
        pageNumber: integer('page_number').notNull(),
        fromLine: integer('from_line').notNull(),    
        toLine: integer('to_line').notNull(),    
        embedding: vector('embedding', { dimensions: 1536 }),
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
  
