import {
  serial,
  text,
  timestamp,
  pgTable,
  index,
  integer,
  decimal,
  varchar,
  boolean,
  geometry,
  json,
} from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const config = pgTable('config', {
  id: serial('id').primaryKey(),
  label: text('label').notNull(),
  organisationCode: text('organisation_code').notNull(),
  enabled: boolean('enabled').notNull().default(true),
  certificateTypeConfiguration: json('certificate_type_configuration'),
  calendarHints: json('calendar_hints'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type SelectConfig = typeof config.$inferSelect
export type InsertConfig = typeof config.$inferInsert

export const examenMomenten = pgTable(
  'examenMomenten',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => createId()),
    label: text('label').notNull().$type<string>(),
    typeBijeenkomst: text('type_bijeenkomst').notNull(),
    examenNummer: integer('examen_nummer').notNull().$type<number>(),
    examenTypeNummer: integer('examen_type_nummer').notNull().$type<number>(),
    examenTypeOmschrijving: text('examen_type_omschrijving'),
    examenDatum: timestamp('examen_datum').notNull(),
    typeExamen: text('type_examen'),
    typeLocatie: text('type_locatie').notNull(),
    // status: text('status'),
    locatieNaam: text('locatie_naam'),
    locatiePostcode: text('locatie_postcode'),
    locatiePlaats: text('locatie_plaats'),
    url: text('url'),
    prijs: decimal('prijs', { precision: 10, scale: 2 })
      .$type<number>()
      .default(0),
    organisatorBedrijfsnaam: text('organisator_bedrijfsnaam'),
    geoLocation: geometry('geo_location', {
      type: 'point',
      mode: 'xy',
      srid: 4326,
    }),
    certificaatType: text('certificaat_type'),

    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  table => {
    return {
      labelIndex: index('label_index').on(table.label),
      spatialIndex: index('spatial_index_examen_momenten').using(
        'gist',
        table.geoLocation,
      ),
      queryIndexes: index('queryIndexes').on(
        table.label,
        table.typeBijeenkomst,
        table.examenDatum,
        table.locatieNaam,
        table.geoLocation,
        table.certificaatType,
      ),
    }
  },
)

export type SelectExamenMoment = typeof examenMomenten.$inferSelect
export type InsertExamenMoment = typeof examenMomenten.$inferInsert

// https://github.com/bobdenotter/4pp/blob/master/4pp.sql
export const postcodes = pgTable(
  'postcodes',
  {
    id: serial('id').primaryKey(),
    postcode: integer('postcode'),
    woonplaats: varchar('woonplaats', { length: 200 }),
    alternatieveSchrijfwijzen: varchar('alternatieve_schrijfwijzen', {
      length: 200,
    }),
    gemeente: varchar('gemeente', { length: 200 }),
    provincie: varchar('provincie', { length: 200 }),
    netnummer: varchar('netnummer', { length: 200 }),
    latitude: decimal('latitude', { precision: 10, scale: 6 }),
    longitude: decimal('longitude', { precision: 10, scale: 6 }),
    soort: varchar('soort', { length: 200 }),
    geoLocation: geometry('geo_location', {
      type: 'point',
      mode: 'xy',
      srid: 4326,
    }),
  },
  t => ({
    postcodeIndex: index('postcode_index').on(t.postcode),
    woonplaatsIndex: index('woonplaats_index').on(t.woonplaats),
    spatialIndex: index('spatial_index').using('gist', t.geoLocation),
  }),
)

export type SelectPostcode = typeof postcodes.$inferSelect

export const certificatesPerLabel = pgTable('certificates_per_label', {
  id: serial('id').primaryKey(),
  label: text('label').notNull(),
  certificate: text('certificate').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export type SelectCertificatesPerLabel =
  typeof certificatesPerLabel.$inferSelect
