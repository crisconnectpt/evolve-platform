import Link from 'next/link'

export default function CheckoutCanceladoPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--background)' }}>
      <div className="w-full max-w-md text-center flex flex-col gap-6">
        <div className="text-6xl">😕</div>
        <div>
          <h1 className="text-3xl font-black tracking-tight">Pagamento cancelado</h1>
          <p className="text-sm mt-3" style={{ color: 'var(--muted-foreground)' }}>
            O pagamento foi cancelado e não foi cobrado nenhum valor. Podes tentar novamente quando quiseres.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/precos"
            className="w-full py-3 rounded-xl font-bold text-sm"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            Ver planos novamente
          </Link>
          <Link
            href="/dashboard/cliente"
            className="w-full py-3 rounded-xl font-bold text-sm border"
            style={{ borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}
          >
            Voltar ao dashboard
          </Link>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Tens dúvidas?{' '}
          <a href="mailto:evolve@armazemdomercado.com" style={{ color: 'var(--accent)' }}>
            Fala connosco
          </a>
        </p>
      </div>
    </main>
  )
}
