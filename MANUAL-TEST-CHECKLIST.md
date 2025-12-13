# Manual Testing Checklist

**Date:** December 13, 2025  
**Purpose:** Comprehensive manual testing before production deployment  
**Tester:** _______________  
**Date Completed:** _______________

---

## Critical User Journeys

### 1. New User Signup Flow

**Goal:** Ensure new users can successfully create an account and access free tier features

- [ ] **Step 1:** Visit homepage at `https://delawarezoning.com`
  - [ ] Page loads in < 3 seconds
  - [ ] Hero section clearly explains product value
  - [ ] CTA button "Get Started Free" is visible
  
- [ ] **Step 2:** Click "Get Started Free" button
  - [ ] Redirects to `/signup` page
  - [ ] Signup form displays correctly
  - [ ] Email and password fields present
  - [ ] hCaptcha challenge appears
  
- [ ] **Step 3:** Complete hCaptcha verification
  - [ ] Checkbox clickable
  - [ ] Challenge modal opens
  - [ ] Can complete challenge
  - [ ] Form enables after successful verification
  
- [ ] **Step 4:** Submit signup form
  - [ ] Enter valid email: `test+[timestamp]@example.com`
  - [ ] Enter strong password (8+ chars, mixed case, numbers)
  - [ ] Click "Create Account" button
  - [ ] Loading spinner appears
  - [ ] No console errors
  
- [ ] **Step 5:** Verify email sent
  - [ ] Success message appears: "Check your email"
  - [ ] Check Supabase auth logs for confirmation email
  - [ ] Email contains verification link
  
- [ ] **Step 6:** Confirm email and log in
  - [ ] Click verification link in email
  - [ ] Redirects to login page or dashboard
  - [ ] Can log in with credentials
  - [ ] Redirects to dashboard after login
  
- [ ] **Step 7:** Verify free tier limits
  - [ ] Dashboard shows "Free" plan badge
  - [ ] Shows "3/3 searches remaining" this month
  - [ ] Upgrade prompt visible
  
**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:** _______________________________________________

---

### 2. Property Search Flow

**Goal:** Verify address search, geocoding, zoning lookup, and results display

#### Test Case 2A: New Castle County Address

- [ ] **Address:** `1313 N Market St, Wilmington, DE 19801`
  
- [ ] **Step 1:** Enter address in search box
  - [ ] Type address into home page search
  - [ ] Google Places autocomplete appears
  - [ ] Dropdown shows matching addresses
  - [ ] Can select address from dropdown
  
- [ ] **Step 2:** Submit search
  - [ ] Click "Search" or press Enter
  - [ ] Loading spinner appears
  - [ ] No errors in console
  - [ ] Search completes in < 5 seconds
  
- [ ] **Step 3:** Review results
  - [ ] Zoning code displays (e.g., "C-2")
  - [ ] Zoning name displays (e.g., "General Commercial")
  - [ ] County shown: "New Castle"
  - [ ] Map displays with correct location marker
  - [ ] Permitted uses section visible
  - [ ] Dimensional standards section visible
  
- [ ] **Step 4:** Verify data accuracy
  - [ ] Zoning code matches official county records
  - [ ] No mock data warnings
  - [ ] Description is meaningful (not placeholder text)
  - [ ] Map coordinates match address
  
- [ ] **Step 5:** Test save property
  - [ ] Click "Save Property" button
  - [ ] Success message appears
  - [ ] Property appears in dashboard "Saved Properties"
  - [ ] Can add optional notes
  
**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:** _______________________________________________

#### Test Case 2B: Sussex County Address

- [ ] **Address:** `1770 Coastal Hwy, Dewey Beach, DE 19971`
  
- [ ] Run same steps as Test Case 2A
- [ ] Verify Sussex County data displays
- [ ] Confirm different zoning codes than New Castle

**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:** _______________________________________________

#### Test Case 2C: Kent County Address (Expected to Fail Gracefully)

- [ ] **Address:** `116 W Water St, Dover, DE 19904`
  
- [ ] **Step 1:** Enter Dover address
- [ ] **Step 2:** Submit search
- [ ] **Step 3:** Verify "Coming Soon" message
  - [ ] Clear error message: "Kent County coverage coming soon"
  - [ ] Link to `/kent-county-coming-soon` page
  - [ ] No confusing error codes
  - [ ] Suggests contacting Kent County directly
  
**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:** _______________________________________________

---

### 3. Subscription Upgrade Flow

**Goal:** Test Stripe checkout for Pro tier subscription

- [ ] **Step 1:** Navigate to pricing page
  - [ ] Click "Upgrade" or "Pricing" in dashboard
  - [ ] Three tiers displayed: Free, Pro, Whale
  - [ ] Prices correct: Free ($0), Pro ($29/mo), Whale ($99/mo)
  - [ ] Features listed for each tier
  
