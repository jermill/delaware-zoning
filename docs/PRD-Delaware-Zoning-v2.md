# 📋 PRD — Delaware Zoning v2.0

**Product:** Delaware Zoning  
**Version:** MVP (v2.0)  
**Status:** Ready for Development  
**Last Updated:** December 2025  
**Owner:** Delaware Zoning LLC

---

## 🎯 Executive Summary

**Delaware Zoning** is a SaaS platform that enables Delaware real estate professionals (realtors, investors, developers, architects) to instantly look up zoning classifications, permitted uses, and required permits for any property address in Delaware.

**Core Value Proposition:**
> "Enter an address → instantly see what you can do with that property"

**Target Launch:** Q1 2026 (9-11 weeks from data validation completion)  
**MVP Scope:** Delaware only (3 counties + 3 major cities)  
**Success Metric:** 50 paying users by end of Month 3

---

## 👥 User Personas

### Persona 1: **Sarah (Realtor)**
- Age: 35-50
- Uses: Daily for client consultations
- Pain Point: Explaining zoning to clients takes too long; currently calls county office
- Willing to Pay: $19-49/month
- Usage: 20-30 searches/month
- Key Need: Quick, accurate zoning info to share with clients

### Persona 2: **Marcus (Developer/Investor)**
- Age: 40-60
- Uses: For property evaluation and feasibility studies
- Pain Point: Needs detailed zoning data (setbacks, FAR, permitted uses) for project planning
- Willing to Pay: $49/month or more
- Usage: 40-50 searches/month + PDF exports
- Key Need: Comprehensive zoning data + ability to download reports

### Persona 3: **Jennifer (Architect)**
- Age: 28-45
- Uses: For project pre-planning and code compliance
- Pain Point: Switching between county websites, PDFs, ordinances to understand zoning
- Willing to Pay: $19-49/month
- Usage: 15-25 searches/month
- Key Need: Clear, organized zoning information with dimensional standards

### Persona 4: **David (Office Manager at Brokerage)**
- Age: 45-60
- Uses: Team-wide resource for entire brokerage
- Pain Point: Multiple agents doing redundant zoning research; inconsistent information
- Willing to Pay: $99-199/month (business tier)
- Usage: 200+ searches/month across team
- Key Need: Central tool with team access and administrative controls

---

## 🎯 Product Objectives

### Primary Objectives (Must Have)
1. **Reduce time to zoning lookup** from 5-10 minutes to <2 minutes
2. **Eliminate manual county website visits** for basic zoning queries
3. **Provide accurate, legally-sourced data** (direct from county/city records)
4. **Enable PDF export** for client communication and project documentation
5. **Track user searches** for analytics and feature prioritization

### Secondary Objectives (Nice to Have)
1. Build user base to 50+ paying customers in first 3 months
2. Establish brand as "Delaware zoning authority"
3. Create foundation for multi-state expansion (PA, MD, NJ)
4. Integrate AI explanations (Phase 1.5)

---

## 📊 User Flows

### Flow 1: Free User - Basic Search

```
1. User lands on homepage
   ↓
2. NOT authenticated → Sign up / Log in
   ↓
3. Enter address in search bar
   ↓
4. Select from autocomplete suggestions
   ↓
5. Hit "Search"
   ↓
6. API route /api/search.ts:
   - Get lat/lon from Google Places API
   - Call Supabase function: find_zoning_at_point(lat, lon)
   - Query permitted_uses for that zone
   ↓
7. Display results:
   - Zone code + name (big, bold)
   - "Allowed uses" (green bullet points)
   - "Conditional uses" (yellow bullet points)
   - "Not allowed" (red bullet points)
   - Parcel basics (size, flood zone, county)
   - Permit checklist (common permits for this zone)
   ↓
8. User options:
   - Save property (requires login)
   - Export PDF (upgrade prompt for free users)
   - Search again
   ↓
9. Search logged to search_history table (for analytics)
```

### Flow 2: Pro User - Search + PDF Export

