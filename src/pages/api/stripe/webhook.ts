import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';
import { serverEnv } from '@/lib/env.server';
import { createSupabaseAdmin } from '@/lib/supabase';

const stripe = new Stripe(serverEnv.STRIPE_SECRET_KEY, {
  apiVersion: '2025-11-17.clover',
});

// Disable body parser for this route (required for Stripe webhooks)
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'] as string;

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      serverEnv.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Error processing webhook:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.user_id;
  const tier = session.metadata?.tier as 'looker' | 'pro' | 'whale';
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  if (!userId || !tier) {
    console.error('Missing metadata in checkout session');
    return;
  }

  const supabaseAdmin = createSupabaseAdmin();
  
  // Update subscription in database
  await supabaseAdmin
    .from('subscriptions')
    .update({
      tier,
      status: 'active',
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  console.log(`Subscription activated for user ${userId}: ${tier}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;
  const tier = subscription.metadata?.tier as 'looker' | 'pro' | 'whale';

  if (!userId) {
    console.error('Missing user_id in subscription metadata');
    return;
  }

  const supabaseAdmin = createSupabaseAdmin();
  
  const status = subscription.status === 'active' ? 'active' :
                 subscription.status === 'past_due' ? 'past_due' :
                 subscription.status === 'canceled' ? 'cancelled' :
                 subscription.status === 'trialing' ? 'trialing' : 'active';

  // Get period info
  const currentPeriodStart = (subscription as any).current_period_start 
    ? new Date((subscription as any).current_period_start * 1000).toISOString()
    : new Date().toISOString();
  const currentPeriodEnd = (subscription as any).current_period_end
    ? new Date((subscription as any).current_period_end * 1000).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await supabaseAdmin
    .from('subscriptions')
    .update({
      tier: tier || 'looker',
      status,
      stripe_subscription_id: subscription.id,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: (subscription as any).cancel_at_period_end || false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  console.log(`Subscription updated for user ${userId}: ${status}`);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error('Missing user_id in subscription metadata');
    return;
  }

  const supabaseAdmin = createSupabaseAdmin();
  
  // Downgrade to free tier
  await supabaseAdmin
    .from('subscriptions')
    .update({
      tier: 'looker',
      status: 'cancelled',
      stripe_subscription_id: null,
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  console.log(`Subscription cancelled for user ${userId}, downgraded to looker`);
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;

  if (!subscriptionId) {
    return;
  }

  // Fetch subscription to get user_id
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error('Missing user_id in subscription metadata');
    return;
  }

  const supabaseAdmin = createSupabaseAdmin();
  
  // Ensure subscription is active
  const currentPeriodEnd = (subscription as any).current_period_end
    ? new Date((subscription as any).current_period_end * 1000).toISOString()
    : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'active',
      current_period_end: currentPeriodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  console.log(`Payment succeeded for user ${userId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const subscriptionId = (invoice as any).subscription as string;

  if (!subscriptionId) {
    return;
  }

  // Fetch subscription to get user_id
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata?.user_id;

  if (!userId) {
    console.error('Missing user_id in subscription metadata');
    return;
  }

  const supabaseAdmin = createSupabaseAdmin();
  
  // Mark subscription as past_due
  await supabaseAdmin
    .from('subscriptions')
    .update({
      status: 'past_due',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);

  console.log(`Payment failed for user ${userId}, subscription marked past_due`);
}


