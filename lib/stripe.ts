import Stripe from 'stripe';

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-03-25.dahlia' as const,
  });
}

export const PRICE_LABEL = 'サブスク帳 プレミアム（買い切り）';
export const PRICE_AMOUNT = 480;
