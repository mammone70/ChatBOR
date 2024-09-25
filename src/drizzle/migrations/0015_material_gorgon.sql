ALTER TABLE "transcripts" RENAME TO "documents";--> statement-breakpoint
ALTER TABLE "transcript_chunks" DROP CONSTRAINT "transcript_chunks_transcript_id_transcripts_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transcript_chunks" ADD CONSTRAINT "transcript_chunks_transcript_id_documents_id_fk" FOREIGN KEY ("transcript_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
