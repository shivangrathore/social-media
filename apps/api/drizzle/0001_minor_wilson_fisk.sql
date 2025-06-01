ALTER TABLE "user" ADD COLUMN "first_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "last_name" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "dob" timestamp DEFAULT NULL;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "name";