'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image src="/evolve-logo.svg" alt="Evolve Studio" width={160} height={38} priority />
          </Link>
          <h1 className="text-2xl font-black mt-6">Recuperar password</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
            Introduz o teu email e enviamos um link para redefinires a password.
          </p>
        </div>

        {sent ? (
          <div className="rounded-2xl border p-6 text-center flex flex-col gap-4" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
            <div className="text-4xl">📧</div>
            <div>
              <p className="font-bold">Email enviado!</p>
              <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>
                Verifica a tua caixa de entrada em <strong>{email}</strong> e clica no link para redefinir a password.
              </p>
            </div>
            <Link href="/login" className="text-sm font-medium" style={{ color: 'var(--accent)' }}>
              Voltar ao login →
            </Link>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border p-6 flex flex-col gap-4"
            style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="o-teu@email.com"
                className="rounded-lg border px-3 py-2.5 text-sm"
                style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
              />
            </div>

            {error && (
              <p className="text-sm rounded-lg px-3 py-2" style={{ background: '#ff4d4d22', color: '#ff6b6b' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-60"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              {loading ? 'A enviar...' : 'Enviar link de recuperação'}
            </button>

            <Link href="/login" className="text-center text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
              ← Voltar ao login
            </Link>
          </form>
        )}
      </div>
    </main>
  )
}
