import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

export default function Sidebar() {
  const { t } = useTranslation()

  const baseLinkClasses =
    'block px-3 py-2 rounded hover:bg-gray-200 text-gray-800 transition'
  const activeClasses = 'bg-gray-200 font-medium'

  return (
    <aside className="w-64 bg-gray-100 border-r border-gray-200 p-4">
      <h2 className="text-sm font-semibold text-gray-500 mb-2">
        {t('sidebar.contexts')}
      </h2>
      <nav className="space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${baseLinkClasses} ${isActive ? activeClasses : ''}`
          }
        >
          {t('nav.home')}
        </NavLink>
        <NavLink
          to="/anamnese"
          className={({ isActive }) =>
            `${baseLinkClasses} ${isActive ? activeClasses : ''}`
          }
        >
          {t('nav.anamnesis')}
        </NavLink>
      </nav>
    </aside>
  )
}

