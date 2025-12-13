# Production Deployment Guide - Delaware Zoning

**Last Updated:** December 13, 2024  
**Status:** Ready for Production Deployment  
**Estimated Time:** 2-3 hours

---

## 📋 PRE-DEPLOYMENT CHECKLIST

### Phase 1: Code Preparation (30 minutes)

- [x] All security middleware implemented
- [x] Authentication with JWT validation complete
- [x] Rate limiting configured
- [x] Input sanitization added
- [x] Environment variable validation with envalid
- [x] Security headers in next.config.js
- [x] Sentry error tracking configured
- [x] Google Analytics integration complete
- [x] Structured logging with Pino
- [x] Cookie consent banner added
- [x] Data disclaimers on all zoning displays
- [x] Terms of Service complete
- [x] Privacy Policy (GDPR/CCPA compliant)
- [x] Usage limit enforcement in search API
- [ ] All console.log replaced with logger (verify)
- [ ] No sensitive data in code
- [ ] .env.local not committed to git

### Phase 2: Dependencies Verification

```bash
# Verify all production dependencies are installed
npm install

# Check for security vulnerabilities
npm audit

# If vulnerabilities found:
npm audit fix

# Build test
npm run build

# Should complete without errors
```

---

## 🔧 ENVIRONMENT SETUP

### Step 1: Create Production Environment File

Create `.env.production` with the following variables:

```bash
# ============================================================================
# PRODUCTION ENVIRONMENT VARIABLES
# ============================================================================

# Base URL
NEXT_PUBLIC_BASE_URL=https://yourdomain.com
NODE_ENV=production

# ============================================================================
# SUPABASE (Production)
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key

# ============================================================================
# GOOGLE PLACES API (Production)
# ============================================================================
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_production_google_key

# ============================================================================
# STRIPE (LIVE MODE - Production)
# ============================================================================
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
STRIPE_WEBHOOK_SECRET=whsec_production_secret

# Stripe Product Price IDs (Live Mode)
STRIPE_PRICE_LOOKER=price_live_looker
STRIPE_PRICE_PRO=price_live_pro
STRIPE_PRICE_WHALE=price_live_whale

# ============================================================================
# MONITORING & ANALYTICS
# ============================================================================
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX

# ============================================================================
# RATE LIMITING (Upstash Redis)
# ============================================================================
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

### Step 2: Supabase Production Setup

1. **Verify Database Migration**
   ```sql
   -- Run in Supabase SQL Editor
   
   -- 1. Verify all tables exist
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   
   -- Should show:
   -- profiles, subscriptions, saved_properties, search_history,
   -- usage_tracking, zoning_districts, permitted_uses,
   -- dimensional_standards, permits_required
   
   -- 2. Verify real data loaded (NO mock data)
   SELECT COUNT(*) as total_zones,
          SUM(CASE WHEN is_mock = true THEN 1 ELSE 0 END) as mock_zones
   FROM zoning_districts;
   
   -- mock_zones should be 0
   
   -- 3. Check RLS policies
   SELECT schemaname, tablename, policyname
   FROM pg_policies
   WHERE schemaname = 'public';
   ```

2. **Enable Point-in-Time Recovery**
   - Go to Database → Backups
   - Enable PITR
   - Set retention to 7 days minimum

3. **Configure Connection Pooling**
   - Go to Database → Settings
   - Enable connection pooling
   - Set pool size to 15-20

### Step 3: Stripe Production Setup

1. **Switch to Live Mode** in Stripe Dashboard

2. **Create 3 Products** (if not already created):
   
   **Product 1: The Looker (Free)**
   ```bash
   stripe products create \
     --name "The Looker" \
     --description "Free tier with basic zoning information"
   
   stripe prices create \
     --product prod_XXXXX \
     --unit-amount 0 \
     --currency usd \
     --recurring interval=month
   
   # Copy Price ID → STRIPE_PRICE_LOOKER
   ```
   
   **Product 2: The Pro ($49/month)**
   ```bash
   stripe products create \
     --name "The Pro" \
     --description "Professional zoning insights with dimensional standards"
   
   stripe prices create \
     --product prod_XXXXX \
     --unit-amount 4900 \
     --currency usd \
     --recurring interval=month
   
   # Copy Price ID → STRIPE_PRICE_PRO
   ```
   
   **Product 3: The Whale ($129/month)**
   ```bash
   stripe products create \
     --name "The Whale" \
     --description "Enterprise-grade access with permits and direct contacts"
   
   stripe prices create \
     --product prod_XXXXX \
     --unit-amount 12900 \
     --currency usd \
     --recurring interval=month
   
   # Copy Price ID → STRIPE_PRICE_WHALE
   ```

3. **Configure Production Webhook**
   - Go to Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/stripe/webhook`
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
   - Copy signing secret → `STRIPE_WEBHOOK_SECRET`

