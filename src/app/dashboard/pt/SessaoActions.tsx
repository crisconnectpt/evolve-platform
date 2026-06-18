'use client'

import { useTransition } from 'react'
import { cancelarSessaoPT, concluirSessaoPT } from './actions'

export default function SessaoActions({ id, estado }: { id: string; estado: string }) {
  const [pending, startTransition] = useTransition()

  if (estado === 'cancelado' || estado === 'concluido') return null

  return (
    <div className="flex gap-2 mt-2">
      {estado === 'reservado' && (
        <button
          onClick={() => startTransition(async () => { await concluirSessaoPT(id) })}
          disabled={pending}
          className="px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-60"
          style={{ background: '#2d71e022', color: 'var(--accent)' }}
        >
          ✓ Concluída
        </button>
      )}
      <button
        onClick={() => startTransition(async () => { await cancelarSessaoPT(id) })}
        disabled={pending}
        className="px-3 py-1.5 rounded-lg text-xs font-bold disabled:opacity-60"
        style={{ background: '#ff4d4d22', color: '#ff6b6b' }}
      >
        Cancelar
      </button>
    </div>
  )
}
