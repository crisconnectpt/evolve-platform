'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function PrecosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  async function handleCheckout(plano: string) {
    setLoading(plano)
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plano }),
      })
      if (res.status === 401) {
        router.push('/signup')
        return
      }
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setLoading(null)
      }
    } catch {
      setLoading(null)
    }
  }

  const planos = [
    {
      id: 'standard',
      nome: 'Standard',
      preco: 49,
      descricao: 'Para quem quer consistência e acompanhamento real.',
      features: [
        'Plano de treino semanal personalizado',
        'Check-in semanal com o coach',
        'Mensagens com resposta em 24h',
        'Acesso à comunidade SRC',
        'Eventos Saturday Running Club',
      ],
      destaque: false,
    },
    {
      id: 'premium',
      nome: 'Premium',
      preco: 89,
      descricao: 'Para quem quer o máximo. Acompanhamento de elite.',
      features: [
        'Tudo do Standard',
        'Acompanhamento diário',
        'Plano nutricional personalizado',
        'Análise de wearable (WHOOP / Garmin)',
        'Resposta prioritária — menos de 4h',
        'Sessão de avaliação mensal (presencial ou video)',
      ],
      destaque: true,
    },
  ]

  return (
    <main className="min-h-screen" style={{ background: 'var(--background)' }}>
      <nav className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--card-border)' }}>
        <Link href="/" className="inline-block">
          <Image src="/evolve-logo.svg" alt="Evolve Studio" width={130} height={31} priority />
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm" style={{ color: 'var(--muted-foreground)' }}>Entrar</Link>
          <Link href="/signup" className="text-sm font-semibold px-4 py-2 rounded-lg" style={{ background: 'var(--accent)', color: '#ffffff' }}>
            Começar
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black tracking-tight mb-4">
            Escolhe o teu plano
          </h1>
          <p style={{ color: 'var(--muted-foreground)' }}>
            Cancela quando quiseres. Sem contratos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {planos.map((p) => (
            <div
              key={p.id}
              className="rounded-2xl border p-8 flex flex-col gap-6"
              style={{
                background: 'var(--card)',
                borderColor: p.destaque ? 'var(--accent)' : 'var(--card-border)',
              }}
            >
              {p.destaque && (
                <span
                  className="self-start text-xs font-bold px-3 py-1 rounded-full"
                  style={{ background: 'var(--accent)', color: '#ffffff' }}
                >
                  Mais popular
                </span>
              )}
              <div>
                <h2 className="text-xl font-black">{p.nome}</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>{p.descricao}</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="text-5xl font-black">{p.preco}€</span>
                <span className="mb-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>/mês</span>
              </div>
              <ul className="flex flex-col gap-2.5">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span style={{ color: 'var(--accent)' }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleCheckout(p.id)}
                disabled={loading !== null}
                className="mt-auto w-full py-3 rounded-xl font-bold text-sm text-center disabled:opacity-60"
                style={{
                  background: p.destaque ? 'var(--accent)' : 'transparent',
                  color: p.destaque ? '#ffffff' : 'var(--foreground)',
                  border: p.destaque ? 'none' : '1px solid var(--card-border)',
                }}
              >
                {loading === p.id ? 'A abrir checkout...' : `Começar com ${p.nome}`}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center mt-12 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Tens dúvidas?{' '}
          <a href="mailto:evolve@armazemdomercado.com" className="font-medium" style={{ color: 'var(--accent)' }}>
            Fala connosco
          </a>
        </p>
      </div>
    </main>
  )
}
