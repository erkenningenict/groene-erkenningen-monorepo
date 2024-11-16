CREATE TABLE IF NOT EXISTS "certificates_per_label" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"certificate" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
