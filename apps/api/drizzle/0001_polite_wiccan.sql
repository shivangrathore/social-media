ALTER TABLE "attachment" RENAME COLUMN "resource_type" TO "type";--> statement-breakpoint
ALTER TABLE "attachment" DROP COLUMN "width";--> statement-breakpoint
ALTER TABLE "attachment" DROP COLUMN "height";