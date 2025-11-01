import { useEffect, useMemo, useState } from 'react'
import { AccessItem, Role, linkRoleAccess, linkUserRole, listAccesses, listRoleAccesses, listRoleUsers, listRoles, listUsers, unlinkRoleAccess, unlinkUserRole } from '../lib/api'

export default function AccessManagementPage() {
  const [roles, setRoles] = useState<Role[]>([])
  const [selectedRoleId, setSelectedRoleId] = useState<string>('')
  const [roleUsers, setRoleUsers] = useState<{ id: string; userName: string }[]>([])
  const [roleAccesses, setRoleAccesses] = useState<AccessItem[]>([])
  const [users, setUsers] = useState<{ id: string; userName: string }[]>([])
  const [accesses, setAccesses] = useState<AccessItem[]>([])

  useEffect(() => {
    listRoles().then(setRoles)
    listUsers().then(setUsers as any)
    listAccesses().then(setAccesses)
  }, [])

  useEffect(() => {
    if (!selectedRoleId) return
    listRoleUsers(selectedRoleId).then(setRoleUsers)
    listRoleAccesses(selectedRoleId).then(setRoleAccesses)
  }, [selectedRoleId])

  const selectedRole = useMemo(() => roles.find((r) => r.id === selectedRoleId), [roles, selectedRoleId])

  const onAddUser = async (userId: string) => {
    if (!selectedRoleId) return
    await linkUserRole(selectedRoleId, userId)
    setRoleUsers(await listRoleUsers(selectedRoleId))
  }
  const onRemoveUser = async (userId: string) => {
    if (!selectedRoleId) return
    await unlinkUserRole(selectedRoleId, userId)
    setRoleUsers(await listRoleUsers(selectedRoleId))
  }
  const onAddAccess = async (accessId: string) => {
    if (!selectedRoleId) return
    await linkRoleAccess(selectedRoleId, accessId)
    setRoleAccesses(await listRoleAccesses(selectedRoleId))
  }
  const onRemoveAccess = async (accessId: string) => {
    if (!selectedRoleId) return
    await unlinkRoleAccess(selectedRoleId, accessId)
    setRoleAccesses(await listRoleAccesses(selectedRoleId))
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Gestão de Acessos</h2>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Selecione uma role</label>
        <select className="border rounded px-3 py-2" value={selectedRoleId} onChange={(e) => setSelectedRoleId(e.target.value)}>
          <option value="">-- Selecione --</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.name}</option>
          ))}
        </select>
      </div>

      {selectedRole && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-medium mb-2">Usuários da role</h3>
            <div className="flex items-center gap-2 mb-2">
              <select className="border rounded px-2 py-1" onChange={(e) => e.target.value && onAddUser(e.target.value)} defaultValue="">
                <option value="">Adicionar usuário...</option>
                {users.filter(u => !roleUsers.some(ru => ru.id === u.id)).map((u) => (
                  <option key={u.id} value={u.id}>{u.userName}</option>
                ))}
              </select>
            </div>
            <ul className="divide-y border rounded">
              {roleUsers.map((u) => (
                <li key={u.id} className="flex items-center justify-between px-3 py-2">
                  <span>{u.userName}</span>
                  <button className="text-red-600 text-sm" onClick={() => onRemoveUser(u.id)}>Remover</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium mb-2">Acessos da role</h3>
            <div className="flex items-center gap-2 mb-2">
              <select className="border rounded px-2 py-1" onChange={(e) => e.target.value && onAddAccess(e.target.value)} defaultValue="">
                <option value="">Vincular acesso...</option>
                {accesses.filter(a => !roleAccesses.some(ra => ra.id === a.id) && a.active).map((a) => (
                  <option key={a.id} value={a.id}>{a.method} {a.route}</option>
                ))}
              </select>
            </div>
            <ul className="divide-y border rounded">
              {roleAccesses.map((a) => (
                <li key={a.id} className="flex items-center justify-between px-3 py-2">
                  <span className="font-mono text-sm">{a.method} {a.route}</span>
                  <button className="text-red-600 text-sm" onClick={() => onRemoveAccess(a.id)}>Remover</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

