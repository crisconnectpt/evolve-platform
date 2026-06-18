'use client'

import { useState, useTransition } from 'react'
import { inscrever, desinscrever } from './actions'

export default function EventCard({ event, inscrito, inscritos, max }: { event: any; inscrito: boolean; inscritos: number; max: number }) {
  const [pending, startTransition] = useTransition()
  const [isInscrito, setIsInscrito] = useState(inscrito)

  function toggle() {
    startTransition(async () => {
      if (isInscrito) {
        await desinscrever(event.id)
        setIsInscrito(false)
      } else {
        await inscrever(event.id)
        setIsInscrito(true)
      }
    })
  }

  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      <div>
        <span className="text-xs font-bold" style={{ color: 'var(--accent)' }}>
          {new Date(event.data_evento).toLocaleDateString('pt-PT', { weekday: 'short', day: 'numeric', month: 'short' })}
        </span>
        <h3 className="font-bold">{event.titulo}</h3>
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{event.distancia}</p>
        <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>📍 {event.local}</p>
      </div>
      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{inscritos}{max ? `/${max}` : ''} inscritos</span>
      <button
        onClick={toggle}
        disabled={pending}
        className="w-full py-2 rounded-lg text-xs font-bold disabled:opacity-60"
        style={{
          background: isInscrito ? 'transparent' : 'var(--accent)',
          color: isInscrito ? 'var(--foreground)' : '#ffffff',
          border: isInscrito ? '1px solid var(--card-border)' : 'none',
        }}
      >
        {isInscrito ? 'Cancelar inscrição' : 'Inscrever-me'}
      </button>
    </div>
  )
}
