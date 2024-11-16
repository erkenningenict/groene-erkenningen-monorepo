CREATE INDEX IF NOT EXISTS "postcode_index" ON "postcodes" USING btree ("postcode");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "woonplaats_index" ON "postcodes" USING btree ("woonplaats");