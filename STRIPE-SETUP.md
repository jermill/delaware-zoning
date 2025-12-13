# Stripe Payment Integration Setup Guide

## 1. Create Stripe Account

1. Go to [https://stripe.com](https://stripe.com)
2. Sign up for a Stripe account
3. Complete your account verification

## 2. Get API Keys

### Test Mode Keys (for development)
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Toggle to **Test Mode** (switch in left sidebar)
3. Go to **Developers** → **API Keys**
4. Copy:
   - **Publishable key** (starts with `pk_test_`)
   - **Secret key** (starts with `sk_test_`)

### Live Mode Keys (for production)
- Follow same steps but in **Live Mode**
- Keys will start with `pk_live_` and `sk_live_`

## 3. Create Products and Prices

### Via Stripe Dashboard:

1. Go to **Products** → **Add product**

2. **Create "The Looker" (Free Tier)**
   - Product name: `The Looker`
   - Description: `Basic zoning information for Delaware properties`
   - Pricing: **Free** (or $0.00/month)
   - Click **Save product**
   - Copy the **Price ID** (starts with `price_`)

3. **Create "The Pro" ($49/month)**
   - Product name: `The Pro`
   - Description: `Professional zoning insights with dimensional standards`
   - Pricing: **$49.00** / month (recurring)
   - Click **Save product**
   - Copy the **Price ID**

4. **Create "The Whale" ($129/month)**
   - Product name: `The Whale`
   - Description: `Enterprise-grade access with permits and direct contacts`
   - Pricing: **$129.00** / month (recurring)
   - Click **Save product**
   - Copy the **Price ID**

### Via Stripe CLI (Alternative):

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Create products
stripe products create --name="The Looker" --description="Basic zoning information"
stripe prices create --product=prod_XXX --unit-amount=0 --currency=usd --recurring[interval]=month

stripe products create --name="The Pro" --description="Professional zoning insights"
stripe prices create --product=prod_XXX --unit-amount=4900 --currency=usd --recurring[interval]=month

stripe products create --name="The Whale" --description="Enterprise-grade access"
stripe prices create --product=prod_XXX --unit-amount=12900 --currency=usd --recurring[interval]=month
```

## 4. Set Up Webhook

Webhooks allow Stripe to notify your app when subscription events occur (payment success, cancellation, etc.)

### Local Development (using Stripe CLI):

1. Install [Stripe CLI](https://stripe.com/docs/stripe-cli)

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. Copy the **webhook signing secret** (starts with `whsec_`)

### Production (via Dashboard):

1. Go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Click **Add endpoint**
6. Copy the **Signing secret**

## 5. Add Environment Variables

Add these to your `.env.local` file:

```bash
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Stripe Price IDs (from step 3)
STRIPE_PRICE_LOOKER=price_xxxxx    # Free tier
STRIPE_PRICE_PRO=price_xxxxx       # $49/month
STRIPE_PRICE_WHALE=price_xxxxx     # $129/month
```

## 6. Test Your Integration

### Test Cards (in Test Mode):

**Successful payment:**
```
Card: 4242 4242 4242 4242
Expiry: Any future date (e.g., 12/34)
CVC: Any 3 digits (e.g., 123)
ZIP: Any 5 digits (e.g., 12345)
```

**Payment requires authentication:**
```
Card: 4000 0025 0000 3155
```

**Payment is declined:**
```
Card: 4000 0000 0000 9995
```

### Test Flow:

1. Visit http://localhost:3000/pricing
2. Click "Subscribe" on The Pro plan
3. Enter test card details
4. Complete checkout
5. Verify redirect to dashboard
6. Check subscription status in dashboard

## 7. Subscription Flow

### User Journey:

1. **Browse Plans** → User visits `/pricing`
2. **Select Plan** → Clicks "Subscribe" button
3. **Stripe Checkout** → Redirected to Stripe-hosted checkout page
4. **Payment** → Enters payment details
5. **Webhook** → Stripe sends event to `/api/stripe/webhook`
6. **Database Update** → Subscription record updated in Supabase
7. **Success** → User redirected to dashboard with new tier access

### Webhook Events Handled:

- **`checkout.session.completed`** - Initial subscription created
- **`customer.subscription.updated`** - Plan upgraded/downgraded
- **`customer.subscription.deleted`** - Subscription cancelled
- **`invoice.payment_succeeded`** - Recurring payment successful
- **`invoice.payment_failed`** - Payment failed

## 8. Customer Portal

The Customer Portal allows users to:
- View current subscription
- Update payment method
- Upgrade/downgrade plans
- Cancel subscription
- View billing history

Access via **Billing** tab in dashboard → "Manage Subscription" button

## 9. Security Best Practices

### ✅ Do:
- Always verify webhook signatures
- Use environment variables for API keys
- Never expose secret keys in frontend code
- Use HTTPS in production
- Implement rate limiting on checkout endpoints

### ❌ Don't:
- Commit API keys to version control
- Trust client-side data for subscription status
- Skip webhook signature verification
- Use live keys in development

## 10. Going Live Checklist

- [ ] Switch to Live Mode API keys
- [ ] Create live products and prices
- [ ] Update environment variables with live keys
- [ ] Configure production webhook endpoint
- [ ] Test with real (small) transactions
- [ ] Set up email notifications (Stripe handles this)
- [ ] Configure subscription emails in Stripe Dashboard
- [ ] Add business information in Stripe settings
- [ ] Connect bank account for payouts
- [ ] Review and activate live mode

## 11. Monitoring

### Stripe Dashboard:
- **Home** - Quick overview of revenue and activity
- **Payments** - All successful and failed payments
- **Customers** - Customer list with subscription status
- **Subscriptions** - Active, past_due, and cancelled subscriptions
- **Logs** - API request logs and webhook deliveries

### Recommended Alerts:
- Failed payment attempts
- Subscription cancellations
- High volume of declined cards
- Webhook delivery failures

## 12. Pricing Strategy

Current tiers:

| Tier | Price | Target User |
|------|-------|-------------|
| **The Looker** | Free | Casual users, trial |
| **The Pro** | $49/mo | Professional realtors |
| **The Whale** | $129/mo | Developers, architects, firms |

Consider:
- Annual billing with discount (e.g., 2 months free)
- Team/business tier for multiple users
- Pay-per-search option for occasional users
- Enterprise custom pricing

## Files Created

- `/api/stripe/create-checkout-session.ts` - Create Stripe Checkout
- `/api/stripe/webhook.ts` - Handle Stripe webhooks
- `/api/stripe/create-portal-session.ts` - Customer portal access
- Updated `/pages/pricing.tsx` - Checkout buttons
- Updated `/components/dashboard/BillingTab.tsx` - Manage subscription

## Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Testing](https://stripe.com/docs/testing)
- [Stripe CLI](https://stripe.com/docs/stripe-cli)
- [Webhook Guide](https://stripe.com/docs/webhooks)
- [Subscription Lifecycle](https://stripe.com/docs/billing/subscriptions/overview)

---

**Status:** Ready to implement
**Next:** Add Stripe keys to `.env.local` and start testing


