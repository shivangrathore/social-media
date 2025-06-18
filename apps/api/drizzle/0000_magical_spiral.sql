CREATE TYPE "public"."like_target" AS ENUM('post', 'comment');--> statement-breakpoint
CREATE TYPE "public"."friend_request_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."profile_type" AS ENUM('user', 'page');--> statement-breakpoint
CREATE TABLE "user" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"first_name" varchar(255) NOT NULL,
	"last_name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_verified" boolean DEFAULT false,
	"avatar" varchar(255) DEFAULT NULL,
	"dob" timestamp DEFAULT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "profile" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"username" varchar(255) NOT NULL,
	"user_id" bigint NOT NULL,
	"bio" text DEFAULT NULL,
	"location" varchar(255) DEFAULT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"name" varchar(255) DEFAULT NULL,
	"type" "profile_type" DEFAULT 'user' NOT NULL,
	CONSTRAINT "profile_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"provider" varchar(255) NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"access_token" varchar(255) DEFAULT NULL,
	"access_token_expires" timestamp DEFAULT NULL,
	"password" varchar(255) DEFAULT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "account_provider_provider_account_id_unique" UNIQUE("provider","provider_account_id")
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"token" varchar(255) NOT NULL,
	"expires" timestamp NOT NULL,
	"ip_address" varchar(255) DEFAULT NULL,
	"user_agent" varchar(255) DEFAULT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "post" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"content" text,
	"published" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT NULL,
	"num_likes" integer DEFAULT 0 NOT NULL,
	"num_comments" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "like" (
	"id" bigserial NOT NULL,
	"target_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"target_type" "like_target" NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "like_target_id_user_id_target_type_unique" UNIQUE("target_id","user_id","target_type")
);
--> statement-breakpoint
CREATE TABLE "comment" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"content" text,
	"post_id" bigint NOT NULL,
	"parent_id" bigint
);
--> statement-breakpoint
CREATE TABLE "attachment" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"post_id" bigint NOT NULL,
	"url" text NOT NULL,
	"asset_id" text,
	"public_id" text,
	"width" integer,
	"height" integer,
	"user_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "friend_request" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"sender_id" bigint NOT NULL,
	"recipient_id" bigint NOT NULL,
	"status" "friend_request_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "friend_request_sender_id_recipient_id_unique" UNIQUE("sender_id","recipient_id"),
	CONSTRAINT "no_self_request" CHECK ("friend_request"."sender_id" != "friend_request"."recipient_id")
);
--> statement-breakpoint
CREATE TABLE "friend" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_1_id" bigint NOT NULL,
	"user_2_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "ordered_friend_ids" CHECK ("friend"."user_1_id" < "friend"."user_2_id")
);
--> statement-breakpoint
ALTER TABLE "profile" ADD CONSTRAINT "profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "post" ADD CONSTRAINT "post_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "like" ADD CONSTRAINT "like_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment" ADD CONSTRAINT "comment_id_comment_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comment"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_sender_id_user_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend_request" ADD CONSTRAINT "friend_request_recipient_id_user_id_fk" FOREIGN KEY ("recipient_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_user_1_id_user_id_fk" FOREIGN KEY ("user_1_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "friend" ADD CONSTRAINT "friend_user_2_id_user_id_fk" FOREIGN KEY ("user_2_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
