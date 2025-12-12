# Page Visits Tracking Implementation

## Overview
Added comprehensive page visit tracking to the admin dashboard, allowing administrators to monitor site traffic, popular pages, and user engagement metrics.

## Changes Made

### 1. Database Schema (`supabase/12-page-visits-tracking.sql`)
Created a new `page_visits` table to track:
- Page path and title
- User information (nullable for anonymous visitors)
- Session tracking
- Device/Browser info
- Geographic data
- Visit duration
- Timestamp

**Key Features:**
- Tracks both authenticated and anonymous visitors
- Records device type, browser, OS
- Session-based tracking
- Indexed for fast analytics queries

**Views Created:**
- Updated `admin_statistics` view with page visit metrics
- Created `popular_pages` view for top 20 pages in last 30 days

### 2. Analytics Library (`src/lib/analytics.ts`)
Added `trackPageVisit()` function that:
- Generates/retrieves session ID from localStorage
- Detects device type (mobile/tablet/desktop)
- Captures referrer and page metadata
- Sends data to API endpoint

### 3. API Endpoint (`src/pages/api/analytics/track-visit.ts`)
Created endpoint to:
- Handle page visit tracking requests
- Extract user info from auth token (if present)
- Parse user agent for browser and OS
- Capture IP address
- Store visit data in database

### 4. Admin Hook (`src/hooks/useAdmin.ts`)
Updated to fetch page visit statistics:
- Total page visits
- Visits in last 24h, 7 days, 30 days
- Unique visitors in last 24h
- Active users in last 30 days

### 5. Admin Stats Component (`src/components/admin/AdminStats.tsx`)
Enhanced to display:
- Primary stats (users, revenue, searches, conversion)
- **New Section:** Page Visit Analytics with 3 cards:
  - Total Page Visits (with monthly breakdown)
  - Today's Visitors (with page views)
  - Active Users (with weekly visits)

### 6. Popular Pages Component (`src/components/admin/PopularPages.tsx`)
New component showing:
- Table of most visited pages (last 30 days)
- Visit count per page
- Unique visitor count
- Average time on page
- Quick link to visit each page

### 7. Admin Dashboard Page (`src/pages/admin.tsx`)
- Imported and added PopularPages component
- Positioned above Quick Actions section

### 8. App-wide Tracking (`src/pages/_app.tsx`)
- Integrated automatic page visit tracking on every route change
- Tracks both initial page load and navigation

### 9. StatCard Component (`src/components/dashboard/StatCard.tsx`)
- Added support for 'purple' color variant

## Metrics Tracked

### Admin Dashboard Now Shows:
1. **Total Page Visits** - All-time visits
2. **Visits by Time Period:**
   - Last 24 hours
   - Last 7 days
   - Last 30 days
3. **Unique Visitors** - Last 24 hours
4. **Active Users** - Last 30 days
5. **Popular Pages Table:**
   - Page title and path
   - Total visits
   - Unique visitors
   - Average time on page

## Usage

### For Admins:
1. Visit `/admin` to see the dashboard
2. Scroll to "Page Visit Analytics" section for traffic overview
3. View "Popular Pages" table to see which pages are most visited
4. Monitor daily/weekly/monthly trends

### Automatic Tracking:
- Every page visit is automatically tracked
- Works for both authenticated and anonymous users
- Session-based tracking for unique visitor counts
- Device and browser information captured

## Database Migration

To enable this feature in production:

```bash
# Run the migration
psql $DATABASE_URL -f supabase/12-page-visits-tracking.sql
```

Or in Supabase dashboard:
1. Go to SQL Editor
2. Paste contents of `supabase/12-page-visits-tracking.sql`
3. Run the script

## Privacy Considerations

- IP addresses are stored for analytics but should be handled according to privacy policy
- Anonymous visitors are tracked without user ID
- Session IDs are randomly generated client-side
- Consider GDPR compliance and update privacy policy

## Future Enhancements

Potential additions:
- Geographic visualization (country/region maps)
- Real-time visitor dashboard
- Conversion funnel tracking
- A/B testing support
- Export analytics to CSV
- Custom date range filtering
- Page performance metrics