```
1. Authenticated user with active Pro subscription
   ↓
2. Enter address in search bar
   ↓
3. View results (same as Flow 1)
   ↓
4. Click "Download PDF"
   ↓
5. API route /api/export-pdf.ts:
   - Check subscription status (must be Pro)
   - Generate 1-page PDF with:
     * Address + property ID
     * Zoning code + name + description
     * Allowed uses table
     * Dimensional standards (setbacks, height, lot size)
     * Permit checklist
     * Legal disclaimer + data sources
   ↓
6. PDF downloads to user's device
   ↓
7. Save property to dashboard (optional)
```

### Flow 3: User Registration & Upgrade

```
1. Unauthenticated user lands on homepage
   ↓
2. Click "Sign Up"
   ↓
3. Enter email + password (Supabase Auth)
   ↓
4. Account created
   ↓
5. Redirected to dashboard (empty)
   ↓
6. Can perform 5 free searches/month
   ↓
7. When free searches exhausted OR user wants Pro features:
   - Click "Upgrade to Pro"
   ↓
8. Redirected to /pricing page
   ↓
9. Select plan:
   - Basic: $19/month (unlimited searches, limited features)
   - Pro: $49/month (unlimited searches + PDF + dimensional data)
   ↓
10. Click "Subscribe"
    ↓
11. Redirected to Stripe Checkout
    ↓
12. Enter card details (handled by Stripe securely)
    ↓
13. Payment processed
    ↓
14. Stripe webhook fires: customer.subscription.created
    ↓
15. Supabase updated: subscriptions table
    ↓
16. User redirected to dashboard
    ↓
17. Pro features now available
```

### Flow 4: Dashboard - Saved Properties

```
1. Authenticated user clicks "My Properties"
   ↓
2. Load /dashboard page (protected route)
   ↓
3. Query Supabase: SELECT * FROM saved_properties WHERE user_id = {current_user}
   ↓
4. Display list:
   - Address
   - Zone code
   - Date saved
   - Actions: View | Export PDF (Pro only) | Delete
   ↓
5. User can:
   - Click address to re-view zoning results
   - Export PDF (Pro users only)
   - Delete from saved list
   - Sort by date, zone, or alphabetical
   - Search/filter within saved properties
```

---

## ✨ MVP Features (Tier 1: Must Have)

### 1. Address Search Bar
- **Autocomplete suggestions** (Google Places API)
- **Address validation** (is this a real address in Delaware?)
- **Fast response** (<500ms)
- **Mobile responsive**

### 2. Zoning Lookup
- **Zone code display** (e.g., "R-1", "C-3")
- **Zone name** (e.g., "Single Family Residential")
- **Allowed uses** (list of 5-8 permitted uses with status)
- **Conditional uses** (if applicable)
- **Prohibited uses** (if applicable)

### 3. Parcel Information
- **Parcel ID** (if available from county data)
- **Property size** (acres or sq ft)
- **County** (New Castle, Kent, Sussex)
- **Municipality** (Wilmington, Dover, etc.)
- **Flood zone** (basic classification)

### 4. Permit Checklist
- **Common permits** (Building, Electrical, Sign, etc.)
- **Conditional permits** (if zoning requires special approval)
- **Links to county permit pages**

### 5. Save Property
- **"Save this property" button**
- **Stored to saved_properties table**
- **Linked to user account**
- **Accessible from dashboard**

### 6. Basic Authentication
- **Sign up** (email + password)
- **Log in** (email + password)
- **Log out**
- **Session management** (stay logged in)
- **Protected routes** (dashboard requires login)

### 7. Pricing & Subscription
- **Free tier** (5 searches/month)
- **Pro tier** ($19/month - unlimited searches)
- **Pro+ tier** ($49/month - unlimited searches + PDF export + dimensional data)
- **Stripe integration** (secure payments)

### 8. PDF Export (Pro Users Only)
- **1-page report** with:
  * Address + zoning code
  * Permitted uses
  * Dimensional standards (setbacks, heights, FAR)
  * Permit checklist
  * Legal disclaimer + data attribution
- **Professional styling**
- **Download to device**

### 9. Analytics & Search History
- **Track all searches** (user_id, address, zone, timestamp)
- **Measure conversion** (free → paid)
- **Monitor usage** (searches/user)
- **Identify popular zones** (data-driven feature roadmap)

---

## 🚫 Features Explicitly Excluded from MVP

These are intentionally not in v1 to keep scope lean:

