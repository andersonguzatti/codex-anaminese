import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import MaskedDateInput from '../components/MaskedDateInput'
import { formatDateTimeLocal } from '../lib/date'
import SignatureCanvas from '../components/SignatureCanvas'
import { createIntake, searchClients, type AnamnesisInput, type ClientInput, type ClientSummary } from '../lib/api'

function toDateOnlyMasked(value: string | undefined, lang: string) {
  if (!value) return null
  const v = String(value).trim()
  const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(v)
  if (!m) return null
  const [_, a, b, y] = m
  const isPt = (lang || '').toLowerCase().startsWith('pt')
  // pt-BR: DD/MM/YYYY ; en-US: MM/DD/YYYY
  const dd = isPt ? a : b
  const mm = isPt ? b : a
  const day = Number(dd)
  const mon = Number(mm)
  if (day < 1 || day > 31 || mon < 1 || mon > 12) return null
  return `${y}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
}

function getBool(fd: FormData, name: string) {
  return fd.get(name) === 'on'
}

export default function NewIntakePage() {
  const { i18n } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)
  const [countdown, setCountdown] = useState<number>(7)
  const [selectedClient, setSelectedClient] = useState<ClientSummary | null>(null)
  const [q, setQ] = useState('')
  const [results, setResults] = useState<ClientSummary[]>([])
  const [formKey, setFormKey] = useState<string>('new')
  const navigate = useNavigate()
  useAutoRedirect(successId, countdown, setCountdown, (to: string) => navigate(to))

  const formRef = useRef<HTMLFormElement>(null)

  // Preenche os campos do formulário quando um cliente é selecionado
  useEffect(() => {
    if (!formRef.current) return
    const f = formRef.current
    const set = (name: string, value: any) => {
      const el = f.elements.namedItem(name) as HTMLInputElement | null
      if (el) el.value = value ?? ''
    }
    if (selectedClient) {
      set('fullName', selectedClient.fullName)
      // birthDate vem como yyyy-MM-dd
      if (selectedClient.birthDate) {
        const [y, mm, dd] = String(selectedClient.birthDate).split('-')
        const isPt = i18n.language.toLowerCase().startsWith('pt')
        set('birthDate', isPt ? `${dd}/${mm}/${y}` : `${mm}/${dd}/${y}`)
      }
      set('sex', selectedClient.sex)
      set('maritalStatus', selectedClient.maritalStatus)
      set('addressStreet', selectedClient.addressStreet)
      set('addressNumber', selectedClient.addressNumber)
      set('neighborhood', selectedClient.neighborhood)
      set('city', selectedClient.city)
      set('postalCode', selectedClient.postalCode)
      set('email', selectedClient.email)
      set('profession', selectedClient.profession)
      set('homePhone', selectedClient.homePhone)
      set('mobilePhone', selectedClient.mobilePhone)
    }
  }, [selectedClient, i18n.language])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessId(null)
    const fd = new FormData(formRef.current!)

    const client: ClientInput = {
      fullName: String(fd.get('fullName') || '').trim(),
      birthDate: toDateOnlyMasked(fd.get('birthDate') as string | undefined, i18n.language),
      sex: (fd.get('sex') as string) || null,
      maritalStatus: (fd.get('maritalStatus') as string) || null,
      addressStreet: (fd.get('addressStreet') as string) || null,
      addressNumber: (fd.get('addressNumber') as string) || null,
      neighborhood: (fd.get('neighborhood') as string) || null,
      city: (fd.get('city') as string) || null,
      postalCode: (fd.get('postalCode') as string) || null,
      email: (fd.get('email') as string) || null,
      profession: (fd.get('profession') as string) || null,
      homePhone: (fd.get('homePhone') as string) || null,
      mobilePhone: (fd.get('mobilePhone') as string) || null,
    }

    if (!client.fullName) {
      setError('Nome é obrigatório')
      return
    }
    if (!signature) {
      setError('Assinatura é obrigatória')
      return
    }

    const anamnesis: AnamnesisInput = {
      formDate: toDateOnlyMasked(fd.get('formDate') as string | undefined, i18n.language),
      areaToBeRemoved: (fd.get('areaToBeRemoved') as string) || null,

      hasAllergies: getBool(fd, 'hasAllergies'),
      allergiesDetails: (fd.get('allergiesDetails') as string) || null,

      isPregnant: getBool(fd, 'isPregnant'),

      isBreastFeeding: getBool(fd, 'isBreastFeeding'),
      breastFeedingDuration: (fd.get('breastFeedingDuration') as string) || null,

      inCancerTreatment: getBool(fd, 'inCancerTreatment'),
      isExOncologicPatient: getBool(fd, 'isExOncologicPatient'),
      exOncologicStoppedWhen: (fd.get('exOncologicStoppedWhen') as string) || null,

      hasDiabetes: getBool(fd, 'hasDiabetes'),
      diabetesControlled: getBool(fd, 'diabetesControlled'),

      hasHansenDisease: getBool(fd, 'hasHansenDisease'),
      hasEpilepsy: getBool(fd, 'hasEpilepsy'),
      hasHemophilia: getBool(fd, 'hasHemophilia'),
      hasHepatitis: getBool(fd, 'hasHepatitis'),

      hasHypertension: getBool(fd, 'hasHypertension'),
      bloodPressureControlled: getBool(fd, 'bloodPressureControlled'),

      usedIsotretinoinLast6Months: getBool(fd, 'usedIsotretinoinLast6Months'),

      hasGlaucoma: getBool(fd, 'hasGlaucoma'),
      hasHerpes: getBool(fd, 'hasHerpes'),
      hasHiv: getBool(fd, 'hasHiv'),
      hasLupus: getBool(fd, 'hasLupus'),
      hasPsoriasis: getBool(fd, 'hasPsoriasis'),
      hasVitiligo: getBool(fd, 'hasVitiligo'),
      hasThrombosis: getBool(fd, 'hasThrombosis'),
      hasPacemaker: getBool(fd, 'hasPacemaker'),

      hasDermatitisAtArea: getBool(fd, 'hasDermatitisAtArea'),
      hasRosacea: getBool(fd, 'hasRosacea'),
      hasCirculatoryProblems: getBool(fd, 'hasCirculatoryProblems'),
      hasRespiratoryProblems: getBool(fd, 'hasRespiratoryProblems'),
      respiratoryProblemsDetails: (fd.get('respiratoryProblemsDetails') as string) || null,
      hasHormonalProblems: getBool(fd, 'hasHormonalProblems'),
      hormonalProblemsDetails: (fd.get('hormonalProblemsDetails') as string) || null,
      hasKeloidTendency: getBool(fd, 'hasKeloidTendency'),
      usesAcidCream: getBool(fd, 'usesAcidCream'),
      usedInjectableLast30DaysInArea: getBool(fd, 'usedInjectableLast30DaysInArea'),
      isSmoker: getBool(fd, 'isSmoker'),
      usesHormoneOrSteroidTherapy: getBool(fd, 'usesHormoneOrSteroidTherapy'),
      usesRegularMedication: getBool(fd, 'usesRegularMedication'),
      regularMedicationDetails: (fd.get('regularMedicationDetails') as string) || null,
      drinksTwoLitersWaterDaily: getBool(fd, 'drinksTwoLitersWaterDaily'),
      waterIntakeQuantity: (fd.get('waterIntakeQuantity') as string) || null,
      doesPhysicalExercise: getBool(fd, 'doesPhysicalExercise'),
      exerciseFrequency: (fd.get('exerciseFrequency') as string) || null,
      usesSunscreenDaily: getBool(fd, 'usesSunscreenDaily'),

      notes: (fd.get('notes') as string) || null,
      signatureCity: (fd.get('signatureCity') as string) || null,
    }

    try {
      setLoading(true)
      const res = await createIntake({ client, anamnesis, signatureDataUrl: signature, clientId: selectedClient?.id })
      setSuccessId(res.anamnesisId)
      setCountdown(7)
      formRef.current?.reset()
      setSignature(null)
      setSelectedClient(null)
      setQ('')
      setResults([])
      setFormKey('new-' + Date.now())
    } catch (err: any) {
      console.error(err)
      setError(err?.response?.data?.error || 'Falha ao enviar os dados')
    } finally {
      setLoading(false)
    }
  }

  const fieldClass = 'block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1'

  const YesNo = ({ name, label }: { name: string; label: string }) => (
    <label className="inline-flex items-center gap-2 text-sm text-gray-700">
      <input name={name} type="checkbox" className="rounded border-gray-300" />
      {label}
    </label>
  )

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
      <h2 className="text-lg font-semibold mb-4">{i18n.t('form.title')}</h2>

      {error && (
        <div className="mb-4 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>
      )}
      {successId && (
        <div className="mb-4 rounded bg-green-50 text-green-700 px-3 py-2 text-sm flex items-center justify-between">
          <div>
            {i18n.t('success.created', { id: successId ?? '' })}
            <span className="ml-2 text-green-800/80">{i18n.t('success.redirect', { count: countdown })}</span>
          </div>
          <button
            className="ml-3 px-2 py-1 text-xs rounded border border-green-300 hover:bg-green-100"
            onClick={() => navigate(`/anamnese/${successId}`)}
          >
            {i18n.t('success.viewNow')}
          </button>
        </div>
      )}

      <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
        {/* Busca e seleção de cliente existente */}
        <section>
          <h3 className="font-medium text-gray-900 mb-3">Cliente</h3>
          <div className="relative max-w-xl">
            <input
              type="text"
              value={q}
              onChange={async (e) => {
                const v = e.target.value
                setQ(v)
                if ((v || '').trim().length >= 2) {
                  try {
                    const r = await searchClients({ q: v, take: 8 })
                    setResults(r)
                  } catch { setResults([]) }
                } else {
                  setResults([])
                }
              }}
              placeholder="Pesquisar cliente por nome..."
              className={fieldClass}
            />
            {(q.trim().length >= 2) && (
              <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-sm max-h-72 overflow-auto">
                {results.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    onClick={() => {
                      setSelectedClient(c)
                      setQ(c.fullName)
                      setResults([])
                    }}
                  >
                    <div className="flex flex-col">
                      <span className="font-medium">{c.fullName}</span>
                      <span className="text-xs text-gray-500">
                        {c.mobilePhone ? `${c.mobilePhone}` : '—'}
                        {c.lastAnamnesisAt ? ` • ${formatDateTimeLocal(c.lastAnamnesisAt, i18n.language)}` : ''}
                        {c.city ? ` • ${c.city}` : ''}
                      </span>
                    </div>
                  </button>
                ))}
                {results.length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-600">Nenhuma cliente encontrada.</div>
                )}
                <div className="border-t">
                  <button
                    type="button"
                    className="w-full text-left px-3 py-2 hover:bg-gray-50"
                    onClick={() => {
                      setSelectedClient(null)
                      setQ('')
                      setResults([])
                      formRef.current?.reset()
                    }}
                  >
                    Cadastrar nova cliente
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="h-px bg-gray-200 my-4" />
        </section>
        <section>
          <h3 className="font-medium text-gray-900 mb-3">Dados Pessoais</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nome completo</label>
              <input name="fullName" type="text" className={fieldClass} placeholder="Maria da Silva" />
            </div>
            <div>
              <label className={labelClass}>Data de Nascimento</label>
              <MaskedDateInput name="birthDate" className={fieldClass} lang={i18n.language} />
            </div>
            <div>
              <label className={labelClass}>Sexo</label>
              <input name="sex" type="text" className={fieldClass} placeholder="Feminino/Masculino/Outro" />
            </div>
            <div>
              <label className={labelClass}>Estado Civil</label>
              <input name="maritalStatus" type="text" className={fieldClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Endereço</label>
              <input name="addressStreet" type="text" className={fieldClass} placeholder="Rua, Av..." />
            </div>
            <div>
              <label className={labelClass}>Número</label>
              <input name="addressNumber" type="text" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Bairro</label>
              <input name="neighborhood" type="text" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Cidade</label>
              <input name="city" type="text" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Código Postal</label>
              <input name="postalCode" type="text" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>E-mail</label>
              <input name="email" type="email" className={fieldClass} placeholder="email@exemplo.com" />
            </div>
            <div>
              <label className={labelClass}>Profissão</label>
              <input name="profession" type="text" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Tel. Res.</label>
              <input name="homePhone" type="tel" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}>Telemóvel</label>
              <input name="mobilePhone" type="tel" className={fieldClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Área a ser removida</label>
              <input name="areaToBeRemoved" type="text" className={fieldClass} />
            </div>
          </div>
        </section>

        <section>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Data da Ficha</label>
              <MaskedDateInput name="formDate" className={fieldClass} lang={i18n.language} />
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-medium text-gray-900 mb-3">Histórico do Cliente</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2 flex flex-wrap gap-6">
              <YesNo name="hasAllergies" label="Possui alguma alergia?" />
              <div className="flex-1 min-w-[220px]">
                <input name="allergiesDetails" type="text" className={fieldClass} placeholder="Especifique" />
              </div>
            </div>

            <YesNo name="isPregnant" label="É gestante?" />

            <div className="sm:col-span-2 flex flex-wrap gap-6 items-center">
              <YesNo name="isBreastFeeding" label="Amamenta?" />
              <div className="flex-1 min-w-[220px]">
                <input name="breastFeedingDuration" type="text" className={fieldClass} placeholder="Há quanto tempo?" />
              </div>
            </div>

            <YesNo name="inCancerTreatment" label="Está em tratamento de Câncer?" />
            <div className="sm:col-span-2 flex flex-wrap gap-6 items-center">
              <YesNo name="isExOncologicPatient" label="É ex-paciente oncológica?" />
              <div className="flex-1 min-w-[220px]">
                <input name="exOncologicStoppedWhen" type="text" className={fieldClass} placeholder="Há quanto tempo parou o tratamento?" />
              </div>
            </div>

            <div className="sm:col-span-2 flex flex-wrap gap-6 items-center">
              <YesNo name="hasDiabetes" label="Diabetes?" />
              <YesNo name="diabetesControlled" label="Diabetes controlada?" />
            </div>

            <YesNo name="hasHansenDisease" label="Hanseníase?" />
            <YesNo name="hasEpilepsy" label="Epilepsia?" />
            <YesNo name="hasHemophilia" label="Hemofilia?" />
            <YesNo name="hasHepatitis" label="Hepatite?" />

            <div className="sm:col-span-2 flex flex-wrap gap-6 items-center">
              <YesNo name="hasHypertension" label="Hipertensão?" />
              <YesNo name="bloodPressureControlled" label="Pressão controlada?" />
            </div>

            <YesNo name="usedIsotretinoinLast6Months" label="Usou Roacutan nos últimos 6 meses?" />
            <YesNo name="hasGlaucoma" label="Glaucoma?" />
            <YesNo name="hasHerpes" label="Herpes?" />
            <YesNo name="hasHiv" label="HIV?" />
            <YesNo name="hasLupus" label="Lúpus?" />
            <YesNo name="hasPsoriasis" label="Psoríase?" />
            <YesNo name="hasVitiligo" label="Vitiligo?" />
            <YesNo name="hasThrombosis" label="Trombose?" />
            <YesNo name="hasPacemaker" label="Marca-passo?" />

            <YesNo name="hasDermatitisAtArea" label="Dermatite na região tratada?" />
            <YesNo name="hasRosacea" label="Rosácea?" />
            <YesNo name="hasCirculatoryProblems" label="Problemas circulatórios?" />

            <div className="sm:col-span-2 flex flex-wrap gap-6 items-center">
              <YesNo name="hasRespiratoryProblems" label="Problemas respiratórios?" />
              <div className="flex-1 min-w-[220px]">
                <input name="respiratoryProblemsDetails" type="text" className={fieldClass} placeholder="Qual?" />
              </div>
            </div>

            <div className="sm:col-span-2 flex flex-wrap gap-6 items-center">
              <YesNo name="hasHormonalProblems" label="Problemas hormonais?" />
              <div className="flex-1 min-w-[220px]">
                <input name="hormonalProblemsDetails" type="text" className={fieldClass} placeholder="Qual?" />
              </div>
            </div>

            <YesNo name="hasKeloidTendency" label="Tendência a quelóide?" />
            <YesNo name="usesAcidCream" label="Usa creme à base de ácido?" />
            <YesNo name="usedInjectableLast30DaysInArea" label="Injetável na área nos últimos 30 dias?" />
            <YesNo name="isSmoker" label="É fumante?" />
            <YesNo name="usesHormoneOrSteroidTherapy" label="Terapia hormonal/esteroide?" />

            <div className="sm:col-span-2 flex flex-wrap gap-6 items-center">
              <YesNo name="usesRegularMedication" label="Usa medicação regularmente?" />
              <div className="flex-1 min-w-[220px]">
                <input name="regularMedicationDetails" type="text" className={fieldClass} placeholder="Qual?" />
              </div>
            </div>

            <div className="sm:col-span-2 flex flex-wrap gap-6 items-center">
              <YesNo name="drinksTwoLitersWaterDaily" label="Bebe 2L de água por dia?" />
              <div className="flex-1 min-w-[220px]">
                <input name="waterIntakeQuantity" type="text" className={fieldClass} placeholder="Quantidade ingerida" />
              </div>
            </div>

            <div className="sm:col-span-2 flex flex-wrap gap-6 items-center">
              <YesNo name="doesPhysicalExercise" label="Exercícios físicos?" />
              <div className="flex-1 min-w-[220px]">
                <input name="exerciseFrequency" type="text" className={fieldClass} placeholder="Frequência" />
              </div>
            </div>

            <YesNo name="usesSunscreenDaily" label="Usa protetor solar diariamente?" />

            <div className="sm:col-span-2">
              <label className={labelClass}>Observações</label>
              <textarea name="notes" className={fieldClass} rows={4} placeholder="Informações adicionais..."></textarea>
            </div>
          </div>
        </section>

        <section>
          <h3 className="font-medium text-gray-900 mb-3">Assinatura</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
            <div>
              <label className={labelClass}>Cidade</label>
              <input name="signatureCity" type="text" className={fieldClass} placeholder="Cidade" />
            </div>
          </div>
          <SignatureCanvas onChange={setSignature} />
        </section>

        <div className="flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Salvar ficha'}
          </button>
        </div>
      </form>
    </div>
  )
}

// Auto redirect effect after success
import type React from 'react'
export function useAutoRedirect(
  successId: string | null,
  countdown: number,
  setCountdown: React.Dispatch<React.SetStateAction<number>>,
  navigate: (to: string) => void,
) {
  useEffect(() => {
    if (!successId) return
    setCountdown(countdown)
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          navigate(`/anamnese/${successId}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [successId])
}
