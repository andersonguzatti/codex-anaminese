import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5215'

export const api = axios.create({ baseURL })

// Attach current user header from localStorage
api.interceptors.request.use((config) => {
  const uid = localStorage.getItem('currentUserId')
  if (uid) {
    config.headers = config.headers ?? {}
    ;(config.headers as any)['X-User-Id'] = uid
  }
  return config
})

export async function bootstrapCurrentUser() {
  const uid = localStorage.getItem('currentUserId')
  if (!uid) {
    try {
      const { data } = await api.get('/api/users/me')
      if (data?.id) localStorage.setItem('currentUserId', data.id)
    } catch {}
  }
}

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

export type AnamnesisListItem = {
  id: string
  clientId: string
  clientName: string
  formDate?: string | null
  createdAt: string
}

export async function listAnamneses(params?: { q?: string; skip?: number; take?: number }) {
  const { data } = await api.get('/api/anamneses', { params })
  return data as AnamnesisListItem[]
}

export async function getAnamnesis(id: string) {
  const { data } = await api.get(`/api/anamneses/${id}`)
  return data as any
}

// Admin & profile APIs
export type CurrentUser = { id: string; userName: string; email?: string; isAdmin: boolean; profile?: { fullName?: string; avatarUrl?: string; locale?: string } }
export async function getMe() {
  const { data } = await api.get('/api/users/me')
  return data as CurrentUser
}

export async function getProfile() {
  const { data } = await api.get('/api/profile')
  return data as { fullName?: string; avatarUrl?: string; locale?: string; email?: string }
}

export async function updateProfile(input: { fullName?: string; avatarUrl?: string; locale?: string }) {
  await api.put('/api/profile', input)
}

export type Role = { id: string; name: string; description?: string; users: number; accesses: number }
export type AccessItem = { id: string; method: string; route: string; active: boolean; name?: string }
export async function listRoles() {
  const { data } = await api.get('/api/admin/roles')
  return data as Role[]
}
export async function listAccesses() {
  const { data } = await api.get('/api/admin/accesses')
  return data as AccessItem[]
}
export async function listUsers() {
  const { data } = await api.get('/api/admin/users')
  return data as { id: string; userName: string; email?: string; isAdmin: boolean }[]
}
export async function listRoleUsers(roleId: string) {
  const { data } = await api.get(`/api/admin/roles/${roleId}/users`)
  return data as { id: string; userName: string; email?: string }[]
}
export async function listRoleAccesses(roleId: string) {
  const { data } = await api.get(`/api/admin/roles/${roleId}/accesses`)
  return data as AccessItem[]
}
export async function linkUserRole(roleId: string, userId: string) {
  await api.post(`/api/admin/roles/${roleId}/users/${userId}`)
}
export async function unlinkUserRole(roleId: string, userId: string) {
  await api.delete(`/api/admin/roles/${roleId}/users/${userId}`)
}
export async function linkRoleAccess(roleId: string, accessId: string) {
  await api.post(`/api/admin/roles/${roleId}/accesses/${accessId}`)
}
export async function unlinkRoleAccess(roleId: string, accessId: string) {
  await api.delete(`/api/admin/roles/${roleId}/accesses/${accessId}`)
}
