import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Sidebar from './components/Sidebar'
import UserMenu from './components/UserMenu'

export default function App() {
  const { t, i18n } = useTranslation()

  const switchLang = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  useEffect(() => {
    // Update document language attribute for browser-native date inputs and accessibility
    const lang = i18n.language || 'pt-BR'
    if (document?.documentElement) {
      document.documentElement.setAttribute('lang', lang)
      document.documentElement.setAttribute('dir', 'ltr')
    }
  }, [i18n.language])

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">{t('app.title')}</h1>
            <div className="flex items-center gap-3">
              <button
                className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                onClick={() => switchLang('pt-BR')}
                aria-label="Português"
              >
                {t('lang.pt')}
              </button>
              <button
                className="px-2 py-1 text-sm border rounded hover:bg-gray-50"
                onClick={() => switchLang('en-US')}
                aria-label="English"
              >
                {t('lang.en')}
              </button>
              <UserMenu />
            </div>
          </div>
        </header>
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
