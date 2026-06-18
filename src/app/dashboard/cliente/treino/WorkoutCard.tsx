'use client'

import { useState, useTransition } from 'react'
import { toggleTreino } from './actions'

interface Workout {
  id: string
  semana: number
  dia: string
  tipo: string
  titulo: string
  descricao: string | null
  concluido: boolean
}

export default function WorkoutCard({ workout }: { workout: Workout }) {
  const [concluido, setConcluido] = useState(workout.concluido)
  const [pending, startTransition] = useTransition()

  function toggle() {
    const next = !concluido
    setConcluido(next)
    startTransition(async () => {
      const res = await toggleTreino(workout.id, next)
      if (res?.error) setConcluido(!next) // reverter se erro
    })
  }

  return (
    <div
      className="rounded-2xl border p-5 flex items-center gap-4 transition-all"
      style={{
        background: concluido ? '#2d71e011' : 'var(--card)',
        borderColor: concluido ? 'var(--accent)' : 'var(--card-border)',
      }}
    >
      {/* Checkbox */}
      <button
        onClick={toggle}
        disabled={pending}
        className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all disabled:opacity-60"
        style={{
          borderColor: concluido ? 'var(--accent)' : 'var(--muted-foreground)',
          background: concluido ? 'var(--accent)' : 'transparent',
        }}
      >
        {concluido && <span className="text-white text-xs font-black">✓</span>}
      </button>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded"
            style={{ background: '#2d71e022', color: 'var(--accent)' }}
          >
            {workout.tipo || 'Treino'}
          </span>
          <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{workout.dia}</span>
        </div>
        <p
          className="font-bold text-sm"
          style={{ textDecoration: concluido ? 'line-through' : 'none', opacity: concluido ? 0.6 : 1 }}
        >
          {workout.titulo}
        </p>
        {workout.descricao && (
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--muted-foreground)' }}>
            {workout.descricao}
          </p>
        )}
      </div>

      {/* Estado */}
      <span
        className="text-xs font-medium px-3 py-1 rounded-full flex-shrink-0"
        style={{
          background: concluido ? '#2d71e022' : 'var(--muted)',
          color: concluido ? 'var(--accent)' : 'var(--muted-foreground)',
        }}
      >
        {pending ? '...' : concluido ? 'Feito 💪' : 'Por fazer'}
      </span>
    </div>
  )
}
