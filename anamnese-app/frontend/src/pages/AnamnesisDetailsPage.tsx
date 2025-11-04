import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAnamnesis } from '../lib/api'
import { useTranslation } from 'react-i18next'
import { formatDateOnlyLocal, formatDateTimeLocal } from '../lib/date'

export default function AnamnesisDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { t, i18n } = useTranslation()
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const run = async () => {
      if (!id) return
      setLoading(true)
      setError(null)
      try {
        const d = await getAnamnesis(id)
        setData(d)
      } catch (err) {
        setError(t('errors.loadDetails'))
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [id])

  const onPrint = () => {
    window.print()
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6" id="printable">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t('details.title')}</h2>
        <button
          onClick={onPrint}
          className="px-3 py-2 text-sm rounded border border-gray-300 hover:bg-gray-50"
        >
          {t('details.print')}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>
      )}
      {loading && <div className="text-sm text-gray-500">Carregando...</div>}
      {!loading && data && (
        <div className="space-y-6">
          <section>
            <h3 className="font-medium text-gray-900 mb-2">{t('details.client')}</h3>
            <div className="text-sm text-gray-800">
              <div><span className="text-gray-500">{t('details.name')}: </span>{data.client?.fullName}</div>
              <div><span className="text-gray-500">{t('details.birthDate')}: </span>{formatDateOnlyLocal(data.client?.birthDate, i18n.language)}</div>
              <div><span className="text-gray-500">{t('details.city')}: </span>{data.client?.city ?? '-'}</div>
            </div>
          </section>

          <section>
            <h3 className="font-medium text-gray-900 mb-2">{t('details.form')}</h3>
            <div className="text-sm text-gray-800">
              <div><span className="text-gray-500">{t('details.formDate')}: </span>{formatDateOnlyLocal(data.formDate, i18n.language)}</div>
              <div><span className="text-gray-500">{t('details.area')}: </span>{data.areaToBeRemoved ?? '-'}</div>
              <div><span className="text-gray-500">{t('details.createdAt')}: </span>{formatDateTimeLocal(data.createdAt, i18n.language)}</div>
              <div><span className="text-gray-500">{t('details.signedAt')}: </span>{data.signedAt ? formatDateTimeLocal(data.signedAt, i18n.language) : '-'}</div>
              <div><span className="text-gray-500">{t('details.signatureCity')}: </span>{data.signatureCity ?? '-'}</div>
            </div>
          </section>

          {/* Histórico do cliente (apresentação amigável) */}
          <HistoryFriendly data={data} lang={i18n.language} />

          {data.signatureDataUrl && (
            <section>
              <h3 className="font-medium text-gray-900 mb-2">{t('details.signature')}</h3>
              <img src={data.signatureDataUrl} alt="Assinatura" className="max-w-xs border" />
            </section>
          )}
        </div>
      )}
    </div>
  )
}

