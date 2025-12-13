# Environment Variables Setup

Copy this to your `.env.local` file and fill in your actual keys.

```bash
# ============================================================================
# SUPABASE CONFIGURATION
# ============================================================================
# Get these from: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# ============================================================================
# GOOGLE PLACES API
# ============================================================================
# Setup Instructions:
# 1. Go to: https://console.cloud.google.com/apis/credentials
# 2. Create a new project (or select existing)
# 3. Enable these APIs:
#    - Places API
#    - Geocoding API
#    - Maps JavaScript API
# 4. Create credentials → API Key
# 5. Add restrictions:
#    Application restrictions: HTTP referrers
#    - localhost:3000/*
#    - yourdomain.com/*
#    API restrictions: Select the 3 APIs above
# 6. Copy the API key below

NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIza...your_key_here

# ============================================================================
# HCAPTCHA SECURITY
# ============================================================================
# Setup Instructions:
# 1. Go to: https://www.hcaptcha.com/signup
# 2. Create a free account
# 3. Add a new site (enter your domain or localhost for testing)
# 4. Copy the Site Key (public, used in frontend)
# 5. Copy the Secret Key (private, used in server-side verification)
# Note: hCaptcha prevents bot signups and brute-force attacks

NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_hcaptcha_site_key_here
HCAPTCHA_SECRET_KEY=your_hcaptcha_secret_key_here

# ============================================================================
# STRIPE PAYMENT CONFIGURATION
# ============================================================================
# Setup Instructions:
# 1. Go to: https://dashboard.stripe.com/apikeys
# 2. Toggle to TEST MODE for development
# 3. Copy Publishable key (pk_test_...)
# 4. Reveal and copy Secret key (sk_test_...)
# 5. For production, repeat with LIVE MODE

# Stripe API Keys (TEST MODE for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# ============================================================================
# STRIPE WEBHOOK SECRET
# ============================================================================
# Development (using Stripe CLI):
# 1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
# 2. Run: stripe login
# 3. Run: stripe listen --forward-to localhost:3000/api/stripe/webhook
# 4. Copy the webhook signing secret (whsec_...)

# Production:
# 1. Go to: https://dashboard.stripe.com/webhooks
# 2. Add endpoint: https://yourdomain.com/api/stripe/webhook
# 3. Select events:
#    - checkout.session.completed
#    - customer.subscription.updated
#    - customer.subscription.deleted
#    - invoice.payment_succeeded
#    - invoice.payment_failed
# 4. Copy the signing secret

STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# ============================================================================
# STRIPE PRODUCT PRICE IDs
# ============================================================================
# Setup Instructions:
# 1. Go to: https://dashboard.stripe.com/products
# 2. Create 3 products:

# Product 1: "The Looker" (Free Tier)
# - Name: The Looker
# - Description: Basic zoning information for Delaware properties
# - Price: $0.00/month recurring (or leave as one-time)
# - Copy Price ID: price_xxxxx
STRIPE_PRICE_LOOKER=price_xxxxx

# Product 2: "The Pro" ($49/month)
# - Name: The Pro
# - Description: Professional zoning insights with dimensional standards
# - Price: $49.00/month recurring
# - Copy Price ID: price_xxxxx
STRIPE_PRICE_PRO=price_xxxxx

# Product 3: "The Whale" ($129/month)
# - Name: The Whale
# - Description: Enterprise-grade access with permits and direct contacts
# - Price: $129.00/month recurring
# - Copy Price ID: price_xxxxx
STRIPE_PRICE_WHALE=price_xxxxx

# ============================================================================
# OPTIONAL: APPLICATION SETTINGS
# ============================================================================
# These are optional and have defaults in the code

# Base URL (for redirects and webhooks)
# Development: http://localhost:3000
# Production: https://yourdomain.com
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Node environment
NODE_ENV=development
```

## Quick Start Checklist

### 1. Supabase (5 minutes)
- [ ] Create Supabase project
- [ ] Copy URL and keys
- [ ] Run SQL migrations (already provided)

### 2. Google Places API (10 minutes)
- [ ] Create Google Cloud project
- [ ] Enable 3 APIs
- [ ] Create API key with restrictions
- [ ] Copy key to .env.local

### 3. Stripe (15 minutes)
- [ ] Create Stripe account
- [ ] Get test API keys
- [ ] Create 3 products/prices
- [ ] Copy Price IDs
- [ ] Install Stripe CLI
- [ ] Start webhook forwarding
- [ ] Copy webhook secret

### 4. Test Everything (10 minutes)
- [ ] Restart Next.js dev server: `npm run dev`
- [ ] Test address autocomplete on homepage
- [ ] Test search functionality
- [ ] Test subscription checkout
- [ ] Verify webhook events

## Environment-Specific Notes

### Development (`.env.local`)
- Use Stripe TEST mode keys (`pk_test_`, `sk_test_`)
- Use Stripe CLI for webhooks
- Google Places unrestricted for localhost

### Production (hosting platform environment variables)
- Use Stripe LIVE mode keys (`pk_live_`, `sk_live_`)
- Configure production webhook endpoint
- Restrict Google Places to production domain
- Use HTTPS for all endpoints

## Security Reminders

- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Use different keys for development and production
- ✅ Restrict API keys by domain/IP
- ✅ Rotate keys if exposed
- ✅ Keep service role keys server-side only

## Testing Credentials

### Stripe Test Cards:
```
Success: 4242 4242 4242 4242
Requires authentication: 4000 0025 0000 3155
Declined: 4000 0000 0000 9995
Expiry: Any future date (12/34)
CVC: Any 3 digits (123)
ZIP: Any 5 digits (12345)
```

## Troubleshooting

### "Missing environment variable" error:
1. Check variable name matches exactly (case-sensitive)
2. Restart Next.js dev server after adding variables
3. Verify no trailing spaces in `.env.local`

### Google Places not working:
1. Verify all 3 APIs are enabled
2. Check API key restrictions allow localhost
3. Wait 1-2 minutes for key activation

### Stripe webhooks not receiving:
1. Check Stripe CLI is running: `stripe listen`
2. Verify webhook secret matches
3. Check endpoint is accessible

## Need Help?

- Supabase: https://supabase.com/docs
- Google Cloud: https://console.cloud.google.com/
- Stripe: https://dashboard.stripe.com/
- Issues: [Create GitHub issue or contact support]


