'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('As passwords não coincidem.')
      return
    }
    if (password.length < 6) {
      setError('A password deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    setError(null)

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setDone(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="text-2xl font-black tracking-tight">
            EVOLVE<span style={{ color: 'var(--accent)' }}>.</span>
          </Link>
          <h1 className="text-2xl font-black mt-6">Nova password</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--muted-foreground)' }}>
            Define a tua nova password de acesso.
          </p>
        </div>

        {done ? (
          <div className="rounded-2xl border p-6 text-center" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
            <div className="text-4xl mb-3">✅</div>
            <p className="font-bold">Password actualizada!</p>
            <p className="text-sm mt-1" style={{ color: 'var(--muted-foreground)' }}>A redirecionar para o dashboard...</p>
          </div>
        ) : (
          <form
            onSubmit={onSubmit}
            className="rounded-2xl border p-6 flex flex-col gap-4"
            style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
          >
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Nova password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="rounded-lg border px-3 py-2.5 text-sm"
                style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>Confirmar password</label>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Repete a password"
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
              {loading ? 'A guardar...' : 'Guardar nova password'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
