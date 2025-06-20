CREATE TYPE "public"."post_type" AS ENUM('regular', 'poll');--> statement-breakpoint
ALTER TABLE "attachment" ALTER COLUMN "resource_type" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ADD COLUMN "post_type" "post_type" DEFAULT 'regular' NOT NULL;