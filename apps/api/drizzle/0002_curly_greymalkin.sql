CREATE TABLE "poll_option" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"poll_id" bigint NOT NULL,
	"option" text NOT NULL,
	"votes" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "poll" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"post_id" bigint NOT NULL,
	"question" text NOT NULL,
	"expires_at" timestamp DEFAULT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "poll_post_id_unique" UNIQUE("post_id")
);
--> statement-breakpoint
CREATE TABLE "poll_vote" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"user_id" bigint NOT NULL,
	"poll_option_id" bigint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "poll_vote_user_id_poll_option_id_unique" UNIQUE("user_id","poll_option_id")
);
--> statement-breakpoint
ALTER TABLE "attachment" ALTER COLUMN "asset_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "attachment" ALTER COLUMN "public_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "poll_option" ADD CONSTRAINT "poll_option_poll_id_poll_id_fk" FOREIGN KEY ("poll_id") REFERENCES "public"."poll"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll" ADD CONSTRAINT "poll_post_id_post_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."post"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "poll_vote" ADD CONSTRAINT "poll_vote_poll_option_id_poll_option_id_fk" FOREIGN KEY ("poll_option_id") REFERENCES "public"."poll_option"("id") ON DELETE no action ON UPDATE no action;