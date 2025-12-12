# 🚀 Delaware Zoning — Complete Build Blueprint (Updated)

## Executive Summary

**Timeline:** 6-8 weeks (MVP)  
**Cost:** $0-500/month (first year)  
**Tech Stack:** React + Next.js + Supabase + Stripe  
**Team:** 1-2 developers (you + optional contractor)  
**Hosting:** Netlify (free tier → $19/month at scale)  
**Owner:** Delaware Zoning LLC

---

## 📊 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Next.js)               │
│  - Address Search Bar                                       │
│  - Results Display (Zoning + Permitted Uses)                │
│  - PDF Export                                               │
│  - User Dashboard (saved properties)                        │
│  - Stripe checkout flow                                     │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS (Netlify)
                       ↓
┌─────────────────────────────────────────────────────────────┐
│          BACKEND (Next.js API Routes / Netlify Functions)   │
│  - Address lookup (Google Places API)                       │
│  - Zoning lookup (query Supabase)                           │
│  - PDF generation (jsPDF)                                   │
│  - Stripe webhook handlers                                 │
│  - Authentication (Supabase Auth)                          │
└──────────────────────┬──────────────────────────────────────┘
                       │ PostgreSQL
                       ↓
┌─────────────────────────────────────────────────────────────┐
│        DATABASE + AUTH (Supabase / PostgreSQL)              │
│  - zoning_districts (zone codes)                            │
│  - permitted_uses (allowed uses per zone)                   │
│  - dimensional_standards (setbacks, heights)                │
│  - users (auth)                                             │
│  - subscriptions (Stripe integration)                       │
│  - saved_properties (user's saved addresses)                │
│  - search_history (analytics)                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL SERVICES                              │
│  - Google Places API (address autocomplete)                 │
│  - OpenAI API (Phase 1.5: zone explanations)               │
│  - Stripe (payments)                                        │
│  - Netlify (hosting + serverless functions)                │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 User Flow Chart

```
┌─────────────────┐
│   User Lands    │
│   on Homepage   │
└────────┬────────┘
         │
         ▼
    ┌─────────────────────────┐
    │  Authenticated?         │
    └────┬────────────┬───────┘
         │ NO         │ YES
         ▼            ▼
    ┌─────────────┐  ┌──────────────────┐
    │  Sign Up /  │  │  Enter Address   │
    │  Log In     │  │  in Search Bar   │
    └────┬────────┘  └────────┬─────────┘
         │                    │
         └────┬───────────────┘
              ▼
         ┌─────────────────────┐
         │  Search Triggered   │
         │  (Address Query)    │
         └────────┬────────────┘
                  │
                  ▼
         ┌─────────────────────────────────┐
         │  API Route: /api/search.ts      │
         │  1. Get lat/lon (Google Places) │
         │  2. Query Supabase (zone lookup)│
         │  3. Return zoning data          │
         └────────┬────────────────────────┘
                  │
                  ▼
         ┌───────────────────────┐
         │  Display Results      │
         │  - Zone Code          │
         │  - Zone Name          │
         │  - Allowed Uses       │
         │  - Permit Checklist   │
         └────────┬──────────────┘
                  │
         ┌────────┴────────┬─────────────┐
         │                 │             │
         ▼                 ▼             ▼
    ┌─────────┐    ┌────────────┐  ┌──────────┐
    │  Save   │    │  Export    │  │ New      │
    │ Property│    │    PDF     │  │ Search   │
    └────┬────┘    └────┬───────┘  └──────────┘
         │              │
         ▼              ▼
    ┌────────────┐  ┌─────────────────────┐
    │  Saved in  │  │  Free User? Show    │
    │  Database  │  │  Upgrade Prompt     │
    └────────────┘  │                     │
                    │  Pro User? Allow    │
                    │  Export             │
                    └────────┬────────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  PDF Generated  │
                    │  & Downloaded   │
                    └─────────────────┘

┌──────────────────────────────────────────────┐
│         UPGRADE FLOW                         │
├──────────────────────────────────────────────┤
│ 1. Free User Clicks "Upgrade to Pro"        │
│ 2. Redirected to /pricing page              │
│ 3. Selects Pro Plan ($19 or $49/month)     │
│ 4. Stripe Checkout (securely)               │
│ 5. Stripe Webhook fires:                    │
│    - customer.subscription.created          │
│ 6. Supabase updated with subscription       │
│ 7. User redirected to dashboard             │
│ 8. Pro features now available               │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│         DASHBOARD FLOW (Authenticated)       │
├──────────────────────────────────────────────┤
│ 1. User Clicks "My Properties"              │
│ 2. Load /dashboard page (protected)          │
│ 3. Query Supabase: saved_properties          │
│    where user_id = current_user.id          │
│ 4. Display list of saved addresses          │
│ 5. User can:                                │
│    - Click to re-view zoning                │
│    - Export PDF (Pro only)                  │
│    - Delete property                        │
│    - View search history                    │
└──────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack Rationale

### Frontend: **React + Next.js (TypeScript)**

**Why:**
- You already know React
- Next.js handles API routes (no separate backend needed)
- Server-side rendering improves SEO (good for local search)
- Incremental static regeneration (ISR) keeps page fast
- Netlify deployment is seamless

**Alternatives considered:**
- ❌ Svelte: Smaller community, less documentation
- ❌ Vue: Overkill for this app
- ✅ Next.js: Perfect for full-stack SaaS

---

### Backend: **Next.js API Routes**

**Why:**
- No separate server to manage
- Runs on Netlify automatically
- Built-in authentication with Supabase
- Can call Supabase directly from routes
- Scales to millions of requests

**What you'll build:**
- `pages/api/search.ts` — address lookup + zoning query
- `pages/api/export-pdf.ts` — generate PDF report
- `pages/api/auth/callback.ts` — Supabase OAuth callback
- `pages/api/webhooks/stripe.ts` — Stripe payment webhooks

---

### Database: **Supabase (PostgreSQL)**

**Why:**
- PostgreSQL is industry-standard for relational data
- Supabase = Firebase-like DX with real SQL
- Built-in authentication (no Auth0 needed)
- Row-level security (RLS) for data privacy
- Free tier: 500 MB database + 2GB bandwidth
- Can scale without pain

**Cost:**
- Free tier: Perfect for MVP
- $25/month tier: 100 GB storage (scales up from there)

---

### Payments: **Stripe**

**Why:**
- Industry standard
- Handles subscriptions natively
- PCI compliant (no liability)
- Webhooks for subscription events
- Dashboard for refunds/disputes

**Cost:**
- 2.9% + $0.30 per transaction
- For $19/mo subscription: ~$0.85 per customer per month

---

### Hosting: **Netlify**

**Why:**
- Next.js compatible with Netlify Functions
- Automatic deployments from GitHub
- Built-in serverless functions (no server management)
- Generous free tier (300 free build minutes/month)
- $19/mo Pro plan for production
- Easy environment variable management
- Built-in form handling and redirects

**Cost:**
- Free tier: Good for MVP testing
- $19/mo: Production-ready with unlimited bandwidth
- Scales gracefully

**Netlify vs Vercel:**
- Both work great with Next.js
- Netlify is slightly cheaper ($19 vs $20)
- Netlify has better form handling
- Both have similar performance

---

## 📁 Project Structure

```
delaware-zoning/
├── public/
│   ├── logo.png
│   └── delaware-flag.svg
├── src/
│   ├── components/
│   │   ├── SearchBar.tsx          # Address input with autocomplete
│   │   ├── ZoningResult.tsx       # Display zone code + allowed uses
│   │   ├── PermitChecklist.tsx    # List of permits needed
│   │   ├── SavedProperties.tsx    # User dashboard
│   │   └── PaymentFlow.tsx        # Stripe checkout
│   ├── pages/
│   │   ├── index.tsx              # Homepage (search)
│   │   ├── dashboard.tsx          # User dashboard (protected)
│   │   ├── pricing.tsx            # Pricing page
│   │   ├── api/
│   │   │   ├── search.ts          # POST: search for zoning
│   │   │   ├── export-pdf.ts      # POST: generate PDF
│   │   │   ├── auth/
│   │   │   │   ├── login.ts       # POST: email/password login
│   │   │   │   ├── signup.ts      # POST: create account
│   │   │   │   └── callback.ts    # GET: OAuth callback
│   │   │   ├── webhooks/
│   │   │   │   └── stripe.ts      # POST: Stripe webhooks
│   │   │   └── subscriptions.ts   # GET: current user subscription
│   │   └── auth/
│   │       ├── login.tsx
│   │       └── signup.tsx
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client
│   │   ├── stripe.ts              # Stripe server helpers
│   │   ├── zoning.ts              # Zoning lookup logic
│   │   └── pdf.ts                 # PDF generation helpers
│   ├── types/
│   │   └── index.ts               # TypeScript types
│   └── styles/
│       ├── globals.css
│       └── components.module.css
├── .env.local                      # Secrets (NEVER commit)
├── netlify.toml                    # Netlify config
├── next.config.js
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🗄️ Supabase Database Schema (Complete SQL)

```sql
-- Enable PostGIS extension for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ========== ZONING DISTRICTS ==========
-- Stores all zoning codes (e.g., R-1, C-3, etc.)
CREATE TABLE zoning_districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  state TEXT DEFAULT 'DE',
  county TEXT NOT NULL,
  municipality TEXT NOT NULL,
  district_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  geom GEOMETRY(Polygon, 4326),  -- PostGIS geometry for area queries
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast zone code lookups
CREATE INDEX idx_zoning_districts_county ON zoning_districts(county);
CREATE INDEX idx_zoning_districts_code ON zoning_districts(district_code);
CREATE INDEX idx_zoning_districts_geometry ON zoning_districts USING GIST(geom);

-- ========== PERMITTED USES ==========
-- Maps what's allowed in each zone
CREATE TABLE permitted_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zoning_id UUID NOT NULL REFERENCES zoning_districts(id) ON DELETE CASCADE,
  use_category TEXT NOT NULL,     -- e.g., 'Residential', 'Commercial', 'Industrial'
  use_type TEXT NOT NULL,          -- e.g., 'Single Family', 'Duplex', 'Retail'
  status TEXT NOT NULL,            -- 'allowed', 'conditional', 'not_allowed'
  conditions TEXT,                 -- e.g., "Requires conditional use permit"
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(zoning_id, use_type)
);

-- Index for fast lookups
CREATE INDEX idx_permitted_uses_zoning_id ON permitted_uses(zoning_id);
CREATE INDEX idx_permitted_uses_status ON permitted_uses(status);

-- ========== DIMENSIONAL STANDARDS ==========
-- Setbacks, heights, lot size requirements, etc.
CREATE TABLE dimensional_standards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zoning_id UUID NOT NULL REFERENCES zoning_districts(id) ON DELETE CASCADE,
  front_setback_ft NUMERIC,
  side_setback_ft NUMERIC,
  rear_setback_ft NUMERIC,
  max_height_ft NUMERIC,
  min_lot_area_sqft NUMERIC,
  min_lot_width_ft NUMERIC,
  far NUMERIC,                     -- Floor Area Ratio
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(zoning_id)
);

-- ========== USERS (Via Supabase Auth) ==========
-- This table is auto-managed by Supabase
-- Link to auth.users
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  phone TEXT,
  account_type TEXT DEFAULT 'free',  -- 'free', 'pro', 'business'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== SUBSCRIPTIONS ==========
-- Tracks Stripe subscription status
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE NOT NULL,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('free', 'basic_19', 'pro_49', 'business_99')),
  status TEXT NOT NULL,            -- 'active', 'past_due', 'canceled', 'trialing'
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast user lookups
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE UNIQUE INDEX idx_subscriptions_one_per_user ON subscriptions(user_id) WHERE status IN ('active', 'trialing');

-- ========== SAVED PROPERTIES ==========
-- User's saved addresses and zoning info
CREATE TABLE saved_properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  address TEXT NOT NULL,
  city TEXT,
  state TEXT DEFAULT 'DE',
  zip_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  zoning_district_id UUID REFERENCES zoning_districts(id),
  zone_code TEXT,
  zone_name TEXT,
  zoning_data JSONB,               -- Cache full zoning result
  notes TEXT,
  tags TEXT[],                     -- User can tag properties
  starred BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast queries
CREATE INDEX idx_saved_properties_user_id ON saved_properties(user_id);
CREATE INDEX idx_saved_properties_created ON saved_properties(user_id, created_at DESC);
CREATE INDEX idx_saved_properties_starred ON saved_properties(user_id, starred);

-- ========== SEARCH HISTORY ==========
-- Track searches for analytics
CREATE TABLE search_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  address TEXT NOT NULL,
  latitude NUMERIC,
  longitude NUMERIC,
  zone_code TEXT,
  zone_name TEXT,
  search_type TEXT,                -- 'free_search', 'pro_search', 'bulk_search'
  success BOOLEAN,
  error_message TEXT,
  response_time_ms INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for analytics
CREATE INDEX idx_search_history_user_id ON search_history(user_id);
CREATE INDEX idx_search_history_created ON search_history(created_at DESC);
CREATE INDEX idx_search_history_success ON search_history(success);

-- ========== PERMITS REQUIRED ==========
-- Common permits by zone type
CREATE TABLE permits_required (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  zoning_id UUID NOT NULL REFERENCES zoning_districts(id) ON DELETE CASCADE,
  permit_type TEXT NOT NULL,       -- e.g., 'Building Permit', 'Sign Permit'
  required BOOLEAN DEFAULT FALSE,
  conditional BOOLEAN DEFAULT FALSE,
  description TEXT,
  county_link TEXT,               -- Link to county permit page
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ========== ROW-LEVEL SECURITY (RLS) ==========

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own profile
CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can only see their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only see their own saved properties
CREATE POLICY "Users can view own saved properties"
  ON saved_properties FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own saved properties
CREATE POLICY "Users can create saved properties"
  ON saved_properties FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own saved properties
CREATE POLICY "Users can update own saved properties"
  ON saved_properties FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own saved properties
CREATE POLICY "Users can delete own saved properties"
  ON saved_properties FOR DELETE
  USING (auth.uid() = user_id);

-- Users can view their own search history
CREATE POLICY "Users can view own search history"
  ON search_history FOR SELECT
  USING (auth.uid() = user_id);

-- Anonymous users can create search history (for non-logged-in searches)
CREATE POLICY "Anyone can create search history"
  ON search_history FOR INSERT
  WITH CHECK (true);

-- Public: Anyone can read zoning districts
CREATE POLICY "Zoning districts are public"
  ON zoning_districts FOR SELECT
  USING (true);

-- Public: Anyone can read permitted uses
CREATE POLICY "Permitted uses are public"
  ON permitted_uses FOR SELECT
  USING (true);

-- ========== FUNCTIONS & TRIGGERS ==========

-- Update timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger for subscriptions
CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Trigger for saved_properties
CREATE TRIGGER update_saved_properties_updated_at
  BEFORE UPDATE ON saved_properties
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Geographic query function: Find zoning at coordinates
CREATE OR REPLACE FUNCTION find_zoning_at_point(lat NUMERIC, lon NUMERIC)
RETURNS TABLE (
  zone_id UUID,
  district_code TEXT,
  zone_name TEXT,
  county TEXT,
  municipality TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    zd.id,
    zd.district_code,
    zd.name,
    zd.county,
    zd.municipality
  FROM zoning_districts zd
  WHERE ST_Contains(zd.geom, ST_SetSRID(ST_Point(lon, lat), 4326))
  LIMIT 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Get all permitted uses for a zone
CREATE OR REPLACE FUNCTION get_permitted_uses_for_zone(zone_id UUID)
RETURNS TABLE (
  use_type TEXT,
  status TEXT,
  conditions TEXT,
  notes TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pu.use_type,
    pu.status,
    pu.conditions,
    pu.notes
  FROM permitted_uses pu
  WHERE pu.zoning_id = zone_id
  ORDER BY pu.use_category, pu.use_type;
END;
$$ LANGUAGE plpgsql;
```

---

## 📋 Week-by-Week Build Plan

### Week 1: Foundation & Setup

**Time:** 15-20 hours

**What to build:**
1. **Project scaffolding** (1 hour)
   ```bash
   npx create-next-app@latest delaware-zoning --typescript
   cd delaware-zoning
   npm install supabase @supabase/supabase-js stripe @stripe/react-stripe-js axios
   ```

2. **Supabase setup** (2 hours)
   - Create Supabase project (https://supabase.com)
   - Run SQL schema from above
   - Set up Row-Level Security (RLS)
   - Create types (TypeScript interfaces)

3. **Stripe setup** (1 hour)
   - Create Stripe account
   - Create 2 products: "Basic" ($19/mo) and "Pro" ($49/mo)
   - Get API keys

4. **Homepage UI** (4 hours)
   - Search bar component with basic styling
   - Mock results display
   - "Pricing" and "Sign Up" buttons

5. **Environment variables** (1 hour)
   - `.env.local` with Supabase and Stripe keys
   - Deploy placeholder to Netlify

6. **Netlify setup** (1 hour)
   - Connect GitHub repo to Netlify
   - Configure build settings (`next build`, `next start`)
   - Set environment variables in Netlify dashboard

**Deliverable:** 
- Live homepage at `yourdomain.netlify.app`
- Search bar (no functionality yet)
- Pretty landing page

---

### Week 2: Authentication & Database

**Time:** 20-25 hours

**What to build:**

1. **Supabase Auth** (4 hours)
   - Sign up page (email + password)
   - Log in page (email + password)
   - Log out button
   - Session management
   - Redirect unauthenticated users to login

2. **Database population** (3 hours)
   - Import real Delaware zoning data into `zoning_districts`
   - Create `permitted_uses` mappings
   - Set up RLS policies
   - Test geographic queries

3. **User dashboard** (4 hours)
   - Protected page (requires login)
   - Display user's saved properties
   - Show current subscription status
   - "Upgrade to Pro" button

4. **API route: /api/auth/** (3 hours)
   - POST `/api/auth/signup` — create account
   - POST `/api/auth/login` — log in
   - POST `/api/auth/logout` — log out
   - GET `/api/auth/user` — get current user

5. **Styling & UX** (4 hours)
   - Make auth pages look professional
   - Mobile responsive
   - Error messages (bad password, email exists, etc.)
   - Loading states

6. **Testing** (2 hours)
   - Create test account
   - Verify login/logout works
   - Check Supabase data is being stored

**Deliverable:**
- Users can sign up and log in
- Dashboard shows saved properties (empty for now)
- Database has real zoning data
- Geographic queries work

---

### Week 3: Address Search & Zoning Lookup

**Time:** 25-30 hours

**What to build:**

1. **Google Places API** (3 hours)
   - Set up Google Cloud project
   - Enable Places API
   - Create API key
   - Integrate autocomplete into search bar

2. **Address to coordinates** (2 hours)
   - Convert user-selected address → lat/lon
   - Store in database for later

3. **Zoning lookup logic** (4 hours)
   - Call `find_zoning_at_point()` function
   - Query Supabase: "What zone is this address in?"
   - Handle edge cases (address not found, multiple zones)
   - Return zone code + allowed uses

4. **API route: /api/search.ts** (5 hours)
   - POST request with address
   - Call Google Places API → get coordinates
   - Query Supabase for zone at those coordinates
   - Return zoning data + permitted uses
   - Store search in history (for analytics)

5. **Results display component** (5 hours)
   - Show zone code (big, bold)
   - Show zone name
   - List allowed uses (color-coded: allowed, conditional, not allowed)
   - Show parcel basics (size, flood zone, etc.)
   - Show permit checklist

6. **Error handling** (3 hours)
   - Address not found → show helpful message
   - Coordinates outside Delaware → explain
   - Rate limiting (prevent abuse)

7. **Testing** (3 hours)
   - Test 10 real Delaware addresses
   - Verify results match official zoning maps
   - Check edge cases

**Deliverable:**
- User enters address → see zoning code + allowed uses
- Results are accurate for Delaware
- Search history saved to database

---

### Week 4: PDF Export & Saved Properties

**Time:** 20-25 hours

**What to build:**

1. **PDF generation library** (2 hours)
   - Install `jspdf` + `html2pdf`
   - Create PDF template

2. **PDF export API** (4 hours)
   - POST `/api/export-pdf.ts`
   - Takes zoning result
   - Generates 1-page PDF report
   - Returns downloadable file
   - Only available to Pro users

3. **PDF template design** (4 hours)
   - Header: Delaware Zoning logo + address
   - Body: Zone code + permitted uses + parcel info
   - Footer: Legal disclaimer + data sources
   - Professional styling

4. **Save property feature** (3 hours)
   - "Save this property" button
   - Store in `saved_properties` table
   - Link to user account

5. **Saved properties page** (4 hours)
   - Dashboard lists all saved properties
   - Click to re-view zoning
   - Delete button
   - Search/filter within saved

6. **Feature gating** (2 hours)
   - PDF export only for Pro users
   - Show "Upgrade to Pro" for free users
   - Check subscription status in API route

7. **Testing** (2 hours)
   - Generate PDFs from multiple addresses
   - Verify PDF looks good
   - Test subscription checks

**Deliverable:**
- Users can save properties
- Pro users can download PDF reports
- Free users see upgrade prompts

---

### Week 5: Stripe Payments & Subscriptions

**Time:** 20-25 hours

**What to build:**

1. **Stripe setup** (2 hours)
   - Create products and price IDs
   - Configure webhook signing

2. **Pricing page** (3 hours)
   - Display plan options (Free, Basic $19, Pro $49)
   - Feature comparison table
   - "Subscribe" buttons for each plan

3. **Checkout flow** (4 hours)
   - User clicks "Subscribe to Pro"
   - Redirect to Stripe Checkout
   - User enters card details
   - Return to app after payment

4. **Webhook handler** (4 hours)
   - POST `/api/webhooks/stripe.ts`
   - Listen for `customer.subscription.created`
   - Listen for `customer.subscription.updated`
   - Listen for `customer.subscription.deleted`
   - Update user subscription status in Supabase

5. **Subscription status** (3 hours)
   - GET `/api/subscriptions` — return current user's plan
   - Check plan on every request needing it
   - Handle expired/cancelled subscriptions

6. **Upgrade/downgrade logic** (2 hours)
   - User can upgrade Free → Pro
   - User can manage subscription in Stripe portal

7. **Testing** (3 hours)
   - Use Stripe test mode
   - Create test subscription
   - Verify webhook fires correctly
   - Check Supabase is updated

**Deliverable:**
- Users can purchase Pro subscriptions
- Stripe payments work (test mode)
- Subscriptions tracked in Supabase

---

### Week 6: Refinement & Optimization

**Time:** 15-20 hours

**What to build:**

1. **Performance optimization** (3 hours)
   - Add caching (Next.js ISR)
   - Optimize images
   - Lazy load components
   - Check Lighthouse score (target: >90)

2. **Security hardening** (3 hours)
   - Add rate limiting to API routes
   - Validate all inputs
   - CORS headers correct
   - Hide sensitive keys (use environment variables)

3. **Error handling & UX** (3 hours)
   - Better error messages
   - Loading spinners
   - Toast notifications
   - Mobile responsiveness

4. **Analytics** (2 hours)
   - Add Google Analytics
   - Track: searches, conversions, sign-ups
   - View in Netlify dashboard

5. **Bug fixes & testing** (3 hours)
   - QA testing (test all flows)
   - Fix bugs
   - Edge case handling

6. **Documentation** (2 hours)
   - README with setup instructions
   - API documentation
   - Environment variables guide

**Deliverable:**
- MVP is production-ready
- Fast, secure, well-tested
- Ready for beta launch

---

### Week 7-8: Beta Launch & Iteration

**Time:** 15-20 hours

**What to build:**

1. **Landing page improvements** (3 hours)
   - Add social proof (testimonials)
   - FAQ section
   - Demo video/GIF

2. **Email communications** (3 hours)
   - Welcome email for new signups
   - Upgrade reminder emails
   - Thank you after purchase

3. **Customer support** (2 hours)
   - Add chat widget (Intercom or similar)
   - FAQ page
   - Contact form

4. **Marketing setup** (3 hours)
   - SEO optimization (meta tags, structured data)
   - Open Graph images
   - Twitter card

5. **Feedback collection** (2 hours)
   - In-app survey
   - Analytics dashboards
   - User feedback form

6. **Phase 1.5 prep** (2 hours)
   - Plan "Zoning Translator" (AI explanations)
   - Design UI for feature

**Deliverable:**
- Live, public MVP
- 50+ beta users
- Ready to iterate based on feedback

---

## 💰 Cost Breakdown (Year 1)

| Service | Cost | Notes |
|---------|------|-------|
| **Supabase** | $0-25/mo | Free tier for MVP, then $25/mo |
| **Netlify** | $0-19/mo | Free for hobby, $19/mo for production |
| **Google Places API** | $50-200/mo | ~$0.00735 per request, ~10k queries/month |
| **Stripe** | Variable | 2.9% + $0.30 per transaction |
| **OpenAI API** | $0-50/mo | Only in Phase 1.5, ~$0.01 per request |
| **Domain name** | $12/yr | yourname.com via Namecheap |
| **Optional: Sentry** | $29/mo | Error tracking (optional) |
| **Total (MVP)** | **$50-300/mo** | Scales with usage |

---

## 🔐 Security Checklist

- [ ] All secrets in `.env.local` (never committed)
- [ ] Supabase RLS policies enabled
- [ ] API rate limiting implemented
- [ ] HTTPS only (Netlify handles this)
- [ ] Input validation on all forms
- [ ] CORS headers correct
- [ ] Password hashing (Supabase handles this)
- [ ] SQL injection prevention (use parameterized queries)
- [ ] No sensitive data in logs
- [ ] Stripe PCI compliance

---

## 📊 Key Metrics to Track

Once MVP is live, monitor:

1. **User metrics**
   - Sign-ups per day
   - Free vs Pro conversion rate (target: 10-15%)
   - Churn rate (target: <5% per month)

2. **Product metrics**
   - Searches per day
   - Average searches per user
   - PDF exports per day
   - Time to complete search (target: <3s)

3. **Financial metrics**
   - MRR (Monthly Recurring Revenue)
   - CAC (Customer Acquisition Cost)
   - LTV (Lifetime Value)
   - Gross margin (should be 80%+)

4. **Technical metrics**
   - Uptime (target: 99.9%)
   - API response time (target: <500ms)
   - Error rate (target: <0.1%)

---

## 🎯 Post-MVP Roadmap

### Phase 1.5 (Weeks 9-10): AI Explanations
- "Zoning Translator" button
- Natural language zone descriptions
- Cost: ~1 week, $50/mo API costs

### Phase 2 (Weeks 11-16): Advanced Features
- Permit requirement prediction
- Smart follow-up questions
- Bulk address uploads
- Team collaboration
- Cost: ~4-5 weeks, $100/mo more

### Phase 3 (Future): Multi-State Expansion
- Pennsylvania zoning
- Maryland zoning
- New Jersey zoning
- Cost: ~6-8 weeks per state

---

## ⚠️ Gotchas & How to Avoid Them

| Gotcha | Problem | Solution |
|--------|---------|----------|
| **Coordinate-based zoning lookup** | Address coordinates might not exactly match zone boundary | Use Supabase PostGIS (`find_zoning_at_point()` function) |
| **Stale zoning data** | County updates zoning, you don't know | Set up monthly data refresh process, monitor official sources |
| **Google Places charges** | Autocomplete + reverse geocoding both cost | Use Places Autocomplete (cheaper), batch requests |
| **Stripe test cards** | Forgot to switch out of test mode | Always check Stripe dashboard, keep separate test/prod projects |
| **Supabase rate limits** | Hit free tier limits during testing | Monitor usage, upgrade tier early |
| **CORS errors** | Frontend can't call API from different origin | Netlify handles this, but test before deploy |
| **N+1 queries** | Database gets slow with many users | Use `SELECT *` carefully, add indexes, use Supabase query analyzer |
| **PostGIS geometry issues** | Polygon data doesn't load | Use shapefiles with proper projection (EPSG:4326), test in QGIS first |

---

## 🚀 Netlify Deployment Checklist

Before going public:

- [ ] All environment variables set in Netlify dashboard
- [ ] Database backups configured (Supabase auto-backs up)
- [ ] Stripe live mode (not test mode)
- [ ] Email verification working
- [ ] SSL certificate valid (Netlify handles this)
- [ ] SEO tags set (meta description, Open Graph)
- [ ] Analytics tracking active
- [ ] Error monitoring active (Sentry or Netlify Logs)
- [ ] Customer support channel open
- [ ] Terms of Service written
- [ ] Privacy Policy written
- [ ] Data attribution on results page
- [ ] `netlify.toml` configured correctly
- [ ] Build settings: `npm run build` → `npm start`
- [ ] Redirect rules in `netlify.toml` (SPA fallback)

**Sample netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = ".next"

[functions]
  directory = "pages/api"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
```

---

## 📞 Getting Help

**Free resources:**
- Next.js docs: https://nextjs.org/docs
- Supabase docs: https://supabase.com/docs
- Stripe docs: https://stripe.com/docs
- Netlify docs: https://docs.netlify.com/
- TypeScript: https://www.typescriptlang.org/docs/

**Paid resources:**
- Cursor AI (you already use this) — $20/mo
- GitHub Copilot — $10/mo
- Hire contractor from Upwork/Arc — $50-100/hr

---

## ✅ Success Criteria (MVP Complete)

- [ ] Users can search any Delaware address
- [ ] Results show accurate zoning code + permitted uses
- [ ] Free users can do 5 searches/month
- [ ] Pro users ($19/mo) get unlimited searches
- [ ] Pro users ($49/mo) get PDF export + saved properties
- [ ] Payments work (Stripe)
- [ ] First 50 users signed up
- [ ] Zero critical bugs in production
- [ ] Average search time <2 seconds
- [ ] Uptime >99%

---

## 📅 Total Timeline

| Phase | Duration | Status |
|-------|----------|--------|
| Data Validation | 3 weeks | ⏳ Do this FIRST |
| MVP Build | 6-8 weeks | Next |
| Beta Launch | Week 1 | After MVP |
| Iteration | Ongoing | Always |
| Phase 1.5 AI | 2 weeks | After 50 users |
| **Total to MVP** | **9-11 weeks** | |

---

## 🎯 Next Steps for YOU

1. **This week:** Complete data validation (your current task)
2. **Week 2-3:** Send me updated data validation report
3. **Week 4:** We start building (I can help architect)
4. **Week 4-9:** Build alongside me (I'll code review)
5. **Week 10:** Beta launch with 50 users
6. **Week 11+:** Iterate based on feedback

**Ready to start building? Let me know when data validation is done!**

---

**Questions before we start coding?**
- Netlify specific questions?
- Architecture questions?
- Database schema questions?
- Timeline concerns?
- Cost concerns?