// Seção amigável que lista as respostas em ordem do formulário
function HistoryFriendly({ data, lang }: { data: any; lang: string }) {
  const yes = useMemo(() => (lang?.toLowerCase().startsWith('pt') ? 'Sim' : 'Yes'), [lang])
  const no = useMemo(() => (lang?.toLowerCase().startsWith('pt') ? 'Não' : 'No'), [lang])
  const na = useMemo(() => (lang?.toLowerCase().startsWith('pt') ? 'Não informado' : 'Not informed'), [lang])

  const yn = (v: any) => (v === true ? yes : v === false ? no : na)

  const items: { label: string; value: string }[] = [
    { label: 'Possui alguma alergia?', value: `${yn(data.hasAllergies)}${data.allergiesDetails ? ` ( ${data.allergiesDetails} )` : ''}` },
    { label: 'É gestante?', value: yn(data.isPregnant) },
    { label: 'Amamenta?', value: `${yn(data.isBreastFeeding)}${data.breastFeedingDuration ? ` ( ${data.breastFeedingDuration} )` : ''}` },
    { label: 'Está em tratamento de Câncer?', value: yn(data.inCancerTreatment) },
    { label: 'É ex-paciente oncológica?', value: `${yn(data.isExOncologicPatient)}${data.exOncologicStoppedWhen ? ` ( ${data.exOncologicStoppedWhen} )` : ''}` },
    { label: 'Diabetes?', value: yn(data.hasDiabetes) },
    { label: 'Diabetes controlada?', value: yn(data.diabetesControlled) },
    { label: 'Hanseníase?', value: yn(data.hasHansenDisease) },
    { label: 'Epilepsia?', value: yn(data.hasEpilepsy) },
    { label: 'Hemofilia?', value: yn(data.hasHemophilia) },
    { label: 'Hepatite?', value: yn(data.hasHepatitis) },
    { label: 'Hipertensão?', value: yn(data.hasHypertension) },
    { label: 'Pressão controlada?', value: yn(data.bloodPressureControlled) },
    { label: 'Usou Roacutan nos últimos 6 meses?', value: yn(data.usedIsotretinoinLast6Months) },
    { label: 'Glaucoma?', value: yn(data.hasGlaucoma) },
    { label: 'Herpes?', value: yn(data.hasHerpes) },
    { label: 'HIV?', value: yn(data.hasHiv) },
    { label: 'Lúpus?', value: yn(data.hasLupus) },
    { label: 'Psoríase?', value: yn(data.hasPsoriasis) },
    { label: 'Vitiligo?', value: yn(data.hasVitiligo) },
    { label: 'Trombose?', value: yn(data.hasThrombosis) },
    { label: 'Marca-passo?', value: yn(data.hasPacemaker) },
    { label: 'Dermatite na região tratada?', value: yn(data.hasDermatitisAtArea) },
    { label: 'Rosácea?', value: yn(data.hasRosacea) },
    { label: 'Problemas circulatórios?', value: yn(data.hasCirculatoryProblems) },
    { label: 'Problemas respiratórios?', value: `${yn(data.hasRespiratoryProblems)}${data.respiratoryProblemsDetails ? ` ( ${data.respiratoryProblemsDetails} )` : ''}` },
    { label: 'Problemas hormonais?', value: `${yn(data.hasHormonalProblems)}${data.hormonalProblemsDetails ? ` ( ${data.hormonalProblemsDetails} )` : ''}` },
    { label: 'Tendência a quelóide?', value: yn(data.hasKeloidTendency) },
    { label: 'Usa creme à base de ácido?', value: yn(data.usesAcidCream) },
    { label: 'Injetável na área nos últimos 30 dias?', value: yn(data.usedInjectableLast30DaysInArea) },
    { label: 'É fumante?', value: yn(data.isSmoker) },
    { label: 'Terapia hormonal/esteroide?', value: yn(data.usesHormoneOrSteroidTherapy) },
    { label: 'Usa medicação regularmente?', value: `${yn(data.usesRegularMedication)}${data.regularMedicationDetails ? ` ( ${data.regularMedicationDetails} )` : ''}` },
    { label: 'Bebe 2L de água por dia?', value: `${yn(data.drinksTwoLitersWaterDaily)}${data.waterIntakeQuantity ? ` ( ${data.waterIntakeQuantity} )` : ''}` },
    { label: 'Exercícios físicos?', value: `${yn(data.doesPhysicalExercise)}${data.exerciseFrequency ? ` ( ${data.exerciseFrequency} )` : ''}` },
    { label: 'Usa protetor solar diariamente?', value: yn(data.usesSunscreenDaily) },
  ]

  return (
    <section>
      <h3 className="font-medium text-gray-900 mb-2">Histórico do Cliente</h3>
      <div className="text-sm text-gray-800 grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-8">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-start">
            <span className="text-gray-500 mr-1">{it.label}</span>
            <span>- {it.value}</span>
          </div>
        ))}
      </div>
      {data.notes && (
        <div className="mt-3">
          <div className="text-sm text-gray-500">Observações</div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap">{data.notes}</div>
        </div>
      )}
    </section>
  )
}
