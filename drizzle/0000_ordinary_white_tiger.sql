CREATE TYPE "public"."item_type" AS ENUM('album', 'track');--> statement-breakpoint
CREATE TYPE "public"."sentiment" AS ENUM('loved', 'fine', 'disliked');--> statement-breakpoint
CREATE TABLE "items" (
	"mbid" uuid PRIMARY KEY NOT NULL,
	"type" "item_type" NOT NULL,
	"title" text NOT NULL,
	"artist_name" text NOT NULL,
	"artist_mbid" uuid,
	"work_mbid" uuid,
	"release_date" text,
	"cover_url" text,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "items" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"username_chosen" boolean DEFAULT true NOT NULL,
	"bio" text,
	"avatar_url" text,
	"show_factors" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "profiles_username_format" CHECK ("profiles"."username" ~ '^[A-Za-z0-9_]{3,20}$'),
	CONSTRAINT "profiles_bio_length" CHECK (char_length("profiles"."bio") <= 160)
);
--> statement-breakpoint
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rank_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"item_mbid" uuid NOT NULL,
	"sentiment" "sentiment" NOT NULL,
	"position" integer NOT NULL,
	"list_size" integer NOT NULL,
	"score" numeric(3, 1) NOT NULL,
	"factors" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "rank_events_score_range" CHECK ("rank_events"."score" >= 0 and "rank_events"."score" <= 10)
);
--> statement-breakpoint
ALTER TABLE "rank_events" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "rankings" (
	"user_id" uuid NOT NULL,
	"item_mbid" uuid NOT NULL,
	"work_mbid" uuid,
	"sentiment" "sentiment" NOT NULL,
	"position" integer NOT NULL,
	CONSTRAINT "rankings_user_id_item_mbid_pk" PRIMARY KEY("user_id","item_mbid"),
	CONSTRAINT "rankings_position_positive" CHECK ("rankings"."position" >= 1)
);
--> statement-breakpoint
ALTER TABLE "rankings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_users_id_fk" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rank_events" ADD CONSTRAINT "rank_events_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rank_events" ADD CONSTRAINT "rank_events_item_mbid_items_mbid_fk" FOREIGN KEY ("item_mbid") REFERENCES "public"."items"("mbid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_user_id_profiles_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_item_mbid_items_mbid_fk" FOREIGN KEY ("item_mbid") REFERENCES "public"."items"("mbid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_username_lower_idx" ON "profiles" USING btree (lower("username"));--> statement-breakpoint
CREATE INDEX "rank_events_user_item_idx" ON "rank_events" USING btree ("user_id","item_mbid","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "rankings_user_work_idx" ON "rankings" USING btree ("user_id","work_mbid");--> statement-breakpoint
CREATE INDEX "rankings_user_position_idx" ON "rankings" USING btree ("user_id","position");