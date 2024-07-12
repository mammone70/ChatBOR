CREATE TABLE IF NOT EXISTS "transcript_chunks" (
	"id" text PRIMARY KEY NOT NULL,
	"transcript_id" integer,
	"page_number" integer NOT NULL,
	"embedding" vector(1536)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "transcripts" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "transcript_chunks_embedding_index" ON "transcript_chunks" USING hnsw ("embedding" vector_cosine_ops);