- [ ] **Step 2:** Click "Upgrade to Pro"
  - [ ] Redirects to Stripe Checkout
  - [ ] Stripe form loads (white background with blue header)
  - [ ] Plan details shown: "Pro Plan - $29/month"
  
- [ ] **Step 3:** Enter test card details
  - [ ] **Card Number:** `4242 4242 4242 4242`
  - [ ] **Expiry:** `12/34` (any future date)
  - [ ] **CVC:** `123`
  - [ ] **Email:** Use your test account email
  - [ ] **Name:** "Test User"
  - [ ] Form accepts test card
  
- [ ] **Step 4:** Complete payment
  - [ ] Click "Subscribe" button
  - [ ] Processing indicator appears
  - [ ] Redirects to success page
  - [ ] Success message displays
  
- [ ] **Step 5:** Verify webhook received
  - [ ] Check Stripe dashboard for webhook delivery
  - [ ] Event `checkout.session.completed` shows success
  - [ ] No webhook errors
  
- [ ] **Step 6:** Verify Pro tier activated
  - [ ] Return to dashboard
  - [ ] Badge shows "Pro" tier
  - [ ] Search limit changed to "50 searches/month"
  - [ ] PDF export button visible
  - [ ] "Manage Billing" button appears
  
- [ ] **Step 7:** Test Pro features
  - [ ] Perform a search
  - [ ] Verify full data displayed (not limited)
  - [ ] Click "Export PDF" button
  - [ ] PDF downloads successfully
  - [ ] PDF contains complete zoning data
  
**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:** _______________________________________________

---

### 4. Billing Management Flow

**Goal:** Test Stripe Customer Portal for subscription management

- [ ] **Step 1:** Click "Manage Billing" in dashboard
  - [ ] Button visible for Pro/Whale users
  - [ ] Click redirects to Stripe Customer Portal
  - [ ] Portal loads with correct branding
  
- [ ] **Step 2:** View current subscription
  - [ ] Current plan shown: "Pro - $29.00/month"
  - [ ] Next billing date displayed
  - [ ] Payment method shown (last 4 digits)
  - [ ] Billing history visible
  
- [ ] **Step 3:** Update payment method
  - [ ] Click "Update payment method"
  - [ ] Can add new test card: `5555 5555 5555 4444`
  - [ ] Card saves successfully
  - [ ] Confirmation message appears
  
- [ ] **Step 4:** Test plan change (Upgrade to Whale)
  - [ ] Click "Update plan"
  - [ ] Select "Whale" tier
  - [ ] Prorated amount calculated
  - [ ] Confirm upgrade
  - [ ] Webhook `customer.subscription.updated` fires
  
- [ ] **Step 5:** Verify plan change
  - [ ] Return to dashboard
  - [ ] Badge shows "Whale" tier
  - [ ] Unlimited searches indicated
  - [ ] All premium features unlocked
  
- [ ] **Step 6:** Test subscription cancellation
  - [ ] Return to Customer Portal
  - [ ] Click "Cancel plan"
  - [ ] Confirmation modal appears
  - [ ] Warning about losing access shown
  - [ ] Confirm cancellation
  - [ ] Webhook `customer.subscription.deleted` fires
  
- [ ] **Step 7:** Verify cancellation
  - [ ] Dashboard shows "Free" tier
  - [ ] Search limits reset to 3/month
  - [ ] Saved properties retained
  - [ ] Premium features disabled
  
**Pass/Fail:** ☐ PASS ☐ FAIL  
**Notes:** _______________________________________________

---

### 5. Error Handling

**Goal:** Ensure graceful error handling for common failure scenarios

#### Test Case 5A: Invalid Address Search

- [ ] Enter invalid address: `asdfasdf`
- [ ] Click search
- [ ] User-friendly error message displays
- [ ] No technical error details shown to user
- [ ] Can try different address

**Pass/Fail:** ☐ PASS ☐ FAIL

#### Test Case 5B: Address Outside Delaware

- [ ] Enter address: `1600 Pennsylvania Ave NW, Washington, DC 20500`
- [ ] Submit search
- [ ] Error message: "Address must be in Delaware"
- [ ] Suggests trying Delaware address
- [ ] No console errors

**Pass/Fail:** ☐ PASS ☐ FAIL

#### Test Case 5C: Rate Limit Exceeded

- [ ] Make 4 searches rapidly (exhaust free tier)
- [ ] Attempt 5th search
- [ ] Rate limit message appears: "Search limit reached"
- [ ] Upgrade prompt shown
- [ ] Can't bypass by refreshing page

**Pass/Fail:** ☐ PASS ☐ FAIL

#### Test Case 5D: Network Failure Scenario

