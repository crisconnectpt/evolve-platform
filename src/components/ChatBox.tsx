'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { enviarMensagem } from '@/lib/mensagens'

interface Mensagem {
  id: string
  sender_id: string
  conteudo: string
  created_at: string
  lida: boolean
}

interface Props {
  currentUserId: string
  currentUserName: string
  otherId: string
  otherName: string
  initialMessages: Mensagem[]
  revalidatePath: string
}

export default function ChatBox({ currentUserId, currentUserName, otherId, otherName, initialMessages, revalidatePath }: Props) {
  const [messages, setMessages] = useState<Mensagem[]>(initialMessages)
  const [texto, setTexto] = useState('')
  const [pending, startTransition] = useTransition()
  const bottomRef = useRef<HTMLDivElement>(null)

  // Supabase Realtime
  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const channel = supabase
      .channel('messages-realtime')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages' },
        (payload) => {
          const msg = payload.new as Mensagem
          const relevant =
            (msg.sender_id === currentUserId && msg.receiver_id === otherId) ||
            (msg.sender_id === otherId && msg.receiver_id === currentUserId)
          if (relevant) {
            setMessages((prev) => [...prev, msg])
          }
        }
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [currentUserId, otherId])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function enviar() {
    if (!texto.trim()) return
    const conteudo = texto
    setTexto('')
    startTransition(async () => {
      await enviarMensagem(otherId, conteudo, revalidatePath)
    })
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      enviar()
    }
  }

  const getInitials = (name: string) =>
    name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="flex flex-col h-full rounded-2xl border overflow-hidden" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
      {/* Header */}
      <div className="px-5 py-4 border-b flex items-center gap-3" style={{ borderColor: 'var(--card-border)' }}>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--accent)', color: '#ffffff' }}>
          {getInitials(otherName)}
        </div>
        <div>
          <p className="font-bold text-sm">{otherName}</p>
          <p className="text-xs" style={{ color: 'var(--accent)' }}>● Online</p>
        </div>
      </div>

      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-3" style={{ minHeight: 0 }}>
        {messages.length === 0 && (
          <p className="text-sm text-center my-auto" style={{ color: 'var(--muted-foreground)' }}>
            Ainda não há mensagens. Começa a conversa 👋
          </p>
        )}
        {messages.map((m) => {
          const isMe = m.sender_id === currentUserId
          return (
            <div key={m.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: isMe ? 'var(--accent)' : 'var(--muted)', color: isMe ? '#ffffff' : 'var(--foreground)' }}
              >
                {getInitials(isMe ? currentUserName : otherName)}
              </div>
              <div
                className="max-w-xs rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                style={{
                  background: isMe ? 'var(--accent)' : 'var(--background)',
                  color: isMe ? '#ffffff' : 'var(--foreground)',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                }}
              >
                {m.conteudo}
                <p className="text-xs mt-1 opacity-60">
                  {new Date(m.created_at).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t flex gap-2" style={{ borderColor: 'var(--card-border)' }}>
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Escreve uma mensagem... (Enter para enviar)"
          rows={1}
          className="flex-1 rounded-xl border px-3 py-2 text-sm resize-none"
          style={{ background: 'var(--background)', borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
        />
        <button
          onClick={enviar}
          disabled={pending || !texto.trim()}
          className="px-4 py-2 rounded-xl text-sm font-bold disabled:opacity-40"
          style={{ background: 'var(--accent)', color: '#ffffff' }}
        >
          ↑
        </button>
      </div>
    </div>
  )
}
