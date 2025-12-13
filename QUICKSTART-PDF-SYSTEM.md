# Quick Start: PDF Report System

## 🚀 Get Started in 3 Steps

### Step 1: Install Packages
```bash
npm install
```

This installs:
- `puppeteer` (PDF generation)
- `resend` (Email delivery)

### Step 2: Set Up SendGrid

Since you already have SendGrid:

1. Go to https://app.sendgrid.com
2. Navigate to Settings → API Keys
3. Create or use existing API key with "Mail Send" permissions
4. Copy your API key (starts with `SG.`)
5. Add to `.env.local`:
```bash
SENDGRID_API_KEY=SG.your_api_key_here
```

6. Verify sender email:
   - Settings → Sender Authentication
   - Add `reports@delawarezoning.com` as verified sender

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

### Using SendGrid (You Already Have This!)

Just add your API key to `.env.local`:
```bash
SENDGRID_API_KEY=SG.your_existing_key
```

Make sure `reports@delawarezoning.com` is verified as a sender in SendGrid dashboard.

## 🐛 Troubleshooting

**PDF generation fails?**
- Make sure `npm install` completed successfully
- Check server has enough memory (512MB+)
- Verify zoning data exists: Query database for lat/lon

**Email not received?**
- Check SendGrid dashboard → Activity
- Verify SENDGRID_API_KEY is set correctly
- Check `reports@delawarezoning.com` is verified sender
- Check customer's spam folder

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
