# 🚀 Deploy Delaware Zoning to Netlify - RIGHT NOW!

**Status:** ✅ Build tested locally - READY TO DEPLOY  
**Time Required:** 10-15 minutes

---

## 📋 Prerequisites Checklist

✅ Local build successful (`npm run build` passed)  
✅ 1,062 real zoning districts loaded  
✅ hCaptcha keys configured  
✅ Stripe products created in LIVE MODE  
✅ All environment variables in .env.local  

**YOU'RE READY!** 🎉

---

## 🚀 STEP-BY-STEP DEPLOYMENT

### Step 1: Push to GitHub (2 minutes)

```bash
# Make sure you're in the project directory
cd /Volumes/jermill/APPS/delaware-zoning

# Check git status
git status

# Add all files
git add .

# Commit
git commit -m "Production ready - real data, hCaptcha, Stripe configured"

# Push to main branch
git push origin main
```

---

### Step 2: Connect to Netlify (3 minutes)

1. **Go to:** https://app.netlify.com
2. **Click:** "Add new site" → "Import an existing project"
3. **Connect to GitHub:**
   - Click "GitHub"
   - Authorize Netlify if prompted
   - Select your repository: `delaware-zoning`
4. **Configure build settings:**
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - Click "Show advanced" → Click "New variable"

---

### Step 3: Add Environment Variables (5 minutes)

**CRITICAL:** Add ALL these environment variables in Netlify:

Click "Add environment variable" for each one:

#### Supabase (3 variables)
```
NEXT_PUBLIC_SUPABASE_URL = [your supabase url]
NEXT_PUBLIC_SUPABASE_ANON_KEY = [your anon key]
SUPABASE_SERVICE_ROLE_KEY = [your service role key]
```

#### hCaptcha (2 variables)
```
NEXT_PUBLIC_HCAPTCHA_SITE_KEY = [your hcaptcha site key]
HCAPTCHA_SECRET_KEY = [your hcaptcha secret key]
```

#### Google Places (1 variable)
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY = [your google api key]
```

#### Stripe (8 variables)
```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = [your stripe publishable key pk_live_...]
STRIPE_SECRET_KEY = [your stripe secret key sk_live_...]
STRIPE_PRICE_LOOKER = price_1SdbN9FCgX2xIDAtZUn9c2qY
STRIPE_PRICE_PRO = price_1SdbN9FCgX2xIDAtxRQw6jx8
STRIPE_PRICE_WHALE = price_1SdbNAFCgX2xIDAtCWnMB4U7
STRIPE_WEBHOOK_SECRET = [leave empty for now - add after webhook creation]
```

#### Base URL (1 variable)
```
NEXT_PUBLIC_BASE_URL = https://your-site-name.netlify.app
```

*Note: You'll get the exact URL after deployment, then you can update this*

#### Optional - Monitoring (4 variables)
```
NEXT_PUBLIC_SENTRY_DSN = [if you have sentry]
NEXT_PUBLIC_GA_TRACKING_ID = [if you have GA4]
UPSTASH_REDIS_REST_URL = [if you have upstash]
UPSTASH_REDIS_REST_TOKEN = [if you have upstash]
```

---

### Step 4: Deploy! (1 click)

1. Click **"Deploy site"** button
2. Watch the build log (takes 2-3 minutes)
3. Wait for "Published" status
4. You'll get a URL like: `https://your-site-name.netlify.app`

---

### Step 5: Configure Custom Domain (Optional - 5 minutes)

If you have a domain ready:

1. In Netlify dashboard → Click "Domain settings"
2. Click "Add custom domain"
3. Enter your domain (e.g., `delawarezoning.com`)
4. Follow DNS instructions:
   - Add CNAME record or A record
   - Wait for DNS propagation (5-30 minutes)
