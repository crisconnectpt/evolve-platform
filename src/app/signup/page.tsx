'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { signup } from '@/app/auth/actions'

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const fd = new FormData(e.currentTarget)
    const result = await signup(fd)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block">
            <Image src="/evolve-logo.svg" alt="Evolve Studio" width={160} height={38} priority />
          </Link>
          <p className="mt-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Cria a tua conta
          </p>
        </div>

        <div className="rounded-2xl border p-8" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Nome</label>
                <input
                  name="nome"
                  type="text"
                  placeholder="João"
                  required
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none border"
                  style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Apelido</label>
                <input
                  name="apelido"
                  type="text"
                  placeholder="Silva"
                  required
                  className="w-full rounded-lg px-4 py-3 text-sm outline-none border"
                  style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                type="email"
                placeholder="tu@exemplo.com"
                required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none border"
                style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full rounded-lg px-4 py-3 text-sm outline-none border"
                style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Objetivo principal</label>
              <select
                name="objetivo"
                required
                className="w-full rounded-lg px-4 py-3 text-sm outline-none border"
                style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
              >
                <option value="">Seleccionar...</option>
                <option value="hyrox">Performance HYROX</option>
                <option value="running">Corrida (10k / meia maratona)</option>
                <option value="hybrid">Treino híbrido</option>
                <option value="weight">Perder peso</option>
                <option value="longevity">Longevidade e saúde</option>
                <option value="pt">Personal training premium</option>
              </select>
            </div>

            {error && (
              <p className="text-xs text-center px-3 py-2 rounded-lg" style={{ background: '#ff4d4d22', color: '#ff6b6b' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm mt-2 disabled:opacity-60"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              {loading ? 'A criar conta...' : 'Criar conta'}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Já tens conta?{' '}
          <Link href="/login" className="font-semibold" style={{ color: 'var(--accent)' }}>
            Entrar
          </Link>
        </p>
      </div>
    </main>
  )
}
