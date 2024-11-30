import db from '../db/db'
import { eq, and, isNotNull } from 'drizzle-orm'
import { certificatesPerLabel, examenMomenten } from '../db/schema'

export async function getCertificatesForLabel(label: string) {
  return await db
    .select({ certificate: certificatesPerLabel.certificate })
    .from(certificatesPerLabel)
    .where(eq(certificatesPerLabel.label, label))
}

export async function getCertificatesOfExams(label: string) {
  return await db
    .selectDistinct({ certificate: examenMomenten.certificaatType })
    .from(examenMomenten)
    .where(
      and(
        eq(examenMomenten.label, label),
        isNotNull(examenMomenten.certificaatType),
      ),
    )
    .orderBy(examenMomenten.certificaatType)
}
