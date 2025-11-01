import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { listAnamneses, type AnamnesisListItem } from '../lib/api'
import { useTranslation } from 'react-i18next'
import { formatDateOnlyLocal, formatDateTimeLocal } from '../lib/date'

export default function AnamnesisListPage() {
  const { t, i18n } = useTranslation()
  const [items, setItems] = useState<AnamnesisListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [params, setParams] = useSearchParams()

  const q = params.get('q') ?? ''

  const debouncedQ = useDebounce(q, 300)

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await listAnamneses({ q: debouncedQ || undefined, take: 50 })
        setItems(data)
      } catch (err: any) {
        console.error(err)
        setError(t('errors.loadList'))
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [debouncedQ])

  const onChangeQ = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const next = new URLSearchParams(params)
    if (value) next.set('q', value)
    else next.delete('q')
    setParams(next, { replace: true })
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t('list.title')}</h2>
        <Link
          to="/anamnese/new"
          className="inline-flex items-center px-3 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          {t('list.new')}
        </Link>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={q}
          onChange={onChangeQ}
          placeholder={t('list.filterByName')}
          className="block w-full max-w-md rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {error && (
        <div className="mb-4 rounded bg-red-50 text-red-700 px-3 py-2 text-sm">{error}</div>
      )}
      {loading ? (
        <div className="text-sm text-gray-500">{t('common.loading')}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-left text-gray-600">
              <tr>
                <th className="py-2 pr-4">{t('list.client')}</th>
                <th className="py-2 pr-4">{t('list.formDate')}</th>
                <th className="py-2 pr-4">{t('list.createdAt')}</th>
                <th className="py-2 pr-4">{t('list.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t border-gray-100">
                  <td className="py-2 pr-4">{it.clientName}</td>
                  <td className="py-2 pr-4">{formatDateOnlyLocal(it.formDate, i18n.language)}</td>
                  <td className="py-2 pr-4">{formatDateTimeLocal(it.createdAt, i18n.language)}</td>
                  <td className="py-2 pr-4">
                    <Link
                      to={`/anamnese/${it.id}`}
                      className="px-2 py-1 text-sm rounded border border-gray-300 hover:bg-gray-50"
                    >
                      {t('list.details')}
                    </Link>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="py-4 text-gray-500" colSpan={4}>
                    {t('list.empty')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return v
}
