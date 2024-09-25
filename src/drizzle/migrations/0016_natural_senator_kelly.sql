ALTER TABLE "transcript_chunks" RENAME TO "document_chunks";--> statement-breakpoint
ALTER TABLE "document_chunks" DROP CONSTRAINT "transcript_chunks_transcript_id_documents_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "transcript_chunks_embedding_index";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_transcript_id_documents_id_fk" FOREIGN KEY ("transcript_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "document_chunks_embedding_index" ON "document_chunks" USING hnsw ("embedding" vector_cosine_ops);