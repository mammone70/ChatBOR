CREATE TABLE IF NOT EXISTS "twoFactorConfirmations" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "twoFactorConfirmations" ADD CONSTRAINT "twoFactorConfirmations_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
