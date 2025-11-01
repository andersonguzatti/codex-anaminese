import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../lib/api'

export default function UserMenu() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<null | { id: string; userName: string; isAdmin: boolean; profile?: { fullName?: string; avatarUrl?: string } }>(null)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    getMe().then(setUser).catch(() => {})
  }, [])

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const logout = () => {
    localStorage.removeItem('currentUserId')
    window.location.reload()
  }

  const avatarLabel = user?.profile?.fullName?.[0]?.toUpperCase() || user?.userName?.[0]?.toUpperCase() || 'U'

  return (
    <div className="relative" ref={ref}>
      <button
        className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 border hover:bg-gray-300"
        onClick={() => setOpen((o) => !o)}
        aria-label="User menu"
      >
        {avatarLabel}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 shadow-lg rounded-md overflow-hidden z-20">
          <div className="px-4 py-3 border-b">
            <div className="text-sm font-medium">{user?.profile?.fullName || user?.userName}</div>
            <div className="text-xs text-gray-500">{user?.isAdmin ? 'Admin' : 'Usuário'}</div>
          </div>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={() => { setOpen(false); navigate('/perfil') }}>Perfil</button>
          {user?.isAdmin && (
            <button className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={() => { setOpen(false); navigate('/gestao-acessos') }}>Gestão de acessos</button>
          )}
          <button className="w-full text-left px-4 py-2 hover:bg-gray-50" onClick={logout}>Sair</button>
        </div>
      )}
    </div>
  )
}

