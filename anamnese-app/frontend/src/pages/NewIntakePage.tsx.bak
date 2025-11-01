import { useRef, useState } from 'react'
import SignatureCanvas from '../components/SignatureCanvas'
import { createIntake, type AnamnesisInput, type ClientInput } from '../lib/api'

function toDateOnly(value: string | undefined) {
  if (!value) return null
  return value
}

function getBool(fd: FormData, name: string) {
  return fd.get(name) === 'on'
}

export default function NewIntakePage() {
  const [loading, setLoading] = useState(false)
  const [signature, setSignature] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successId, setSuccessId] = useState<string | null>(null)

  const formRef = useRef<HTMLFormElement>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccessId(null)
    const fd = new FormData(formRef.current!)

    const client: ClientInput = {
      fullName: String(fd.get('fullName') || '').trim(),
      birthDate: toDateOnly(fd.get('birthDate') as string | undefined),
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
      formDate: toDateOnly(fd.get('formDate') as string | undefined),
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
      const res = await createIntake({ client, anamnesis, signatureDataUrl: signature })
      setSuccessId(res.anamnesisId)
      formRef.current?.reset()
      setSignature(null)
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
      <h2 className="text-lg font-semibold mb-4">Ficha de Anamnese</h2>

      {error && (
        <div className="mb-4 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>
      )}
      {successId && (
        <div className="mb-4 rounded bg-green-50 text-green-700 px-3 py-2 text-sm">
          Ficha criada com sucesso! ID: {successId}
        </div>
      )}

      <form ref={formRef} onSubmit={onSubmit} className="space-y-6">
        <section>
          <h3 className="font-medium text-gray-900 mb-3">Dados Pessoais</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Nome completo</label>
              <input name="fullName" type="text" className={fieldClass} placeholder="Maria da Silva" />
            </div>
            <div>
              <label className={labelClass}>Data de Nascimento</label>
              <input name="birthDate" type="date" className={fieldClass} />
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
              <input name="formDate" type="date" className={fieldClass} />
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
