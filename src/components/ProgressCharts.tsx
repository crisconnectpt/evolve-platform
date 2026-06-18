'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from 'recharts'

interface CheckinData {
  semana: string
  rating: number
  energia: number
  sono: number
  treinos: number
}

const ACCENT = '#2d71e0'
const GREEN = '#22c55e'
const AMBER = '#f59e0b'
const PURPLE = '#8b5cf6'

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl border px-4 py-3 text-sm shadow-xl"
      style={{ background: '#1a1a1a', borderColor: '#2a2a2a' }}
    >
      <p className="font-black mb-2" style={{ color: '#ffffff' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  )
}

export default function ProgressCharts({ data }: { data: CheckinData[] }) {
  if (data.length === 0) {
    return (
      <div
        className="rounded-2xl border p-10 text-center"
        style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
      >
        <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
          Ainda não tens check-ins suficientes para mostrar gráficos.<br />
          Faz o teu primeiro check-in semanal!
        </p>
      </div>
    )
  }

  const chartData = [...data].reverse()

  return (
    <div className="flex flex-col gap-6">

      {/* Bem-estar geral */}
      <div className="rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
        <h3 className="font-black text-sm mb-1">Bem-estar geral</h3>
        <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>Rating semanal (1–5)</p>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
            <XAxis dataKey="semana" tick={{ fill: '#666', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 5]} tick={{ fill: '#666', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone" dataKey="rating" name="Rating"
              stroke={ACCENT} strokeWidth={2.5} dot={{ fill: ACCENT, r: 4 }} activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Energia e sono */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <h3 className="font-black text-sm mb-1">Energia</h3>
          <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>Nível semanal (1–5)</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
              <XAxis dataKey="semana" tick={{ fill: '#666', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 5]} tick={{ fill: '#666', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="energia" name="Energia"
                stroke={GREEN} strokeWidth={2.5} dot={{ fill: GREEN, r: 4 }} activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <h3 className="font-black text-sm mb-1">Sono</h3>
          <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>Horas por noite</p>
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
              <XAxis dataKey="semana" tick={{ fill: '#666', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 10]} tick={{ fill: '#666', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="sono" name="Sono (h)"
                stroke={PURPLE} strokeWidth={2.5} dot={{ fill: PURPLE, r: 4 }} activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Treinos feitos */}
      <div className="rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
        <h3 className="font-black text-sm mb-1">Treinos realizados</h3>
        <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>Sessões por semana</p>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={chartData} barSize={28}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
            <XAxis dataKey="semana" tick={{ fill: '#666', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#666', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="treinos" name="Treinos" fill={AMBER} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}
