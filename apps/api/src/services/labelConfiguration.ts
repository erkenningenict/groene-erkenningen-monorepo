import { z } from 'zod'

export enum LabelTypes {
  aocKeurmerk = 'AOC Keurmerk',
  groenkeur = 'Groenkeur',
  kleurKeur = 'Kleurkeur',
  nkc = 'Nederlands Kettingzaag Certificaat',
  rpmv = 'RPMV',
  gewasbescherming = 'Gewasbescherming',
  // boomveiligheidcontroleur = "boomVeiligheidControleur",
  // dakEnGevelbegroener = "dakEnGevelbegroener",
}
export const LabelTypesSchema = z.nativeEnum(LabelTypes)
