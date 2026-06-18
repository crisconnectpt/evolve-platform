'use client'

import { useState, useTransition } from 'react'
import { criarEvento } from './actions'

export default function NovoEvento() {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await criarEvento(formData)
      if (!res?.error) setOpen(false)
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg text-sm font-bold"
        style={{ background: 'var(--accent)', color: '#ffffff' }}
      >
        + Novo evento
      </button>
    )
  }

  return (
    <form action={onSubmit} className="rounded-2xl border p-5 flex flex-col gap-3 mb-2" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      <div className="grid grid-cols-2 gap-3">
        <input name="titulo" placeholder="Título" required className="rounded-lg border px-3 py-2 text-sm col-span-2" style={inputStyle} />
        <input name="data_evento" type="datetime-local" required className="rounded-lg border px-3 py-2 text-sm" style={inputStyle} />
        <input name="distancia" placeholder="Distância (ex: 10km)" className="rounded-lg border px-3 py-2 text-sm" style={inputStyle} />
        <input name="local" placeholder="Local" className="rounded-lg border px-3 py-2 text-sm" style={inputStyle} />
        <input name="max_participantes" type="number" placeholder="Máx. participantes" className="rounded-lg border px-3 py-2 text-sm" style={inputStyle} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-60" style={{ background: 'var(--accent)', color: '#ffffff' }}>
          {pending ? 'A criar...' : 'Criar evento'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

const inputStyle = { background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }
