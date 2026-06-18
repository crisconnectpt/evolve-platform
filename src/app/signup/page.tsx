'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { signup } from '@/app/auth/actions'
import { Suspense } from 'react'

const planoInfo: Record<string, { nome: string; preco: string; cor: string }> = {
  starter:  { nome: 'Starter',  preco: '29€/mês', cor: '#6b7280' },
  standard: { nome: 'Standard', preco: '49€/mês', cor: '#2d71e0' },
  premium:  { nome: 'Premium',  preco: '89€/mês', cor: '#7c3aed' },
}

function SignupForm() {
  const params = useSearchParams()
  const plano = params.get('plano') ?? ''
  const info = planoInfo[plano]

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    if (plano) fd.set('plano', plano)
    const result = await signup(fd)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/evolve-logo-claim.png" alt="Evolve Studio" width={160} height={38} priority />
          </Link>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Cria a tua conta
          </p>
        </div>

        {/* Banner do plano selecionado */}
        {info && (
          <div
            className="rounded-2xl border p-4 mb-5 flex items-center justify-between"
            style={{ background: `${info.cor}12`, borderColor: `${info.cor}40` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full" style={{ background: info.cor }} />
              <div>
                <div className="text-sm font-black" style={{ color: info.cor }}>Plano {info.nome}</div>
                <div className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Pagamento após confirmação</div>
              </div>
            </div>
            <div className="text-sm font-black" style={{ color: info.cor }}>{info.preco}</div>
          </div>
        )}

        <div className="rounded-2xl border p-8" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Nome</label>
                <input name="nome" type="text" placeholder="João" required
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none border"
                  style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Apelido</label>
                <input name="apelido" type="text" placeholder="Silva" required
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none border"
                  style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Email</label>
              <input name="email" type="email" placeholder="tu@exemplo.com" required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none border"
                style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Password</label>
              <input name="password" type="password" placeholder="••••••••" required minLength={6}
                className="w-full rounded-lg px-4 py-3 text-sm outline-none border"
                style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }} />
            </div>

            {!info && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Objetivo principal</label>
                <select name="objetivo" required
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none border"
                  style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}>
                  <option value="">Seleccionar...</option>
                  <option value="hyrox">Performance HYROX</option>
                  <option value="running">Corrida (10k / meia maratona)</option>
                  <option value="hybrid">Treino híbrido</option>
                  <option value="weight">Perder peso</option>
                  <option value="longevity">Longevidade e saúde</option>
                  <option value="pt">Personal training premium</option>
                </select>
              </div>
            )}

            {error && (
              <p className="text-xs text-center px-3 py-2 rounded-lg" style={{ background: '#ff4d4d22', color: '#ff6b6b' }}>
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm mt-2 disabled:opacity-60 transition-opacity hover:opacity-90"
              style={{ background: 'var(--accent)', color: '#ffffff' }}>
              {loading ? 'A criar conta...' : info ? `Criar conta e escolher ${info.nome}` : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Já tens conta?{' '}
          <Link href="/login" className="font-semibold" style={{ color: 'var(--accent)' }}>Entrar</Link>
        </p>
      </div>
    </main>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
