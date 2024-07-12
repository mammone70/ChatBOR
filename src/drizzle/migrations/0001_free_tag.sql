ALTER TABLE "transcript_chunks" ALTER COLUMN "transcript_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "transcript_chunks" ADD COLUMN "from_line" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "transcript_chunks" ADD COLUMN "to_line" integer NOT NULL;--> statement-breakpoint
ALTER TABLE "transcripts" ADD COLUMN "total_pages" integer NOT NULL;