- ❌ **Interactive maps** (Mapbox, Google Maps integration)
- ❌ **Bulk address uploads** (handled in Phase 2)
- ❌ **API for third-party integrations** (Phase 2)
- ❌ **Team collaboration features** (Phase 2 - business tier)
- ❌ **Flood zone overlay mapping** (can reference external sources for now)
- ❌ **Wetlands, setback overlays** (future phase)
- ❌ **Short-term rental (STR) restrictions** (research phase)
- ❌ **Comparison tool** (compare two properties)
- ❌ **Historical zoning changes** (future)
- ❌ **Mobile app** (web first, then consider native)
- ❌ **Comments/notes sharing** (future)
- ❌ **Advanced reporting** (Phase 2)

---

## 📱 UI/UX Requirements

### Homepage Design
- **Hero section:** "Enter Address → See Zoning"
- **Large search bar** (prominent CTA)
- **Testimonials** (from beta testers)
- **Feature highlights** (3-4 key benefits)
- **Clear pricing** (free vs paid visible)
- **Sign Up button** (top right)

### Search Results Page
- **Zone code large + bold** (biggest element)
- **Zone name below**
- **Color-coded allowed uses:**
  * Green = Allowed
  * Yellow = Conditional (requires approval)
  * Red = Not allowed
- **"Save Property" button** (visible, easy to click)
- **"Download PDF" button** (upgrade prompt for free users)
- **"Search Again" button**

### Dashboard
- **List of saved properties** (table format)
- **Sort/filter options**
- **Quick actions** (View, Export, Delete)
- **Empty state** ("You haven't saved any properties yet")
- **Upgrade prompt** (if free user)

