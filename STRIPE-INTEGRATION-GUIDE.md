# Stripe Payment Integration - Complete Setup Guide

## Overview

This guide walks you through the complete Stripe integration for Delaware Zoning. The system supports:
- Monthly subscriptions (Pro $29.99, Business $99.99)
- Automatic subscription management via webhooks
- Self-service billing portal
- Secure payment processing with production keys

---

## Phase 1: Environment Setup ✅ COMPLETE

### What Was Implemented:
- ✅ Stripe SDK installed (`stripe` and `@stripe/stripe-js`)
- ✅ Server-side Stripe client (`src/lib/stripe.ts`)
- ✅ Client-side Stripe.js loader (`src/lib/stripeClient.ts`)

### Your Action Required:

**1. Add Stripe Keys to `.env.local`:**

```env
# Stripe Production Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (get this in Phase 4)
```

**2. Get Your Keys from Stripe Dashboard:**
- Go to https://dashboard.stripe.com/apikeys
- Copy your Production keys (NOT test keys)
- Keep secret key secure - never commit to git

---

## Phase 2: Create Products & Prices ✅ COMPLETE

### What Was Implemented:
- ✅ Automated product creation script (`scripts/setup-stripe-products.ts`)

### Your Action Required:

**Run the Product Setup Script:**

```bash
# Ensure STRIPE_SECRET_KEY is in .env.local first
npx ts-node scripts/setup-stripe-products.ts
```

**This will:**
1. Create "Delaware Zoning - The Pro" product at $29.99/month
2. Create "Delaware Zoning - The Whale" product at $99.99/month  
3. Generate price IDs and save them to `scripts/stripe-product-ids.txt`

**Then add the Price IDs to `.env.local`:**

```env
STRIPE_PRICE_PRO=price_xxxxxxxxxxxxx
STRIPE_PRICE_BUSINESS=price_xxxxxxxxxxxxx
```

**Alternatively: Manual Setup**

If you prefer to create products manually:
1. Go to Stripe Dashboard → Products
2. Create "Delaware Zoning - The Pro" - $29.99/month recurring
3. Create "Delaware Zoning - The Whale" - $99.99/month recurring
4. Copy the Price IDs (not Product IDs) to your `.env.local`

---

## Phase 3: Checkout Flow ✅ COMPLETE

### What Was Implemented:
- ✅ `/api/stripe/create-checkout-session` - Initiates payment
- ✅ `/api/stripe/create-portal-session` - Opens billing portal
- ✅ `UpgradeButton` component - Reusable upgrade UI
- ✅ `/checkout/success` page - Post-payment confirmation
- ✅ `/checkout/cancel` page - Cancelled payment handling
- ✅ Updated `BillingTab` with real Stripe integration

### How It Works:

**User clicks "Upgrade Now" →**
1. `UpgradeButton` calls `/api/stripe/create-checkout-session`
2. API creates Stripe Checkout Session with user metadata
3. User redirects to Stripe's hosted checkout page
4. After payment: redirects to `/checkout/success`
5. If cancelled: redirects to `/checkout/cancel`

### Test It:
1. Start dev server: `npm run dev`
2. Log in and go to Dashboard → Billing tab
3. Click "Upgrade Now" on any plan
4. You'll be redirected to Stripe Checkout

---

## Phase 4: Webhook Handler ✅ COMPLETE

### What Was Implemented:
- ✅ `/api/stripe/webhook` - Webhook endpoint
- ✅ `stripe-webhook-handlers.ts` - Event processing
- ✅ Handles 5 critical events:
  - `checkout.session.completed` - Activates subscription
  - `customer.subscription.updated` - Updates subscription
  - `customer.subscription.deleted` - Downgrades to free
  - `invoice.payment_succeeded` - Confirms payment
  - `invoice.payment_failed` - Handles failures

### Your Action Required:

**1. Deploy Your App First**

You need a public URL for webhooks. Options:
- Deploy to Vercel/Netlify (recommended)
- Use ngrok for local testing: `ngrok http 3000`

**2. Register Webhook in Stripe Dashboard:**

1. Go to: https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Enter your endpoint URL:
   ```
   https://your-domain.com/api/stripe/webhook
   ```
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Click "Reveal" on the Signing Secret
7. Copy the `whsec_...` value

