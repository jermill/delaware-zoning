import { loadStripe, Stripe } from '@stripe/stripe-js';
import { clientEnv } from './env.client';

// Client-side Stripe.js instance
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(clientEnv.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
  }

  return stripePromise;
};

