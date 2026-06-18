'use client'

import { useState, useTransition } from 'react'
import { criarPrograma } from './actions'

export default function NovoPrograma() {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await criarPrograma(formData)
      if (!res?.error) setOpen(false)
    })
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: 'var(--accent)', color: '#ffffff' }}>
        + Novo programa
      </button>
    )
  }

  return (
    <form action={onSubmit} className="rounded-2xl border p-5 flex flex-col gap-3 mb-2 w-full" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      <div className="grid grid-cols-2 gap-3">
        <input name="titulo" placeholder="Título do programa" required className="rounded-lg border px-3 py-2 text-sm col-span-2" style={inputStyle} />
        <textarea name="descricao" placeholder="Descrição" rows={2} className="rounded-lg border px-3 py-2 text-sm col-span-2 resize-none" style={inputStyle} />
        <input name="semanas" type="number" min="1" defaultValue="4" placeholder="Semanas" className="rounded-lg border px-3 py-2 text-sm" style={inputStyle} />
        <select name="nivel" className="rounded-lg border px-3 py-2 text-sm" style={inputStyle}>
          <option>Iniciante</option>
          <option>Intermédio</option>
          <option>Avançado</option>
          <option>Todos</option>
        </select>
        <input name="tag" placeholder="Tag (ex: HYROX, Corrida)" className="rounded-lg border px-3 py-2 text-sm col-span-2" style={inputStyle} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-60" style={{ background: 'var(--accent)', color: '#ffffff' }}>
          {pending ? 'A criar...' : 'Criar programa'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

const inputStyle = { background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }
