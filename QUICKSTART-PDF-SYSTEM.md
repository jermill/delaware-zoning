# Quick Start: PDF Report System

## 🚀 Get Started in 3 Steps

### Step 1: Install Packages
```bash
npm install
```

This installs:
- `puppeteer` (PDF generation)
- `resend` (Email delivery)

### Step 2: Set Up Resend

1. Go to https://resend.com
2. Sign up for free account (100 emails/day)
3. Get your API key (starts with `re_`)
4. Add to `.env.local`:
```bash
RESEND_API_KEY=re_your_api_key_here
```

### Step 3: Run Database Migration

In Supabase SQL Editor, run:
```sql
-- Copy all content from supabase/14-single-report-purchases.sql
-- Paste and execute
```

## ✅ You're Done!

The system is now ready. When customers buy a single report:
1. They pay $39 via Stripe
2. PDF is auto-generated with comprehensive zoning info
3. Email is auto-sent with PDF attachment
4. Everything is tracked in the database

## 🧪 Testing

### Test PDF Generation (No Payment)
```bash
# Open in browser:
http://localhost:3000/api/test/generate-report?lat=39.7459&lon=-75.5466&address=10%20E%2010th%20St,%20Wilmington,%20DE

# Downloads a test PDF instantly
```

### Test Full Purchase Flow
1. Go to homepage
2. Scroll to "Buy Single Report"
3. Click button → enter address
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete checkout
6. Check terminal for webhook logs
7. Check Resend dashboard for email delivery

## 📧 Email Configuration

### Development (Using Resend Test Domain)
Works immediately - emails sent from `onboarding@resend.dev`

### Production (Custom Domain)
1. Go to Resend dashboard → Domains
2. Add `delawarezoning.com`
3. Add DNS records they provide
4. Wait for verification (usually < 1 hour)
5. Emails now sent from `reports@delawarezoning.com`

## 🐛 Troubleshooting

**PDF generation fails?**
- Make sure `npm install` completed successfully
- Check server has enough memory (512MB+)
- Verify zoning data exists: Query database for lat/lon

**Email not received?**
- Check Resend dashboard → Logs
- Verify RESEND_API_KEY is set correctly
- Check customer's spam folder
- Verify domain in production

**Webhook not working?**
- Test locally: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
- Check Stripe dashboard → Developers → Webhooks
- Verify STRIPE_WEBHOOK_SECRET is correct

## 📊 Monitoring

View purchase stats:
```sql
SELECT * FROM single_report_stats ORDER BY report_date DESC;
```

Check recent purchases:
```sql
SELECT 
  property_address,
  customer_email,
  pdf_generated,
  pdf_sent,
  created_at
FROM single_report_purchases 
ORDER BY created_at DESC 
LIMIT 10;
```

## 💰 Revenue Tracking

View total revenue:
```sql
SELECT 
  COUNT(*) as total_reports,
  SUM(amount_paid) / 100.0 as total_revenue_usd,
  COUNT(DISTINCT customer_email) as unique_customers
FROM single_report_purchases;
```

## 🎉 That's It!

Your single report purchase system is fully functional and production-ready!
