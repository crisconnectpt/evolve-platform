'use client'

import { useState } from 'react'
import Image from 'next/image'
import { completarOnboarding } from './actions'

const objetivos = [
  { id: 'perder_peso', label: 'Perder peso', emoji: '🔥' },
  { id: 'ganhar_musculo', label: 'Ganhar músculo', emoji: '💪' },
  { id: 'melhorar_resistencia', label: 'Melhorar resistência', emoji: '🏃' },
  { id: 'hyrox', label: 'Competir em HYROX', emoji: '⚡' },
  { id: 'saude', label: 'Saúde & bem-estar', emoji: '❤️' },
  { id: 'outro', label: 'Outro', emoji: '🎯' },
]

const niveis = [
  { id: 'iniciante', label: 'Iniciante', desc: 'Começo agora ou voltei recentemente' },
  { id: 'intermedio', label: 'Intermédio', desc: 'Treino regularmente há mais de 6 meses' },
  { id: 'avancado', label: 'Avançado', desc: 'Treino há anos com consistência' },
]

const diasOptions = [2, 3, 4, 5, 6]

export default function OnboardingForm({ nome }: { nome: string }) {
  const [step, setStep] = useState(1)
  const [fields, setFields] = useState({
    full_name: nome,
    objetivo: '',
    nivel: '',
    dias_semana: '3',
    telefone: '',
  })

  const set = (k: keyof typeof fields, v: string) => setFields((f) => ({ ...f, [k]: v }))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12" style={{ background: 'var(--background)' }}>
      {/* Logo */}
      <Image src="/evolve-logo-claim.png" alt="Evolve Studio" width={130} height={32} className="mb-10" />

      {/* Progress bar */}
      <div className="w-full max-w-lg mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
            Passo {step} de 3
          </span>
          <span className="text-xs font-semibold" style={{ color: 'var(--accent)' }}>
            {Math.round((step / 3) * 100)}%
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--card-border)' }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%`, background: 'var(--accent)' }}
          />
        </div>
      </div>

      <form action={completarOnboarding} className="w-full max-w-lg flex flex-col gap-6">
        {/* Campos hidden para o form action */}
        <input type="hidden" name="full_name" value={fields.full_name} />
        <input type="hidden" name="objetivo" value={fields.objetivo} />
        <input type="hidden" name="nivel" value={fields.nivel} />
        <input type="hidden" name="dias_semana" value={fields.dias_semana} />
        <input type="hidden" name="telefone" value={fields.telefone} />

        {/* ── PASSO 1 — Nome e objetivo ── */}
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-1">Bem-vindo ao Evolve 👋</h1>
              <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">
                Vamos personalizar a tua experiência. São só 3 passos rápidos.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                Como te chamas?
              </label>
              <input
                type="text"
                value={fields.full_name}
                onChange={(e) => set('full_name', e.target.value)}
                placeholder="O teu nome completo"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-colors"
                style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                Qual é o teu principal objetivo?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {objetivos.map((o) => (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => set('objetivo', o.id)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-semibold text-left transition-all"
                    style={{
                      background: fields.objetivo === o.id ? 'rgba(45,113,224,0.12)' : 'var(--card)',
                      borderColor: fields.objetivo === o.id ? 'var(--accent)' : 'var(--card-border)',
                      color: fields.objetivo === o.id ? 'var(--accent)' : 'var(--foreground)',
                    }}
                  >
                    <span>{o.emoji}</span>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setStep(2)}
              disabled={!fields.full_name || !fields.objetivo}
              className="py-3.5 rounded-xl font-black text-sm transition-opacity hover:opacity-90 disabled:opacity-40"
              style={{ background: 'var(--accent)', color: '#ffffff' }}
            >
              Continuar →
            </button>
          </div>
        )}

        {/* ── PASSO 2 — Nível e disponibilidade ── */}
        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-1">A tua experiência</h1>
              <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">
                Ajuda-nos a calibrar o teu programa de treino.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                Qual é o teu nível?
              </label>
              <div className="flex flex-col gap-3">
                {niveis.map((n) => (
                  <button
                    key={n.id}
                    type="button"
                    onClick={() => set('nivel', n.id)}
                    className="flex flex-col gap-0.5 px-4 py-3.5 rounded-xl border text-left transition-all"
                    style={{
                      background: fields.nivel === n.id ? 'rgba(45,113,224,0.12)' : 'var(--card)',
                      borderColor: fields.nivel === n.id ? 'var(--accent)' : 'var(--card-border)',
                    }}
                  >
                    <span className="text-sm font-black" style={{ color: fields.nivel === n.id ? 'var(--accent)' : 'var(--foreground)' }}>
                      {n.label}
                    </span>
                    <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{n.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                Quantos dias por semana podes treinar?
              </label>
              <div className="flex gap-2">
                {diasOptions.map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => set('dias_semana', String(d))}
                    className="flex-1 py-3 rounded-xl border text-sm font-black transition-all"
                    style={{
                      background: fields.dias_semana === String(d) ? 'var(--accent)' : 'var(--card)',
                      borderColor: fields.dias_semana === String(d) ? 'var(--accent)' : 'var(--card-border)',
                      color: fields.dias_semana === String(d) ? '#ffffff' : 'var(--foreground)',
                    }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm border transition-colors"
                style={{ borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}
              >
                ← Voltar
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!fields.nivel}
                className="flex-1 py-3.5 rounded-xl font-black text-sm transition-opacity hover:opacity-90 disabled:opacity-40"
                style={{ background: 'var(--accent)', color: '#ffffff' }}
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* ── PASSO 3 — Telefone + Confirmar ── */}
        {step === 3 && (
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tight mb-1">Quase pronto! 🎉</h1>
              <p style={{ color: 'var(--muted-foreground)' }} className="text-sm">
                Opcional: deixa o teu contacto para o coach poder falar contigo.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
                Telefone (opcional)
              </label>
              <input
                type="tel"
                value={fields.telefone}
                onChange={(e) => set('telefone', e.target.value)}
                placeholder="+351 9xx xxx xxx"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none border transition-colors"
                style={{ background: 'var(--card)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
              />
            </div>

            {/* Resumo */}
            <div
              className="rounded-2xl border p-5 flex flex-col gap-3"
              style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
            >
              <span className="text-xs font-black uppercase tracking-widest" style={{ color: 'var(--accent)' }}>
                Resumo
              </span>
              {[
                { label: 'Nome', value: fields.full_name },
                { label: 'Objetivo', value: objetivos.find((o) => o.id === fields.objetivo)?.label ?? fields.objetivo },
                { label: 'Nível', value: niveis.find((n) => n.id === fields.nivel)?.label ?? fields.nivel },
                { label: 'Dias/semana', value: `${fields.dias_semana} dias` },
              ].map((r) => (
                <div key={r.label} className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted-foreground)' }}>{r.label}</span>
                  <span className="font-semibold">{r.value}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="px-6 py-3.5 rounded-xl font-semibold text-sm border transition-colors"
                style={{ borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}
              >
                ← Voltar
              </button>
              <button
                type="submit"
                className="flex-1 py-3.5 rounded-xl font-black text-sm transition-opacity hover:opacity-90"
                style={{ background: 'var(--accent)', color: '#ffffff' }}
              >
                Entrar no Evolve 🚀
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  )
}
