'use client'

import { useState, useTransition } from 'react'
import { criarWorkout } from '../actions'

export default function NovoWorkout({ programId }: { programId: string }) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()

  function onSubmit(formData: FormData) {
    startTransition(async () => {
      const res = await criarWorkout(programId, formData)
      if (!res?.error) setOpen(false)
    })
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: 'var(--accent)', color: '#ffffff' }}>
        + Adicionar treino
      </button>
    )
  }

  return (
    <form action={onSubmit} className="rounded-2xl border p-5 flex flex-col gap-3 mb-2" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      <div className="grid grid-cols-2 gap-3">
        <input name="semana" type="number" min="1" defaultValue="1" placeholder="Semana" className="rounded-lg border px-3 py-2 text-sm" style={inputStyle} />
        <select name="dia" className="rounded-lg border px-3 py-2 text-sm" style={inputStyle}>
          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((d) => <option key={d}>{d}</option>)}
        </select>
        <input name="tipo" placeholder="Tipo (ex: Força, Cardio)" className="rounded-lg border px-3 py-2 text-sm col-span-2" style={inputStyle} />
        <input name="titulo" placeholder="Título do treino" required className="rounded-lg border px-3 py-2 text-sm col-span-2" style={inputStyle} />
        <textarea name="descricao" placeholder="Descrição / exercícios" rows={2} className="rounded-lg border px-3 py-2 text-sm col-span-2 resize-none" style={inputStyle} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-60" style={{ background: 'var(--accent)', color: '#ffffff' }}>
          {pending ? 'A adicionar...' : 'Adicionar'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

const inputStyle = { background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }
