CREATE TYPE "public"."like_target" AS ENUM('post', 'comment');--> statement-breakpoint
CREATE TYPE "public"."friend_request_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TABLE "friend_request" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"sender_id" bigint,
	"recipient_id" bigint,
	"status" "friend_request_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "friend_request_sender_id_recipient_id_unique" UNIQUE("sender_id","recipient_id"),
	CONSTRAINT "no_self_request" CHECK ("friend_request"."sender_id" != "friend_request"."recipient_id")
);
--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "num_likes" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "num_comments" SET NOT NULL;