4. **Enable Stripe Radar** (fraud detection)
   - Go to Radar → Settings
   - Enable default rules
   - Set 3D Secure for high-risk transactions

### Step 4: Google Places API Production

1. **Restrict API Key**
   - Go to Google Cloud Console → Credentials
   - Edit API key
   - Application restrictions:
     - HTTP referrers
     - Add: `yourdomain.com/*`
     - Add: `*.yourdomain.com/*`
   - API restrictions:
     - Places API ✓
     - Geocoding API ✓
     - Maps JavaScript API ✓

2. **Set Billing Alerts**
   - Go to Billing → Budgets & Alerts
   - Create budget: $100/month
   - Alert at 50%, 90%, 100%

### Step 5: Monitoring Setup

**Sentry**
1. Create Sentry account at sentry.io
2. Create new project: "Delaware Zoning"
3. Copy DSN → `NEXT_PUBLIC_SENTRY_DSN`
4. Configure alerts:
   - Email on new issue
   - Slack integration (optional)
   - Set error threshold: 10 errors in 1 hour

**Google Analytics 4**
1. Create GA4 property
2. Add data stream for your website
3. Copy Measurement ID (G-XXXXXXXXXX) → `NEXT_PUBLIC_GA_TRACKING_ID`

**Upstash Redis** (Rate Limiting)
1. Create free account at upstash.com
2. Create database (US East region recommended)
3. Copy REST URL and token to env vars

---

## 🚀 DEPLOYMENT TO NETLIFY

### Option 1: Connect GitHub Repository (Recommended)

1. **Push Code to GitHub**
   ```bash
   git add .
   git commit -m "Production deployment ready"
   git push origin main
   ```

2. **Connect to Netlify**
   - Log in to Netlify
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select repository: `delaware-zoning`
   - Configure build settings:
     ```
     Build command: npm run build
     Publish directory: .next
     ```

3. **Add Environment Variables**
   - Go to Site settings → Environment variables
   - Add ALL variables from `.env.production`
   - **IMPORTANT:** Use production values, not development!

4. **Configure Domain**
   - Go to Domain management
   - Add custom domain: `yourdomain.com`
   - Configure DNS:
     ```
     Type: A
     Name: @
     Value: 75.2.60.5 (Netlify's load balancer)
     
     Type: CNAME
     Name: www
     Value: yourdomain.netlify.app
     ```
   - SSL certificate will auto-provision (5-10 minutes)

5. **Deploy**
   - Click "Deploy site"
   - Monitor build logs
   - Should complete in 3-5 minutes

### Option 2: Deploy via Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Deploy to production
netlify deploy --prod

# Follow prompts to configure
```

---

## ✅ POST-DEPLOYMENT VERIFICATION

### Critical Tests (Complete within 30 minutes of deployment)

1. **Homepage Loading**
   ```bash
   curl -I https://yourdomain.com
   # Should return 200 OK
   ```

2. **API Health Check**
   ```bash
   curl https://yourdomain.com/api/test-connection
   # Should return JSON with success: true
   ```

3. **Authentication Flow**
   - Visit https://yourdomain.com/signup
   - Create test account
   - Verify email (if implemented)
   - Log in successfully
   - Check dashboard loads

4. **Search Functionality**
   - Search for test address
   - Verify results display
   - Check data disclaimer shows
   - Save property (if logged in)

5. **Subscription Flow**
   - Click "Upgrade" in dashboard
   - Complete checkout with test card:
     ```
     Card: 4242 4242 4242 4242
     Expiry: 12/34
     CVC: 123
     ZIP: 19801
     ```
   - Verify redirected to success page
   - Check subscription active in dashboard
   - Verify webhook received in Stripe dashboard

6. **Stripe Customer Portal**
   - Go to Dashboard → Billing
   - Click "Manage Billing"
   - Should open Stripe portal
   - Verify can view subscription

7. **Error Monitoring**
   - Check Sentry dashboard
   - Verify events are being received
   - Trigger test error (optional)

8. **Analytics**
   - Check Google Analytics Real-Time
   - Verify pageviews being tracked

9. **Security Headers**
   ```bash
   curl -I https://yourdomain.com | grep -i "x-frame-options\|strict-transport"
   # Should show security headers
   ```

10. **SSL Certificate**
    ```bash
    curl -vI https://yourdomain.com 2>&1 | grep "SSL certificate"
    # Should show valid certificate
    ```

---

## 📊 MONITORING SETUP

### UptimeRobot Configuration

1. Create free account at uptimerobot.com
2. Add monitors:

   **Monitor 1: Homepage**
   - Type: HTTP(s)
   - URL: https://yourdomain.com
   - Interval: 5 minutes
   - Alert: After 5 minutes down

   **Monitor 2: API Health**
   - Type: HTTP(s)
   - URL: https://yourdomain.com/api/test-connection
   - Keyword: "success"
   - Interval: 5 minutes

   **Monitor 3: Search API**
   - Type: HTTP(s)
   - URL: https://yourdomain.com/api/zoning/search?lat=39.7459&lon=-75.5466
   - Keyword: "zoning"
   - Interval: 15 minutes

   **Monitor 4: Stripe Webhook**
   - Type: HTTP(s)
   - URL: https://yourdomain.com/api/stripe/webhook
   - Method: POST
   - Interval: 15 minutes
   - Alert: After 15 minutes down

3. Configure alerts:
   - Email notifications
   - SMS (optional, paid feature)
   - Slack webhook (optional)

### Performance Monitoring

**Lighthouse CI** (optional but recommended)
```bash
# Install
npm install -g @lhci/cli

# Run audit
lhci autorun --collect.url=https://yourdomain.com

# Target scores:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 95+
```

---

## 🚨 EMERGENCY ROLLBACK PROCEDURE

If critical issues are discovered:

### Method 1: Netlify Rollback
1. Go to Netlify dashboard
2. Click "Deploys"
3. Find previous working deploy
4. Click "⋯" → "Publish deploy"
5. Previous version will be live in <1 minute

### Method 2: Git Revert
```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Netlify will auto-deploy reverted version
```

### Method 3: Environment Variable Fix
- If issue is env-var related
- Go to Site settings → Environment variables
- Fix incorrect variable
- Click "Trigger deploy"

---

## 📝 POST-LAUNCH 48-HOUR MONITORING

### Hour 0-2: Critical Monitoring
- [ ] Check Sentry every 30 minutes for errors
- [ ] Monitor Stripe webhook deliveries
- [ ] Watch UptimeRobot for downtime
- [ ] Review GA4 real-time for user activity

### Hour 2-12: Active Monitoring
- [ ] Check Sentry every 2 hours
- [ ] Review first user signups
- [ ] Check for support emails
- [ ] Monitor subscription conversions

### Hour 12-48: Standard Monitoring
- [ ] Daily Sentry review
- [ ] Daily subscription report
- [ ] Daily user growth tracking
- [ ] Check uptime status

### Key Metrics to Track
```
Day 1 Targets:
- Uptime: 99.5%+
- Error rate: <0.1%
- Page load: <2s (p95)
- Signups: 5-10
- Conversions: 1-2

Week 1 Targets:
- Uptime: 99.9%+
- Error rate: <0.05%
- Signups: 25-50
- Conversions: 5-10
- MRR: $250-500
```

---

## 📞 SUPPORT SETUP

### Create Support Email
- Set up: support@delawarezoning.com
- Forward to your primary email
- Set up auto-responder:
  ```
  Thank you for contacting Delaware Zoning. 
  We've received your message and will respond within 24 hours.
  
  For urgent issues, please include "URGENT" in the subject line.
  ```

### Response Templates
**Billing Issue:**
```
Hello [Name],

Thank you for reaching out about your billing concern. I've reviewed your account 
and [specific resolution]. Your [refund/credit/update] will be processed within 
2-3 business days.

If you have any other questions, please don't hesitate to ask.

Best regards,
Delaware Zoning Support Team
```

**Data Accuracy Question:**
```
Hello [Name],

Thank you for bringing this to our attention. Please note that our zoning 
information is for reference purposes only and should always be verified with 
the local zoning office before making any property decisions.

For official verification, we recommend contacting:
[Local Zoning Office Contact Information]

Best regards,
Delaware Zoning Support Team
```

---

## 🎯 SUCCESS CRITERIA

### Technical
- ✅ Site loads in <2 seconds
- ✅ 99.5%+ uptime
- ✅ Zero critical errors
- ✅ All APIs functional
- ✅ Payments processing successfully
- ✅ Monitoring active

### Business
- ✅ 10+ signups in first 24 hours
- ✅ 1+ conversion in first week
- ✅ <5% support ticket rate
- ✅ <3% churn rate first month

### Legal/Compliance
- ✅ Terms of Service published
- ✅ Privacy Policy published
- ✅ Cookie consent banner active
- ✅ Data disclaimers visible
- ✅ GDPR/CCPA compliant

---

## 📚 ADDITIONAL RESOURCES

- [Netlify Documentation](https://docs.netlify.com/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Supabase Production Checklist](https://supabase.com/docs/guides/platform/going-into-prod)
- [Stripe Production Checklist](https://stripe.com/docs/security/guide)
- [Google Places API Best Practices](https://developers.google.com/maps/documentation/places/web-service/best-practices)

---

**READY TO DEPLOY?** ✅

Once all checklist items are complete, you're ready for production!

**Final Command:**
```bash
git add .
git commit -m "Production deployment - all systems go"
git push origin main
```

Then monitor closely for the first 48 hours. Good luck! 🚀