- [ ] Open DevTools → Network tab
- [ ] Throttle to "Offline"
- [ ] Attempt to search
- [ ] Error message: "Network error - please check connection"
- [ ] Retry button appears
- [ ] Re-enable network and retry succeeds

**Pass/Fail:** ☐ PASS ☐ FAIL

---

### 6. Cross-Browser Testing

**Goal:** Verify functionality across major browsers and devices

#### Desktop Browsers

- [ ] **Chrome (Desktop)**
  - [ ] Version: _______________
  - [ ] All features work correctly
  - [ ] No layout issues
  - [ ] Search, signup, payment all functional
  
- [ ] **Safari (Desktop)**
  - [ ] Version: _______________
  - [ ] All features work correctly
  - [ ] PDF downloads work
  - [ ] Stripe checkout functional
  
- [ ] **Firefox (Desktop)**
  - [ ] Version: _______________
  - [ ] All features work correctly
  - [ ] hCaptcha works
  - [ ] No console errors

#### Mobile Browsers

- [ ] **Mobile Safari (iOS)**
  - [ ] Device: _______________
  - [ ] Responsive layout correct
  - [ ] Touch interactions work
  - [ ] Forms are keyboard-accessible
  - [ ] Search autocomplete works
  
- [ ] **Chrome Mobile (Android)**
  - [ ] Device: _______________
  - [ ] Responsive layout correct
  - [ ] Navigation menu functional
  - [ ] Payment flow works on mobile

**Overall Browser Compatibility:** ☐ PASS ☐ FAIL

---

## Additional Test Scenarios

### Performance Testing

- [ ] **Homepage Load Time**
  - [ ] Loads in < 3 seconds on 3G
  - [ ] First Contentful Paint < 1.8s
  - [ ] Time to Interactive < 3.8s
  
- [ ] **Search Performance**
  - [ ] Address search completes in < 5s
  - [ ] No visual lag during typing
  - [ ] Map renders smoothly
  
- [ ] **Dashboard Performance**
  - [ ] Loads 20+ saved properties instantly
  - [ ] Smooth scrolling
  - [ ] No memory leaks after extended use

### Accessibility Testing

- [ ] **Keyboard Navigation**
  - [ ] Can tab through all interactive elements
  - [ ] Enter key submits forms
  - [ ] Escape key closes modals
  - [ ] Focus indicators visible
  
- [ ] **Screen Reader**
  - [ ] Alt text on all images
  - [ ] Form labels properly associated
  - [ ] Error messages announced
  - [ ] ARIA labels where appropriate

### Security Testing

- [ ] **XSS Prevention**
  - [ ] Try entering `<script>alert('XSS')</script>` in address field
  - [ ] Should be escaped and not execute
  
- [ ] **SQL Injection Prevention**
  - [ ] Try entering `'; DROP TABLE users;--` in search
  - [ ] Should be safely escaped
  
- [ ] **Authentication**
  - [ ] Cannot access `/dashboard` when logged out
  - [ ] Redirects to login
  - [ ] JWT token expires after timeout
  - [ ] Cannot access other users' saved properties

### Data Integrity

- [ ] **No Mock Data**
  - [ ] All search results show real zoning codes
  - [ ] No "MOCK-" prefixes in district codes
  - [ ] Descriptions are meaningful
  - [ ] Data sources attributed

- [ ] **Map Accuracy**
  - [ ] Markers placed at correct coordinates
  - [ ] Zoom level appropriate
  - [ ] Can interact with map controls

---

## Production Environment Checklist

### Environment Variables

- [ ] All required env vars set in Netlify
- [ ] Stripe keys are LIVE mode (pk_live_, sk_live_)
- [ ] Supabase URL correct
- [ ] SendGrid API key valid
- [ ] Google Maps API key restricted to domain
- [ ] hCaptcha keys for production domain

### DNS & SSL

- [ ] Custom domain configured
- [ ] SSL certificate valid (HTTPS working)
- [ ] WWW redirect configured
- [ ] HSTS header present

### Monitoring

- [ ] Sentry error tracking active
- [ ] Google Analytics tracking
- [ ] Stripe webhooks delivering successfully
- [ ] Upstash Redis rate limiting operational

---

## Sign-Off

**Tester Name:** _______________  
**Date:** _______________  
**Total Tests Passed:** _____ / _____  
**Ready for Production:** ☐ YES ☐ NO

**Critical Issues Found:**

1. _________________________________________________
2. _________________________________________________
3. _________________________________________________

**Notes for Deployment:**

_______________________________________________
_______________________________________________
_______________________________________________

---

**Next Steps After Manual Testing:**

1. Fix any critical issues found
2. Re-test failed scenarios
3. Run automated security tests (Phase 3.6)
4. Run Lighthouse audit (Phase 3.5)
5. Generate final test reports
6. Update PRODUCTION-SHIP-SUMMARY.md
7. Deploy to production 🚀
