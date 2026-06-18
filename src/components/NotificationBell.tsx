'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Bell } from 'lucide-react'

interface Notification {
  id: string
  titulo: string
  mensagem: string | null
  tipo: string
  lida: boolean
  created_at: string
}

const tipoColor: Record<string, string> = {
  sucesso: '#22c55e',
  aviso: '#f59e0b',
  info: 'var(--accent)',
}

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (diff < 60) return 'agora mesmo'
  if (diff < 3600) return `há ${Math.floor(diff / 60)}min`
  if (diff < 86400) return `há ${Math.floor(diff / 3600)}h`
  return `há ${Math.floor(diff / 86400)}d`
}

export default function NotificationBell({ userId }: { userId: string }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const unread = notifications.filter((n) => !n.lida).length

  useEffect(() => {
    supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)
      .then(({ data }) => setNotifications(data ?? []))

    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${userId}` },
        (payload) => {
          setNotifications((prev) => [payload.new as Notification, ...prev])
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [userId])

  // Fechar ao clicar fora
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  async function marcarTodasLidas() {
    await supabase
      .from('notifications')
      .update({ lida: true })
      .eq('user_id', userId)
      .eq('lida', false)
    setNotifications((prev) => prev.map((n) => ({ ...n, lida: true })))
  }

  async function marcarLida(id: string) {
    await supabase.from('notifications').update({ lida: true }).eq('id', id)
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, lida: true } : n))
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative p-2 rounded-xl transition-colors"
        style={{ color: 'var(--muted-foreground)' }}
        aria-label="Notificações"
      >
        <Bell size={20} strokeWidth={2} />
        {unread > 0 && (
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-black flex items-center justify-center"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-80 rounded-2xl border shadow-2xl overflow-hidden z-50"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        >
          <div
            className="flex items-center justify-between px-4 py-3 border-b"
            style={{ borderColor: 'var(--card-border)' }}
          >
            <span className="text-sm font-black">Notificações</span>
            {unread > 0 && (
              <button
                onClick={marcarTodasLidas}
                className="text-xs font-semibold"
                style={{ color: 'var(--accent)' }}
              >
                Marcar todas como lidas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
                Sem notificações
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => marcarLida(n.id)}
                  className="w-full text-left px-4 py-3 flex gap-3 transition-colors hover:opacity-80 border-b last:border-0"
                  style={{
                    borderColor: 'var(--card-border)',
                    background: n.lida ? 'transparent' : 'rgba(45,113,224,0.05)',
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                    style={{ background: n.lida ? 'transparent' : (tipoColor[n.tipo] ?? 'var(--accent)') }}
                  />
                  <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                    <span className="text-sm font-semibold truncate">{n.titulo}</span>
                    {n.mensagem && (
                      <span className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                        {n.mensagem}
                      </span>
                    )}
                    <span className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)', opacity: 0.6 }}>
                      {timeAgo(n.created_at)}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
