'use client'

import { useState, useTransition } from 'react'
import { responderCheckin } from './actions'

export default function CheckinCard({ checkin }: { checkin: any }) {
  const [pending, startTransition] = useTransition()
  const [resposta, setResposta] = useState(checkin.resposta_coach ?? '')
  const [respondido, setRespondido] = useState(checkin.respondido)

  function enviar() {
    if (!resposta.trim()) return
    startTransition(async () => {
      await responderCheckin(checkin.id, resposta)
      setRespondido(true)
    })
  }

  const nome = checkin.profiles?.full_name ?? 'Cliente'
  const avatar = nome.split(' ').map((p: string) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="rounded-2xl border p-5 flex flex-col gap-3" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)', color: '#ffffff' }}>
            {avatar}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium">{nome}</span>
            <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{new Date(checkin.created_at).toLocaleDateString('pt-PT')}</span>
          </div>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="text-sm">{i < (checkin.rating ?? 0) ? '★' : '☆'}</span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs" style={{ color: 'var(--muted-foreground)' }}>
        <div>Energia: {checkin.energia}/5</div>
        <div>Sono: {checkin.sono}h</div>
        <div>Treinos: {checkin.treinos_feitos}</div>
      </div>

      {checkin.nota_cliente && (
        <p className="text-sm rounded-lg p-3" style={{ background: 'var(--background)' }}>{checkin.nota_cliente}</p>
      )}

      {respondido ? (
        <div className="rounded-lg p-3 text-sm" style={{ background: '#688fc822', color: 'var(--accent)' }}>
          💬 {resposta}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            value={resposta}
            onChange={(e) => setResposta(e.target.value)}
            placeholder="Responder ao cliente..."
            className="flex-1 rounded-lg border px-3 py-2 text-sm"
            style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
          />
          <button
            onClick={enviar}
            disabled={pending}
            className="px-4 py-2 rounded-lg text-xs font-bold disabled:opacity-60"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            {pending ? '...' : 'Enviar'}
          </button>
        </div>
      )}
    </div>
  )
}