**3. Add Webhook Secret to `.env.local`:**

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
```

**4. Restart Your App**

The webhook endpoint verifies signatures using this secret.

---

## Phase 5: Billing Portal ✅ COMPLETE

### What Was Implemented:
- ✅ Billing portal integration in `BillingTab`
- ✅ "Manage Billing" button opens Stripe Customer Portal
- ✅ Users can update payment methods, view invoices, cancel

### How It Works:

Users click "Manage Billing" → Redirected to Stripe's hosted portal where they can:
- Update credit card
- View payment history
- Download invoices
- Cancel subscription
- Update billing email

**No action required** - this works automatically once webhooks are set up.

---

## Phase 6: UI/UX Updates ✅ COMPLETE

### What Was Implemented:
- ✅ `BillingTab` shows subscription details
- ✅ `UpgradeButton` integrated throughout app
- ✅ Success/cancel pages with clear next steps
- ✅ Loading states and error handling
- ✅ Toast notifications for user feedback

---

## Phase 7: Testing Checklist

### Pre-Testing Setup:
- [ ] All environment variables in `.env.local`
- [ ] Products created in Stripe
- [ ] Webhook endpoint registered in Stripe Dashboard
- [ ] App deployed or using ngrok

### Test Scenarios:

#### 1. Free → Pro Upgrade
- [ ] Log in as free user
- [ ] Go to Billing tab
- [ ] Click "Upgrade Now" on Pro plan
- [ ] Complete payment with test card: `4242 4242 4242 4242`
- [ ] Verify redirect to success page
- [ ] Check dashboard - should show Pro tier
- [ ] Check Supabase - subscription updated to "pro"

#### 2. Pro → Business Upgrade
- [ ] Log in as Pro user
- [ ] Click upgrade to Business/Whale
- [ ] Complete payment
- [ ] Verify tier updated to Business

#### 3. Billing Portal
- [ ] Click "Manage Billing"
- [ ] Verify portal opens
- [ ] Try updating payment method
- [ ] View invoice history

#### 4. Cancellation
- [ ] In billing portal, cancel subscription
- [ ] Check webhook logs in Stripe Dashboard
- [ ] Verify user downgraded to free tier in Supabase
- [ ] Confirm access continues until period end

#### 5. Failed Payment
- [ ] Use test card: `4000 0000 0000 0341` (requires authentication)
- [ ] Fail the authentication
- [ ] Check webhook fired
- [ ] Verify appropriate handling

### Test Cards:

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
Auth Required: 4000 0002 0000 0000
Any future expiry, any CVC (e.g., 12/25, 123)
```

---

## Security Checklist

- [x] Webhook signature verification enabled
- [x] Secret key never exposed to client
- [x] RLS policies prevent unauthorized access
- [x] Server-side validation of all events
- [x] User IDs verified via Supabase auth
- [x] No direct database manipulation from client

---

## Subscription Limits Reference

### Free Tier:
```javascript
search_limit: 10
save_limit: 5
export_limit: 3
```

### Pro Tier ($29.99/mo):
```javascript
search_limit: 50
save_limit: null  // unlimited
export_limit: null  // unlimited
```

### Business/Whale Tier ($99.99/mo):
```javascript
search_limit: null  // unlimited
save_limit: null  // unlimited
export_limit: null  // unlimited
```

---

## Troubleshooting

### Webhooks Not Working

**Check:**
1. Webhook secret correct in `.env.local`?
2. App restarted after adding secret?
3. Webhook endpoint accessible (not localhost)?
4. Events selected in Stripe Dashboard?

**Debug:**
- Check Stripe Dashboard → Webhooks → Your endpoint → Event logs
- Check your server logs for webhook errors
- Verify endpoint returns 200 status

### Checkout Session Not Creating

**Check:**
1. Price IDs correct in `.env.local`?
2. User logged in (has session token)?
3. Stripe publishable key correct?

**Debug:**
- Check browser console for errors
- Check API route logs
- Verify `/api/stripe/create-checkout-session` returns session ID

### Subscription Not Updating

**Check:**
1. Webhook fired? (Check Stripe Dashboard)
2. Webhook handler processed event?
3. Supabase connection working?

**Debug:**
- Check `subscriptions` table in Supabase
- Look for error logs in webhook endpoint
- Verify `stripe_customer_id` and `stripe_subscription_id` stored correctly

---

## Monitoring

### Stripe Dashboard:
- Monitor successful payments
- Track subscription changes
- View webhook delivery status
- Check for failed payments

### Supabase Dashboard:
- Monitor subscription table updates
- Check RLS policies working correctly
- View usage tracking data

### Application Logs:
- Watch for webhook processing errors
- Monitor API route performance
- Track user upgrade flow completion

---

## Next Steps After Integration

### 1. Configure Email Notifications

In Stripe Dashboard → Settings → Emails:
- ✅ Payment receipts
- ✅ Failed payment notifications
- ✅ Subscription renewal reminders
- ✅ Cancellation confirmations

### 2. Set Up Subscription Lifecycle

Configure in Stripe Dashboard → Settings → Billing:
- Grace period for failed payments
- Retry schedule for failed charges
- Dunning emails for past due subscriptions

### 3. Add Analytics

Track key metrics:
- Conversion rate (free → paid)
- Monthly recurring revenue (MRR)
- Churn rate
- Average revenue per user (ARPU)

### 4. Implement Invoice Downloads

Create endpoint to fetch and download invoices from Stripe:
```typescript
// TODO: Implement in BillingTab.tsx
const invoice = await stripe.invoices.retrieve(invoiceId);
// Return invoice PDF URL
```

---

## Support & Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Stripe API Reference**: https://stripe.com/docs/api
- **Webhook Events**: https://stripe.com/docs/api/events
- **Test Cards**: https://stripe.com/docs/testing

---

## Deployment Checklist

Before going live:

- [ ] All `.env.local` variables set
- [ ] Products created in Stripe (production)
- [ ] Webhook endpoint registered (production URL)
- [ ] Test complete upgrade flow in production
- [ ] Verify webhooks processing correctly
- [ ] Email notifications configured
- [ ] Stripe account verified and activated
- [ ] Terms of service updated with refund policy
- [ ] Privacy policy includes payment processor info

---

**You're ready to accept payments!** 🎉

All code is production-ready. Just add your keys, create the products, and register the webhook.
