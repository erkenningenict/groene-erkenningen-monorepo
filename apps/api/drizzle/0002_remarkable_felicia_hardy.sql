DROP INDEX IF EXISTS "queryIndexes";--> statement-breakpoint
ALTER TABLE "examenMomenten" ADD COLUMN "geo_location" geometry(point);--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "spatial_index_examen_momenten" ON "examenMomenten" USING gist ("geo_location");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "queryIndexes" ON "examenMomenten" USING btree ("label","examen_datum","locatie_naam","geo_location");