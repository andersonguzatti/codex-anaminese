import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5215'

export const api = axios.create({ baseURL })

export type ClientInput = {
  fullName: string
  birthDate?: string | null
  sex?: string | null
  maritalStatus?: string | null
  addressStreet?: string | null
  addressNumber?: string | null
  neighborhood?: string | null
  city?: string | null
  postalCode?: string | null
  email?: string | null
  profession?: string | null
  homePhone?: string | null
  mobilePhone?: string | null
}

export type AnamnesisInput = {
  formDate?: string | null
  areaToBeRemoved?: string | null

  hasAllergies?: boolean | null
  allergiesDetails?: string | null

  isPregnant?: boolean | null

  isBreastFeeding?: boolean | null
  breastFeedingDuration?: string | null

  inCancerTreatment?: boolean | null
  isExOncologicPatient?: boolean | null
  exOncologicStoppedWhen?: string | null

  hasDiabetes?: boolean | null
  diabetesControlled?: boolean | null

  hasHansenDisease?: boolean | null
  hasEpilepsy?: boolean | null
  hasHemophilia?: boolean | null
  hasHepatitis?: boolean | null

  hasHypertension?: boolean | null
  bloodPressureControlled?: boolean | null

  usedIsotretinoinLast6Months?: boolean | null

  hasGlaucoma?: boolean | null
  hasHerpes?: boolean | null
  hasHiv?: boolean | null
  hasLupus?: boolean | null
  hasPsoriasis?: boolean | null
  hasVitiligo?: boolean | null
  hasThrombosis?: boolean | null
  hasPacemaker?: boolean | null

  hasDermatitisAtArea?: boolean | null
  hasRosacea?: boolean | null
  hasCirculatoryProblems?: boolean | null
  hasRespiratoryProblems?: boolean | null
  respiratoryProblemsDetails?: string | null
  hasHormonalProblems?: boolean | null
  hormonalProblemsDetails?: string | null
  hasKeloidTendency?: boolean | null
  usesAcidCream?: boolean | null
  usedInjectableLast30DaysInArea?: boolean | null
  isSmoker?: boolean | null
  usesHormoneOrSteroidTherapy?: boolean | null
  usesRegularMedication?: boolean | null
  regularMedicationDetails?: string | null
  drinksTwoLitersWaterDaily?: boolean | null
  waterIntakeQuantity?: string | null
  doesPhysicalExercise?: boolean | null
  exerciseFrequency?: string | null
  usesSunscreenDaily?: boolean | null

  notes?: string | null
  signatureCity?: string | null
}

export async function createIntake(payload: {
  client: ClientInput
  anamnesis: AnamnesisInput
  signatureDataUrl: string
}) {
  const { data } = await api.post('/api/intakes', payload)
  return data as { clientId: string; anamnesisId: string }
}
