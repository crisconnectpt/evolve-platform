import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Evolve Studio — Treino Personalizado em Funchal",
    template: "%s | Evolve Studio",
  },
  description: "Plataforma de acompanhamento personalizado. Treinos, check-ins, PT online e comunidade Saturday Running Club — Evolve Studio, Armazém do Mercado, Funchal.",
  keywords: ["treino personalizado", "personal trainer", "Funchal", "Madeira", "HYROX", "corrida", "Saturday Running Club", "Evolve Studio"],
  authors: [{ name: "Evolve Studio" }],
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Evolve Studio — Treino Personalizado em Funchal",
    description: "Acompanhamento personalizado online e presencial. HYROX, corrida, força e comunidade SRC.",
    url: "https://evolve-platform.vercel.app",
    siteName: "Evolve Studio",
    locale: "pt_PT",
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 400, alt: "Evolve Studio" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Evolve Studio — Treino Personalizado em Funchal",
    description: "Acompanhamento personalizado online e presencial.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="h-full">
      <body className={`${inter.className} min-h-full`}>{children}</body>
    </html>
  );
}
