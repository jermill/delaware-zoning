import type { NextApiRequest, NextApiResponse } from 'next';
import { stripe } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get auth token from header
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Missing authorization header' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get request body
    const { tier } = req.body;

    if (!tier || !['pro', 'business'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier. Must be "pro" or "business"' });
    }

    // Get user profile for email
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', user.id)
      .single();

    if (!profile) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Get the appropriate price ID
    const priceId =
      tier === 'pro'
        ? process.env.STRIPE_PRICE_PRO
        : process.env.STRIPE_PRICE_BUSINESS;

    if (!priceId) {
      return res.status(500).json({
        error: 'Stripe price ID not configured. Please contact support.',
      });
    }

    // Check if user already has a Stripe customer ID
    const { data: existingSubscription } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    let customerId = existingSubscription?.stripe_customer_id;

    // Create or retrieve Stripe customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        name: profile.full_name || undefined,
        metadata: {
          supabase_user_id: user.id,
        },
      });
      customerId = customer.id;
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/checkout/cancel`,
      metadata: {
        supabase_user_id: user.id,
        tier: tier,
      },
      subscription_data: {
        metadata: {
          supabase_user_id: user.id,
          tier: tier,
        },
      },
    });

    return res.status(200).json({ sessionId: session.id, url: session.url });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({
      error: error.message || 'Failed to create checkout session',
    });
  }
}
