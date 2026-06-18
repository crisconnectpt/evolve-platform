'use client'

import { useState, useTransition } from 'react'
import { atribuirPrograma } from '../actions'

export default function AtribuirCliente({ programId, clientes }: { programId: string; clientes: { id: string; full_name: string | null }[] }) {
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)

  function onSubmit(formData: FormData) {
    setDone(false)
    startTransition(async () => {
      const res = await atribuirPrograma(programId, formData)
      if (!res?.error) setDone(true)
    })
  }

  return (
    <form action={onSubmit} className="flex gap-2 items-center">
      <select name="client_id" required className="rounded-lg border px-3 py-2 text-sm" style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}>
        <option value="">Escolher cliente...</option>
        {clientes.map((c) => <option key={c.id} value={c.id}>{c.full_name ?? c.id}</option>)}
      </select>
      <button type="submit" disabled={pending} className="px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-60" style={{ background: 'var(--accent)', color: '#ffffff' }}>
        {pending ? 'A atribuir...' : 'Atribuir'}
      </button>
      {done && <span className="text-xs" style={{ color: 'var(--accent)' }}>✓ Atribuído</span>}
    </form>
  )
}
