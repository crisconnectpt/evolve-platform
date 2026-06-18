import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--background)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 border-b" style={{ borderColor: 'var(--card-border)' }}>
        <Image src="/evolve-logo.svg" alt="Evolve Studio" width={140} height={33} priority />
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
            Entrar
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold px-4 py-2 rounded-lg"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            Começar
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 gap-8">
        <div
          className="inline-flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border"
          style={{ borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}
        >
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--accent)' }} />
          Funchal, Madeira — Armazém do Mercado
        </div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter max-w-4xl leading-none">
          Treino que<br />
          <span style={{ color: 'var(--accent)' }}>te acompanha</span><br />
          a sério.
        </h1>

        <p className="text-lg max-w-xl" style={{ color: 'var(--muted-foreground)' }}>
          Acompanhamento personalizado online com a metodologia do Evolve Studio.
          Performance real, comunidade forte, resultados que duram.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-xl font-bold text-base"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            Começar agora
          </Link>
          <Link
            href="#como-funciona"
            className="px-8 py-4 rounded-xl font-semibold text-base border"
            style={{ borderColor: 'var(--card-border)', color: 'var(--foreground)' }}
          >
            Como funciona
          </Link>
        </div>
      </section>

      {/* Pilares */}
      <section id="como-funciona" className="px-6 py-20 max-w-6xl mx-auto w-full">
        <h2 className="text-3xl font-black tracking-tight mb-12 text-center">Como funciona</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: '📋', title: 'Plano personalizado', desc: 'Treino semanal adaptado aos teus objetivos, disponibilidade e equipamento.' },
            { icon: '✅', title: 'Check-ins semanais', desc: 'Acompanhamento real com feedback do coach. Nunca ficas sem resposta.' },
            { icon: '🏃', title: 'Comunidade SRC', desc: 'Saturday Running Club, desafios mensais, leaderboards e eventos presenciais.' },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-6 border flex flex-col gap-3"
              style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
            >
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 py-20 text-center">
        <div
          className="max-w-2xl mx-auto rounded-3xl p-12 border"
          style={{ background: 'var(--card)', borderColor: 'var(--card-border)' }}
        >
          <h2 className="text-4xl font-black tracking-tight mb-4">
            Pronto para <span style={{ color: 'var(--accent)' }}>evoluir</span>?
          </h2>
          <p className="mb-8" style={{ color: 'var(--muted-foreground)' }}>
            Junta-te à comunidade Evolve. Primeiro mês sem compromisso.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 rounded-xl font-bold text-base"
            style={{ background: 'var(--accent)', color: '#ffffff' }}
          >
            Criar conta gratuita
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t text-center text-sm" style={{ borderColor: 'var(--card-border)', color: 'var(--muted-foreground)' }}>
        © 2025 Evolve Studio · Funchal, Madeira
      </footer>
    </main>
  )
}
