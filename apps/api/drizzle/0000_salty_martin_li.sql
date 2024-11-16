CREATE TABLE IF NOT EXISTS "config" (
	"id" serial PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"organisation_code" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "examenMomenten" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	"type_bijeenkomst" text NOT NULL,
	"examen_nummer" integer NOT NULL,
	"examen_type_nummer" integer NOT NULL,
	"examen_type_omschrijving" text,
	"examen_datum" timestamp NOT NULL,
	"type_examen" text,
	"type_locatie" text NOT NULL,
	"locatie_naam" text,
	"locatie_postcode" text,
	"locatie_plaats" text,
	"url" text,
	"prijs" numeric(10, 2) DEFAULT 0,
	"organisator_bedrijfsnaam" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "postcodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"postcode" integer,
	"woonplaats" varchar(200),
	"alternatieve_schrijfwijzen" varchar(200),
	"gemeente" varchar(200),
	"provincie" varchar(200),
	"netnummer" varchar(200),
	"latitude" numeric(10, 6),
	"longitude" numeric(10, 6),
	"soort" varchar(200),
	"geo_location" geometry(point)
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "label_index" ON "examenMomenten" USING btree ("label");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "queryIndexes" ON "examenMomenten" USING btree ("label","examen_datum","locatie_naam");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "spatial_index" ON "postcodes" USING gist ("geo_location");