CREATE TYPE "public"."profile_type" AS ENUM('user', 'page');--> statement-breakpoint
CREATE TABLE "profile" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"user_id" bigint NOT NULL,
	"bio" text DEFAULT NULL,
	"location" varchar(255) DEFAULT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"type" "profile_type" DEFAULT 'user' NOT NULL,
	CONSTRAINT "profile_username_unique" UNIQUE("username")
);
--> statement-breakpoint
ALTER TABLE "user" DROP CONSTRAINT "user_username_unique";--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "username";