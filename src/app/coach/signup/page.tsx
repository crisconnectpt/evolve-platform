'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { coachSignup } from './actions'

export default function CoachSignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const res = await coachSignup(formData)
    if (res?.error) {
      setError(res.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/evolve-logo-claim.png" alt="Evolve Studio" width={160} height={38} priority />
          </Link>
          <div className="mt-4">
            <span
              className="text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: '#2d71e022', color: 'var(--accent)' }}
            >
              Área reservada — Coaches
            </span>
          </div>
          <h1 className="text-2xl font-black mt-4">Registo de Coach</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
            Acesso restrito. Necessitas de um código de convite.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border p-6 flex flex-col gap-4"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        >
          {/* Nome */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Nome</label>
              <input
                name="nome"
                type="text"
                required
                placeholder="João"
                className="rounded-lg border px-3 py-2.5 text-sm"
                style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Apelido</label>
              <input
                name="apelido"
                type="text"
                required
                placeholder="Silva"
                className="rounded-lg border px-3 py-2.5 text-sm"
                style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
              />
            </div>
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Email</label>
            <input
              name="email"
              type="email"
              required
              placeholder="coach@evolve.pt"
              className="rounded-lg border px-3 py-2.5 text-sm"
              style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              placeholder="Mínimo 6 caracteres"
              className="rounded-lg border px-3 py-2.5 text-sm"
              style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
            />
          </div>

          {/* Especialização */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Especialização</label>
            <select
              name="especializacao"
              className="rounded-lg border px-3 py-2.5 text-sm"
              style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
            >
              <option value="Treino Personalizado">Treino Personalizado</option>
              <option value="HYROX">HYROX</option>
              <option value="Corrida">Corrida</option>
              <option value="Força e Condicionamento">Força e Condicionamento</option>
              <option value="Nutrição Desportiva">Nutrição Desportiva</option>
              <option value="Longevidade e Mobilidade">Longevidade e Mobilidade</option>
              <option value="Treino Híbrido">Treino Híbrido</option>
            </select>
          </div>

          {/* Certificações */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
              Certificações <span style={{ color: 'var(--muted-foreground)', fontWeight: 400 }}>(opcional)</span>
            </label>
            <input
              name="certificacoes"
              type="text"
              placeholder="ex: NSCA-CPT, CrossFit L2, HYROX Coach"
              className="rounded-lg border px-3 py-2.5 text-sm"
              style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
            />
          </div>

          {/* Separador */}
          <div className="border-t my-1" style={{ borderColor: 'var(--card-border)' }} />

          {/* Código de convite */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
              🔒 Código de convite
            </label>
            <input
              name="codigo"
              type="text"
              required
              placeholder="Introduz o código de acesso"
              className="rounded-lg border px-3 py-2.5 text-sm font-mono tracking-widest"
              style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
            />
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Código partilhado internamente pelo Evolve Studio.
            </p>
          </div>

          {error && (
            <p className="text-sm rounded-lg px-3 py-2" style={{ background: '#ff4d4d22', color: '#ff6b6b' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm mt-1 disabled:opacity-60"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            {loading ? 'A criar conta...' : 'Criar conta de coach'}
          </button>

          <p className="text-center text-xs" style={{ color: 'var(--muted-foreground)' }}>
            Já tens conta?{' '}
            <Link href="/login" className="font-medium" style={{ color: 'var(--accent)' }}>
              Entrar
            </Link>
          </p>
        </form>

        <p className="text-center text-xs mt-6" style={{ color: 'var(--muted-foreground)' }}>
          Procuras o registo de cliente?{' '}
          <Link href="/signup" className="font-medium" style={{ color: 'var(--accent)' }}>
            Registo público
          </Link>
        </p>
      </div>
    </main>
  )
}
