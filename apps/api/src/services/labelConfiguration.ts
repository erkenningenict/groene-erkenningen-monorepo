import * as v from 'valibot'

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
export const LabelTypesSchema = v.enum(LabelTypes)
