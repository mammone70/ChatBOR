DO $$ BEGIN
 ALTER TABLE "transcript_chunks" ADD CONSTRAINT "transcript_chunks_transcript_id_transcripts_id_fk" FOREIGN KEY ("transcript_id") REFERENCES "public"."transcripts"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
