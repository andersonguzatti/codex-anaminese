import { useEffect, useState } from 'react'
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
    <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
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
