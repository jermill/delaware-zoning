import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { serverEnv } from '@/lib/env.server';
import { createSupabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, userId, userEmail, tier, returnUrl } = req.body;

    if (!priceId || !userId || !userEmail || !tier) {
      return res.status(400).json({ 
        error: 'Missing required fields: priceId, userId, userEmail, tier' 
      });
    }

    // Validate tier
    if (!['looker', 'pro', 'whale'].includes(tier)) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    // Get or create Stripe customer
    let customerId: string;

    const supabaseAdmin = createSupabaseAdmin();
    
    // Check if user already has a Stripe customer ID
    const { data: subscription } = await supabaseAdmin
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', userId)
      .single();

    if (subscription?.stripe_customer_id) {
      customerId = subscription.stripe_customer_id;
    } else {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          supabase_user_id: userId,
        },
      });
      customerId = customer.id;

      // Update subscription record with customer ID
      await supabaseAdmin
        .from('subscriptions')
        .update({ stripe_customer_id: customerId })
        .eq('user_id', userId);
    }

    // Determine return URLs based on where user came from
    const successUrl = returnUrl?.includes('dashboard') 
      ? `${req.headers.origin}/dashboard?tab=billing&checkout=success`
      : `${req.headers.origin}/dashboard?checkout=success`;
    
    const cancelUrl = returnUrl?.includes('dashboard')
      ? `${req.headers.origin}/dashboard?tab=billing&checkout=cancelled`
      : `${req.headers.origin}/pricing?checkout=cancelled`;

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
        tier: tier,
      },
      subscription_data: {
        metadata: {
          user_id: userId,
          tier: tier,
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return res.status(200).json({ 
      sessionId: session.id,
      url: session.url,
    });
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    return res.status(500).json({ 
      error: 'Failed to create checkout session',
      details: error.message,
    });
  }
}
