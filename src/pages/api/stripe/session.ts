import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { serverEnv } from '@/lib/env.server';

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { session_id } = req.query;

    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'Session ID is required' });
    }

    const session = await stripe.checkout.sessions.retrieve(session_id);

    res.status(200).json({
      id: session.id,
      amount_total: session.amount_total,
      currency: session.currency,
      customer_details: session.customer_details,
      metadata: session.metadata,
      payment_status: session.payment_status,
    });
  } catch (error: any) {
    console.error('Error fetching session:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to fetch session' 
    });
  }
}
