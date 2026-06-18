'use client'

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, Legend,
} from 'recharts'

interface WeekData {
  semana: string
  checkins: number
  mediaRating: number
}

interface PlanData {
  name: string
  value: number
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border px-4 py-3 text-sm shadow-xl" style={{ background: '#1a1a1a', borderColor: '#2a2a2a' }}>
      <p className="font-black mb-2" style={{ color: '#ffffff' }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <strong>{p.value}</strong></p>
      ))}
    </div>
  )
}

const PLAN_COLORS: Record<string, string> = {
  starter: '#6b7280',
  standard: '#2d71e0',
  premium: '#7c3aed',
}

export default function CoachCharts({ weekData, planData }: { weekData: WeekData[]; planData: PlanData[] }) {
  return (
    <div className="flex flex-col gap-6">

      {/* Check-ins por semana */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <h3 className="font-black text-sm mb-1">Check-ins por semana</h3>
          <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>Total de check-ins recebidos</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={weekData} barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" vertical={false} />
              <XAxis dataKey="semana" tick={{ fill: '#666', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} tick={{ fill: '#666', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="checkins" name="Check-ins" fill="#2d71e0" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Média bem-estar clientes */}
        <div className="rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <h3 className="font-black text-sm mb-1">Bem-estar médio dos clientes</h3>
          <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>Rating médio semanal (1–5)</p>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
              <XAxis dataKey="semana" tick={{ fill: '#666', fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 5]} tick={{ fill: '#666', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone" dataKey="mediaRating" name="Rating médio"
                stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribuição de planos */}
      {planData.some((p) => p.value > 0) && (
        <div className="rounded-2xl border p-6" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <h3 className="font-black text-sm mb-1">Distribuição de planos</h3>
          <p className="text-xs mb-5" style={{ color: 'var(--muted-foreground)' }}>Subscrições activas por plano</p>
          <div className="flex items-center justify-center gap-10">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={planData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={3} dataKey="value">
                  {planData.map((entry) => (
                    <Cell key={entry.name} fill={PLAN_COLORS[entry.name] ?? '#888'} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {planData.map((p) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: PLAN_COLORS[p.name] ?? '#888' }} />
                  <span className="text-sm font-medium capitalize">{p.name}</span>
                  <span className="text-sm font-black ml-2">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
