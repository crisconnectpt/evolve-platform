import Link from 'next/link'

export default function CheckoutSucessoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md text-center flex flex-col gap-6">
        <div className="text-6xl">🎉</div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Subscrição activa!</h1>
          <p className="text-sm mt-3" style={{ color: 'var(--muted-foreground)' }}>
            O teu pagamento foi confirmado com sucesso. Bem-vindo ao Evolve — o teu coach vai entrar em contacto em breve.
          </p>
        </div>
        <div className="rounded-2xl border p-5 flex flex-col gap-3 text-left" style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}>
          <p className="text-sm font-bold">O que acontece a seguir?</p>
          <ul className="flex flex-col gap-2 text-sm" style={{ color: 'var(--muted-foreground)' }}>
            <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>✓</span> O teu coach vai analisar o teu perfil</li>
            <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>✓</span> Receberás um programa de treino personalizado</li>
            <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>✓</span> Podes começar a usar o check-in semanal</li>
            <li className="flex gap-2"><span style={{ color: 'var(--accent)' }}>✓</span> Acesso à comunidade Saturday Running Club</li>
          </ul>
        </div>
        <Link
          href="/dashboard/cliente"
          className="w-full py-3 rounded-xl font-bold text-sm"
          style={{ background: 'var(--accent)', color: '#ffffff' }}
        >
          Ir para o meu dashboard →
        </Link>
      </div>
    </main>
  )
}
