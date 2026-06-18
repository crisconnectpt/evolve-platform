'use client'

import { useState, useTransition } from 'react'
import { criarSessaoPT } from './actions'

export default function NovaSessao() {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function onSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const res = await criarSessaoPT(formData)
      if (res?.error) setError(res.error)
      else setOpen(false)
    })
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-lg text-sm font-bold" style={{ background: 'var(--accent)', color: '#ffffff' }}>
        + Nova sessão PT
      </button>
    )
  }

  return (
    <form action={onSubmit} className="rounded-2xl border p-5 flex flex-col gap-3 mb-2 w-full" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      <h3 className="font-bold">Nova sessão PT Online</h3>
      <div className="grid grid-cols-2 gap-3">
        <input name="titulo" defaultValue="Sessão PT Online" placeholder="Título" required className="rounded-lg border px-3 py-2 text-sm col-span-2" style={inputStyle} />
        <textarea name="descricao" placeholder="Descrição (ex: foco em força, HYROX prep...)" rows={2} className="rounded-lg border px-3 py-2 text-sm col-span-2 resize-none" style={inputStyle} />
        <div className="flex flex-col gap-1 col-span-2">
          <label className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Data e hora</label>
          <input name="data_hora" type="datetime-local" required className="rounded-lg border px-3 py-2 text-sm" style={inputStyle} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Duração (min)</label>
          <input name="duracao_min" type="number" defaultValue="60" min="15" className="rounded-lg border px-3 py-2 text-sm" style={inputStyle} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Preço (€)</label>
          <input name="preco" type="number" step="0.01" min="1" placeholder="ex: 60" required className="rounded-lg border px-3 py-2 text-sm" style={inputStyle} />
        </div>
        <input name="link_video" placeholder="Link Zoom/Meet (opcional)" className="rounded-lg border px-3 py-2 text-sm col-span-2" style={inputStyle} />
      </div>
      {error && <p className="text-xs" style={{ color: '#ff6b6b' }}>{error}</p>}
      <div className="flex gap-2">
        <button type="submit" disabled={pending} className="px-4 py-2 rounded-lg text-sm font-bold disabled:opacity-60" style={{ background: 'var(--accent)', color: '#ffffff' }}>
          {pending ? 'A criar...' : 'Criar sessão'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 rounded-lg text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Cancelar
        </button>
      </div>
    </form>
  )
}

const inputStyle = { background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }
