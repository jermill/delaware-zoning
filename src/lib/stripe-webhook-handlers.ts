import Stripe from 'stripe';
import { createSupabaseAdmin } from '@/lib/supabase';

/**
 * Handle checkout.session.completed event
 * This fires when a customer successfully completes a checkout session
 */
export async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  console.log('Processing checkout.session.completed:', session.id);

  // Check if this is a single report purchase
  if (session.metadata?.type === 'single_report') {
    return handleSingleReportPurchase(session);
  }

  const userId = session.metadata?.supabase_user_id;
  const tier = session.metadata?.tier as 'pro' | 'business';

  if (!userId || !tier) {
    console.error('Missing metadata in checkout session:', session.id);
    return;
  }

  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;

  // Determine limits based on tier
  const limits = {
    pro: {
      search_limit: 50,
      save_limit: null,
      export_limit: null,
    },
    business: {
      search_limit: null,
      save_limit: null,
      export_limit: null,
    },
  };

  const tierLimits = limits[tier];

  try {
    const supabaseAdmin = createSupabaseAdmin();
    
    // Update subscription in Supabase
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        tier: tier,
        status: 'active',
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        search_limit: tierLimits.search_limit,
        save_limit: tierLimits.save_limit,
        export_limit: tierLimits.export_limit,
        billing_cycle_start: new Date().toISOString(),
        billing_cycle_end: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }

    console.log(`✅ Subscription activated for user ${userId} - ${tier} tier`);
  } catch (error) {
    console.error('Failed to process checkout.session.completed:', error);
    throw error;
  }
}

/**
 * Handle customer.subscription.updated event
 * This fires when a subscription is modified (plan change, status change, etc.)
 */
export async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription
) {
  console.log('Processing customer.subscription.updated:', subscription.id);

  const userId = subscription.metadata?.supabase_user_id;
  const tier = subscription.metadata?.tier as 'pro' | 'business';

  if (!userId) {
    console.error('Missing user ID in subscription metadata:', subscription.id);
    return;
  }

  // Map Stripe subscription status to our status
  const statusMap: { [key: string]: 'active' | 'cancelled' | 'expired' | 'trial' } = {
    active: 'active',
    canceled: 'cancelled',
    past_due: 'active', // Keep active but flag for payment retry
    unpaid: 'expired',
    incomplete: 'trial',
    incomplete_expired: 'expired',
    trialing: 'trial',
  };

  const status = statusMap[subscription.status] || 'active';

  try {
    const supabaseAdmin = createSupabaseAdmin();
    
    // Get current period dates if available
    const updateData: any = {
      status: status,
      updated_at: new Date().toISOString(),
    };

    // Only update billing dates if they exist on the subscription object
    if ('current_period_start' in subscription && subscription.current_period_start) {
      updateData.billing_cycle_start = new Date((subscription.current_period_start as number) * 1000).toISOString();
    }
    if ('current_period_end' in subscription && subscription.current_period_end) {
      updateData.billing_cycle_end = new Date((subscription.current_period_end as number) * 1000).toISOString();
    }

    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update(updateData)
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Error updating subscription:', error);
      throw error;
    }

    console.log(`✅ Subscription updated for user ${userId}`);
  } catch (error) {
    console.error('Failed to process customer.subscription.updated:', error);
    throw error;
  }
}

/**
 * Handle customer.subscription.deleted event
 * This fires when a subscription is cancelled and ends
 */
export async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription
) {
  console.log('Processing customer.subscription.deleted:', subscription.id);

  const userId = subscription.metadata?.supabase_user_id;

  if (!userId) {
    console.error('Missing user ID in subscription metadata:', subscription.id);
    return;
  }

  try {
    const supabaseAdmin = createSupabaseAdmin();
    
    // Downgrade to free tier
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        tier: 'free',
        status: 'cancelled',
        search_limit: 10,
        save_limit: 5,
        export_limit: 3,
        billing_cycle_start: null,
        billing_cycle_end: null,
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription.id);

    if (error) {
      console.error('Error downgrading subscription:', error);
      throw error;
    }

    console.log(`✅ Subscription cancelled for user ${userId} - downgraded to free`);
  } catch (error) {
    console.error('Failed to process customer.subscription.deleted:', error);
    throw error;
  }
}

/**
 * Handle invoice.payment_succeeded event
 * This fires when a payment is successful
 */
export async function handleInvoicePaymentSucceeded(
  invoice: Stripe.Invoice
) {
  console.log('Processing invoice.payment_succeeded:', invoice.id);

  // Check if invoice has a subscription (handle both string and object types)
  const subscriptionId = (invoice as any).subscription 
    ? (typeof (invoice as any).subscription === 'string' 
        ? (invoice as any).subscription 
        : (invoice as any).subscription?.id)
    : null;

  if (!subscriptionId) {
    console.log('Invoice not related to subscription, skipping');
    return;
  }

  try {
    const supabaseAdmin = createSupabaseAdmin();
    
    // Ensure subscription is marked as active
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'active',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (error) {
      console.error('Error updating subscription after payment:', error);
      throw error;
    }

    console.log(`✅ Payment processed for subscription ${subscriptionId}`);
  } catch (error) {
    console.error('Failed to process invoice.payment_succeeded:', error);
    throw error;
  }
}

/**
 * Handle invoice.payment_failed event
 * This fires when a payment fails
 */
export async function handleInvoicePaymentFailed(
  invoice: Stripe.Invoice
) {
  console.log('Processing invoice.payment_failed:', invoice.id);

  // Check if invoice has a subscription (handle both string and object types)
  const subscriptionId = (invoice as any).subscription 
    ? (typeof (invoice as any).subscription === 'string' 
        ? (invoice as any).subscription 
        : (invoice as any).subscription?.id)
    : null;

  if (!subscriptionId) {
    console.log('Invoice not related to subscription, skipping');
    return;
  }

  try {
    const supabaseAdmin = createSupabaseAdmin();
    
    // Mark subscription status based on payment failure
    // Stripe will retry automatically, so we keep it active but could send notification
    const { error } = await supabaseAdmin
      .from('subscriptions')
      .update({
        // Keep as active - Stripe will handle retries
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscriptionId);

    if (error) {
      console.error('Error updating subscription after failed payment:', error);
      throw error;
    }

    console.log(`⚠️  Payment failed for subscription ${subscriptionId}`);
    
    // TODO: Send email notification to user about failed payment
  } catch (error) {
    console.error('Failed to process invoice.payment_failed:', error);
    throw error;
  }
}

/**
 * Handle single report purchase
 * This processes a one-time payment for a single property report
 */
async function handleSingleReportPurchase(
  session: Stripe.Checkout.Session
) {
  console.log('Processing single report purchase:', session.id);

  const address = session.metadata?.address;
  const latitude = session.metadata?.latitude;
  const longitude = session.metadata?.longitude;
  const customerEmail = session.customer_details?.email;

  if (!address || !customerEmail) {
    console.error('Missing required data for single report:', session.id);
    return;
  }

  try {
    // TODO: Generate PDF report for the property
    // TODO: Send email with PDF attachment to customerEmail
    
    console.log(`✅ Single report purchase processed:`);
    console.log(`   Address: ${address}`);
    console.log(`   Email: ${customerEmail}`);
    console.log(`   Amount: $${(session.amount_total || 0) / 100}`);
    
    // For now, just log it. In production, you would:
    // 1. Query zoning data for the address
    // 2. Generate a PDF report
    // 3. Send email with the PDF attached
    // 4. Store purchase record in database
    
  } catch (error) {
    console.error('Failed to process single report purchase:', error);
    throw error;
  }
}