### Pricing Page
- **Side-by-side plan comparison**
- **Feature table** (what's included in each plan)
- **Clear CTA buttons** ("Start Free" vs "Subscribe Now")
- **FAQ section** (common questions)

### Design System
- **Color scheme:** Delaware blue (navy) + Delaware gold accents
- **Typography:** Clean, modern, readable
- **Mobile first:** All pages responsive to mobile
- **Accessibility:** WCAG 2.1 AA compliant
- **Load time:** <3 seconds for search results

---

## 🔄 User Segments & Pricing

### Segment 1: Free Users
- **Limit:** 5 searches/month
- **Features:**
  * Address search
  * Zone code + name
  * Allowed uses summary
  * Save property (to dashboard)
- **Goal:** Let users validate product before paying
- **Conversion target:** 10-15% to paid

### Segment 2: Basic Users ($19/month)
- **Limit:** Unlimited searches
- **Features:**
  * Everything in Free tier
  * Unlimited saved properties
  * Basic permitted use matrix (not full dimensional standards)
- **Target:** Individual realtors, small investors
- **Projected:** 40% of paid users

### Segment 3: Pro Users ($49/month)
- **Limit:** Unlimited searches
- **Features:**
  * Everything in Basic tier
  * **PDF export** (1-page zoning report)
  * **Dimensional standards** (setbacks, heights, FAR, lot size)
  * Overlay data (if available)
  * Permit requirements
- **Target:** Developers, architects, active investors
- **Projected:** 50% of paid users

### Segment 4: Business Users ($99+/month) [Phase 2]
- **Limit:** Unlimited searches + bulk uploads
- **Features:**
  * Everything in Pro tier
  * Up to 10 team seats
  * Bulk address uploads (CSV)
  * Bulk PDF exports
  * Admin controls
  * Priority support
  * Monthly reporting
- **Target:** Real estate brokerages, title companies, property management
- **Projected:** 10% of paid users (higher LTV)

---

## 📊 Success Metrics

### User Growth
- **Sign-ups:** 100+ in first month
- **Free-to-paid conversion:** 10-15% by month 2
- **Paid users:** 50+ by month 3
- **MRR:** $1,000+ by month 3

### Product Metrics
- **Searches/day:** 100+ by month 2
- **Average search time:** <2 seconds
- **PDF exports/day:** 20+ by month 2
- **Saved properties/user:** 5-10 average
- **Bounce rate:** <30% (homepage to search)

### Engagement
- **Monthly active users:** 80%+ of registered users
- **Return visit rate:** 70%+ week-over-week
- **Feature adoption:** 90%+ search, 50%+ save, 30%+ PDF export
- **Session duration:** 3-5 minutes average

### Financial
- **CAC (Customer Acquisition Cost):** <$10 (organic/viral)
- **LTV (Lifetime Value):** $300+ (average 12-month retention)
- **Churn rate:** <5% per month
- **Gross margin:** 85%+ (SaaS model)

---

## 🛠️ Technical Requirements

### Frontend
- **Framework:** React + Next.js (TypeScript)
- **Deployment:** Netlify
- **Package manager:** npm
- **UI Library:** Tailwind CSS (or custom CSS)
- **State management:** React Context API
- **HTTP client:** Axios or fetch

### Backend
- **API routes:** Next.js API routes
- **Authentication:** Supabase Auth
- **Database:** PostgreSQL (via Supabase)
- **Geospatial:** PostGIS extension
- **File storage:** Supabase Storage (for PDFs)

### External APIs
- **Google Places API** (address autocomplete)
- **Stripe API** (payments)
- **Supabase** (database + auth)

### Infrastructure
- **Hosting:** Netlify
- **CDN:** Netlify CDN
- **DNS:** Netlify DNS
- **SSL:** Let's Encrypt (automatic)
- **Monitoring:** Netlify Analytics + Sentry (optional)

### Performance Requirements
- **Time to First Byte (TTFB):** <200ms
- **First Contentful Paint (FCP):** <2s
- **Lighthouse score:** >90
- **Uptime:** 99.9%
- **API response time:** <500ms (p95)

---

## 🔐 Security & Privacy

### Data Protection
- **HTTPS only** (all traffic encrypted)
- **Row-Level Security (RLS)** on all user data
- **Password hashing** (bcrypt via Supabase)
- **No passwords stored** (Supabase Auth)
- **API rate limiting** (prevent abuse)

### Compliance
- **GDPR ready** (user can request data deletion)
- **CCPA ready** (user privacy controls)
- **PCI DSS** (Stripe handles payment processing)
- **Privacy policy** (required before launch)
- **Terms of Service** (required before launch)

### Data Attribution
- **Clear attribution** to county/city on all results
- **Legal disclaimer** on PDF exports
- **Data freshness date** on all results
- **Link to official sources** (county zoning ordinances)

---

## 📅 Development Timeline

| Week | Phase | Deliverables |
|------|-------|--------------|
| 1-3 | Data Validation | Delaware zoning data validated, permits mapped, legal permissions secured |
| 4 | Foundation | Netlify + Supabase + Stripe setup, homepage live |
| 5 | Auth & DB | Users can sign up/log in, database populated with zoning data |
| 6 | Search | Address search works, zoning lookup functional |
| 7 | Dashboard | User can save properties, view saved list |
| 8 | PDF Export | Pro users can download PDF reports |
| 9 | Payments | Stripe integration working (test mode) |
| 10 | Polish | Security, performance, bug fixes |
| 11 | Beta Launch | Live, 50+ beta users, ready for iteration |

---

## 🚀 Go-to-Market Strategy

### Pre-Launch (Week 1-2 of MVP)
- [ ] Create landing page (email signup)
- [ ] Reach out to 10 Delaware realtors (personal outreach)
- [ ] Join Delaware real estate Facebook groups
- [ ] Create Twitter/LinkedIn accounts
- [ ] Prepare demo video (30 seconds)

### Launch Week (Week 11)
- [ ] Send email to beta waitlist
- [ ] Post in Delaware real estate groups
- [ ] Reach out to Delaware Association of Realtors
- [ ] Post on Twitter/LinkedIn
- [ ] Create blog post: "Better Way to Look Up Zoning in Delaware"

### Month 1 Post-Launch
- [ ] Collect testimonials from beta users
- [ ] Write case studies (realtor saves X hours/month)
- [ ] Email nurture sequence (3-5 emails)
- [ ] Google Ads ($200 budget) targeting "Delaware zoning"
- [ ] Podcast outreach (Delaware real estate podcasts)

### Month 2-3
- [ ] Partner with 2-3 real estate brokerages (revenue share?)
- [ ] Content marketing (zoning guides, tax benefits, etc.)
- [ ] Referral program (refer a friend, get discount)
- [ ] Upgrade reminder emails
- [ ] Testimonials on pricing page

---

## 📈 Growth Roadmap (Post-MVP)

### Phase 1.5 (Weeks 12-13): AI Explanations
- "Zoning Translator" button
- Natural language descriptions of zones
- Cost: $50/month API, 1 week dev

### Phase 2 (Weeks 14-19): Advanced Features
- Bulk address uploads (CSV)
- Permit requirement prediction (AI)
- Team collaboration (business tier)
- Advanced reporting
- Cost: 4-5 weeks dev

### Phase 3 (Weeks 20+): Multi-State
- Pennsylvania zoning (same format)
- Maryland zoning
- New Jersey zoning
- Cost: 6-8 weeks per state

### Phase 4 (Future): Partnerships
- Zillow/Redfin integration
- MLS system integration
- CRM integration (HubSpot, Salesforce)
- Title company integration

---

## ⚠️ Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Zoning data outdated** | Users get wrong info | Monthly data refresh from counties, version control |
| **County won't share data** | Can't launch in that county | Manual extraction from PDFs, manual verification |
| **Google Places API costs spike** | Unexpected bill | Rate limiting, batch queries, monitor usage |
| **Stripe payment fails** | Can't process subscriptions | Use Stripe test mode carefully, webhook monitoring |
| **User doesn't trust data** | Low adoption | Clear attribution, disclaimer, link to official sources |
| **Competitors emerge** | Lose market opportunity | Fast execution, build brand, focus on UX |
| **Scaling issues** | Performance degrades | Database indexing, caching, CDN (Netlify handles) |

---

## 🎯 Success Criteria for MVP Launch

- ✅ Users can search **any Delaware address**
- ✅ Results show **accurate zoning code + permitted uses**
- ✅ Free users get **5 searches/month**
- ✅ Pro users can **download PDF reports**
- ✅ Stripe payments **work in production**
- ✅ First **50 paying users** acquired
- ✅ **Zero critical bugs** in production
- ✅ **<2 second** search response time
- ✅ **99.9% uptime**
- ✅ Legal permissions for all data sources
- ✅ Privacy policy + Terms of Service published

---

## 📞 Questions & Decisions Needed

Before development starts:

1. **Free tier limits:** 5 searches/month, or daily limit (e.g., 1/day)?
2. **Business tier:** Needed for MVP, or Phase 2?
3. **Data refresh cadence:** Monthly? Quarterly? Real-time?
4. **Dimensional standards in Pro tier:** Include full setbacks/heights, or basic only?
5. **STR (Short-term rental) data:** If available, include in MVP or Phase 1.5?
6. **Multi-property comparisons:** Phase 1 or Phase 2?
7. **Brand name final:** Delaware Zoning or alternative?
8. **Target launch date:** Firm Q1 2026 or flexible?
9. **Founder involvement:** Building alongside or hands-off?

---

## 📄 Appendix A: Data Sources

**Verified Delaware zoning data sources:**
- New Castle County Division of Planning
- Kent County Planning Office
- Sussex County Planning Office
- City of Wilmington Department of Planning & Development
- City of Newark Planning Office
- City of Dover Planning & Zoning

**Zoning ordinances:**
- New Castle County Code, Chapter 40
- Wilmington City Code, Chapter 28
- Newark City Code (Zoning)
- Kent County Code (Zoning)
- Dover City Code (Zoning)
- Sussex County Code (Zoning)

*(See Data Validation Plan for detailed contact info & access methods)*

---

## 📄 Appendix B: Glossary

- **Zone Code:** Abbreviation for zoning district (e.g., R-1, C-3)
- **Permitted Use:** Land use allowed by right in a zone
- **Conditional Use:** Land use allowed with special approval/permit
- **Setback:** Required distance from property line to building
- **FAR:** Floor Area Ratio (ratio of building floor area to lot area)
- **Variance:** Exception to zoning rules (requires approval)
- **RLS:** Row-Level Security (database-level access control)
- **MRR:** Monthly Recurring Revenue
- **LTV:** Lifetime Value (total revenue per customer)
- **CAC:** Customer Acquisition Cost

---

**Document Version:** 2.0  
**Last Updated:** December 11, 2025  
**Next Review:** After data validation complete  
**Status:** Ready for Development 🚀
