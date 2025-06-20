ALTER TABLE "post" RENAME COLUMN "num_likes" TO "likes";--> statement-breakpoint
ALTER TABLE "post" RENAME COLUMN "num_comments" TO "comments";--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "views" integer DEFAULT 0 NOT NULL;