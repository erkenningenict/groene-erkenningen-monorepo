# Elysia with Bun runtime

## Getting Started

To get started with this template, simply paste this command into your terminal:

```bash
bun create elysia ./elysia-example
```

## Development

To start the development server run:

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

### Run migrations

```bash
bun run db:generate
bun run db:migrate
bun run db:seed
```

To test:

```bash
bun test --watch --only
```

```sql
-- distance query
WITH vars AS (
    SELECT 52.192419100955625 AS lat, 5.4261285304136795 as lon
)
-- ,
select id
     , postcode
     , woonplaats
     , latitude
     , longitude
     , soort
     , geo_location
     , ST_Distance(ST_SetSRID(geo_location, 4326),
                   ST_SetSRID(ST_MakePoint( vars.lon, vars.lat), 4326), true)/1000 as afstandInKm
--      , ST_Distance(ST_SetSRID(ST_Makepoint(longitude, latitude), 4326),
--                    ST_SetSRID(ST_MakePoint( 4.869444, 52.336243), 4326), true) / 1000
from postcodes, vars
-- order by ST_SetSRID(postcodes.geo_location, 4326) <-> ST_SetSRID(ST_MakePoint(4.883358, 52.364240 ), 4326)
    order by postcodes.geo_location <-> ST_SetSRID(ST_MakePoint(vars.lon, vars.lat ), 4326)

-- limit 10
```
