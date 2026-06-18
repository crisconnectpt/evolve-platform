'use client'

import { useState, useTransition } from 'react'
import { criarCheckin } from './actions'

export default function CheckinForm() {
  const [pending, startTransition] = useTransition()
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function onSubmit(formData: FormData) {
    setError(null)
    startTransition(async () => {
      const res = await criarCheckin(formData)
      if (res?.error) setError(res.error)
      else setDone(true)
    })
  }

  if (done) {
    return (
      <div className="rounded-2xl border p-6 text-center" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
        <p className="font-bold">✅ Check-in enviado!</p>
        <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>O teu coach vai rever e responder em breve.</p>
      </div>
    )
  }

  return (
    <form action={onSubmit} className="rounded-2xl border p-6 flex flex-col gap-5" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      {(['rating', 'energia'] as const).map((field) => (
        <div key={field} className="flex flex-col gap-2">
          <label className="text-sm font-medium capitalize">{field === 'rating' ? 'Como correu a semana? (1-5)' : 'Nível de energia (1-5)'}</label>
          <select name={field} required className="rounded-lg border px-3 py-2 text-sm" style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      ))}

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Média de horas de sono</label>
        <input name="sono" type="number" step="0.5" min="0" max="12" required defaultValue="7" className="rounded-lg border px-3 py-2 text-sm" style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Quantos treinos fizeste esta semana?</label>
        <input name="treinos_feitos" type="number" min="0" max="14" required defaultValue="3" className="rounded-lg border px-3 py-2 text-sm" style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }} />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">Notas para o coach</label>
        <textarea name="nota" rows={3} placeholder="Como te sentiste, dores, dificuldades..." className="rounded-lg border px-3 py-2 text-sm resize-none" style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }} />
      </div>

      {error && <p className="text-sm" style={{ color: '#ff6b6b' }}>{error}</p>}

      <button type="submit" disabled={pending} className="py-3 rounded-xl font-bold text-sm disabled:opacity-60" style={{ background: 'var(--accent)', color: '#ffffff' }}>
        {pending ? 'A enviar...' : 'Enviar check-in'}
      </button>
    </form>
  )
}
