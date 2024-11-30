import db from '../db/db'
import { eq, and, ne } from 'drizzle-orm'
import { examenMomenten } from '../db/schema'

export async function getOrganisationOfLabel(label: string) {
  return await db
    .selectDistinct({ organisation: examenMomenten.organisatorBedrijfsnaam })
    .from(examenMomenten)
    .where(
      and(
        eq(examenMomenten.label, label),
        ne(examenMomenten.typeLocatie, 'Online'),
        ne(examenMomenten.organisatorBedrijfsnaam, ''),
      ),
    )
    .orderBy(examenMomenten.organisatorBedrijfsnaam)
}
