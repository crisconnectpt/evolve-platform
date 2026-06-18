import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-05-27.dahlia',
})

export const PLANS = {
  standard: {
    name: 'Standard',
    price: 49,
    priceId: process.env.STRIPE_PRICE_STANDARD!,
    features: [
      'Plano de treino semanal',
      'Check-in semanal',
      'Mensagens com o coach',
      'Acesso à comunidade SRC',
    ],
  },
  premium: {
    name: 'Premium',
    price: 89,
    priceId: process.env.STRIPE_PRICE_PREMIUM!,
    features: [
      'Tudo do Standard',
      'Acompanhamento diário',
      'Plano nutricional',
      'Análise de wearable (WHOOP/Garmin)',
      'Prioridade de resposta',
    ],
  },
}
