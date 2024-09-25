ALTER TABLE "document_chunks" RENAME COLUMN "transcript_id" TO "document_id";--> statement-breakpoint
ALTER TABLE "document_chunks" DROP CONSTRAINT "document_chunks_transcript_id_documents_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "document_chunks" ADD CONSTRAINT "document_chunks_document_id_documents_id_fk" FOREIGN KEY ("document_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
