import { useEffect, useState } from 'react'
import { getProfile, updateProfile } from '../lib/api'

export default function ProfilePage() {
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [locale, setLocale] = useState('pt-BR')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getProfile().then((p) => {
      setFullName(p.fullName || '')
      setAvatarUrl(p.avatarUrl || '')
      setLocale(p.locale || 'pt-BR')
    })
  }, [])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await updateProfile({ fullName, avatarUrl, locale })
      setSaved(true)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-lg font-semibold mb-4">Perfil</h2>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600">Nome completo</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Avatar URL</label>
          <input className="mt-1 w-full border rounded px-3 py-2" value={avatarUrl} onChange={(e) => setAvatarUrl(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm text-gray-600">Idioma</label>
          <select className="mt-1 w-full border rounded px-3 py-2" value={locale} onChange={(e) => setLocale(e.target.value)}>
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en-US">English (US)</option>
          </select>
        </div>
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{saving ? 'Salvando...' : 'Salvar'}</button>
          {saved && <span className="text-green-600 text-sm">Salvo!</span>}
        </div>
      </form>
    </div>
  )
}

