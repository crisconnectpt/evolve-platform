'use client'

import { useState, useTransition } from 'react'

export default function ReservarBtn({ sessionId }: { sessionId: string }) {
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  function reservar() {
    setError(null)
    startTransition(async () => {
      const res = await fetch('/api/stripe/checkout-pt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Erro ao criar checkout')
      }
    })
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={reservar}
        disabled={pending}
        className="w-full py-2.5 rounded-xl text-sm font-bold disabled:opacity-60"
        style={{ background: 'var(--accent)', color: '#ffffff' }}
      >
        {pending ? 'A abrir pagamento...' : 'Reservar e pagar'}
      </button>
      {error && <p className="text-xs text-center" style={{ color: '#ff6b6b' }}>{error}</p>}
    </div>
  )
}