5. Enable HTTPS (automatic via Let's Encrypt)

---

### Step 6: Create Stripe Webhook (CRITICAL - 5 minutes)

**After your site is deployed:**

1. **Note your deployed URL:** `https://your-site-name.netlify.app`

2. **Go to:** https://dashboard.stripe.com/webhooks

3. **Click:** "Add endpoint"

4. **Endpoint URL:** `https://your-site-name.netlify.app/api/stripe/webhook`

5. **Select events to listen to:**
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`

6. **Click:** "Add endpoint"

7. **Copy the "Signing secret"** (starts with `whsec_...`)

8. **Update Netlify environment variables:**
   - Go back to Netlify → Site settings → Environment variables
   - Find `STRIPE_WEBHOOK_SECRET`
   - Paste the signing secret you just copied
   - Click "Save"

9. **Trigger a redeploy:**
   - Deploys → Trigger deploy → Deploy site

---

## ✅ POST-DEPLOYMENT CHECKLIST

After your site is live, test these:

### Critical Tests:
- [ ] Visit your site URL
- [ ] Homepage loads correctly
- [ ] Sign up for a new account
- [ ] Verify you receive hCaptcha challenge
- [ ] Log in with new account
- [ ] Search for a property (try: "123 Market St, Wilmington, DE")
- [ ] View zoning results
- [ ] Save a property to dashboard
- [ ] View saved properties in dashboard
- [ ] Click "Upgrade" button
- [ ] Complete Stripe checkout with test card: `4242 4242 4242 4242`
- [ ] Verify Pro tier activated
- [ ] Test "Manage Billing" link (goes to Stripe portal)

### Browser Tests:
- [ ] Test on Chrome
- [ ] Test on Safari
- [ ] Test on mobile (responsive design)

### API Tests:
- [ ] Check `/api/test-connection` endpoint
- [ ] Verify search API works
- [ ] Test Stripe webhook received (make a test payment)

---

## 📊 Monitoring Your Launch

### Immediate Monitoring:

1. **Netlify Dashboard**
   - Watch deploy logs
   - Monitor function logs
   - Check bandwidth usage

2. **Stripe Dashboard**
   - Watch for webhook deliveries
   - Monitor successful charges
   - Check for failed payments

3. **Supabase Dashboard**
   - Monitor database queries
   - Check for new user signups
   - Verify search tracking

---

## 🚨 Common Issues & Solutions

### Issue 1: "Module not found" errors
**Solution:** Make sure all dependencies are in `package.json`, not just `devDependencies`

### Issue 2: Environment variables not working
**Solution:** 
- Double-check all env vars in Netlify dashboard
- Trigger a redeploy after adding/updating vars
- Make sure there are no extra spaces

### Issue 3: Stripe webhooks failing
**Solution:**
- Verify webhook URL is exactly: `https://your-domain.com/api/stripe/webhook`
- Check webhook signing secret matches Netlify env var
- Look at webhook delivery logs in Stripe dashboard

### Issue 4: hCaptcha not showing
**Solution:**
- Verify `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` is correct
- Check browser console for errors
- Try in incognito mode (browser extensions can block it)

### Issue 5: Build fails on Netlify
**Solution:**
- Check build logs for specific error
- Verify Node.js version (should be 18 or higher)
- Make sure all env vars are set

---

## 🎉 YOU'RE LIVE!

Once deployed and tested, you have:

✅ **1,062 REAL Delaware zoning districts**  
✅ **Bot protection with hCaptcha**  
✅ **Stripe payments in LIVE MODE**  
✅ **Professional UI/UX**  
✅ **Responsive design**  
✅ **SSL/HTTPS enabled**  
✅ **SEO-optimized with sitemap**  

---

## 📈 Next Steps After Launch

1. **Set up monitoring** (UptimeRobot - 15 min)
2. **Submit sitemap** to Google Search Console
3. **Start marketing** (social media, local groups)
4. **Contact Kent County GIS** for complete coverage
5. **Monitor user feedback** and iterate

---

## 🆘 Need Help?

**If deployment fails:**
1. Check Netlify deploy logs
2. Verify all env vars are set
3. Test build locally again: `npm run build`
4. Check this file for common issues above

**If site is slow:**
1. Enable caching in Netlify
2. Optimize images
3. Check Supabase query performance

**If payments don't work:**
1. Verify Stripe webhook is set up
2. Check webhook delivery in Stripe dashboard
3. Verify webhook secret matches env var

---

**Ready to deploy? Let's go! 🚀**

Just follow the steps above and you'll be live in 15 minutes!

