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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { address, latitude, longitude, userEmail } = req.body;

    if (!address) {
      return res.status(400).json({ error: 'Property address is required' });
    }

    // Create Stripe checkout session for one-time payment
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Single Property Zoning Report',
              description: `Zoning report for: ${address}`,
              images: ['https://delawarezoning.com/images/logo.png'],
            },
            unit_amount: 3900, // $39.00 in cents
          },
          quantity: 1,
        },
      ],
      customer_email: userEmail || undefined,
      metadata: {
        type: 'single_report',
        address,
        latitude: latitude?.toString() || '',
        longitude: longitude?.toString() || '',
      },
      success_url: `${serverEnv.NEXT_PUBLIC_BASE_URL}/checkout/single-report-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${serverEnv.NEXT_PUBLIC_BASE_URL}/checkout/cancel?type=single-report`,
    });

    res.status(200).json({ url: session.url });
  } catch (error: any) {
    console.error('Error creating single report checkout session:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to create checkout session' 
    });
  }
}

