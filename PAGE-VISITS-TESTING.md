# Page Visits Testing Guide

## Prerequisites

1. **Run Database Migration**
   ```bash
   # Connect to your Supabase database and run:
   psql $DATABASE_URL -f supabase/12-page-visits-tracking.sql
   ```

   Or via Supabase Dashboard:
   - Navigate to SQL Editor
   - Copy contents from `supabase/12-page-visits-tracking.sql`
   - Execute the script

2. **Verify Table Creation**
   ```sql
   -- Check if page_visits table exists
   SELECT * FROM pg_tables WHERE tablename = 'page_visits';
   
   -- Check if views were updated
   SELECT * FROM admin_statistics LIMIT 1;
   SELECT * FROM popular_pages LIMIT 10;
   ```

## Testing Steps

### 1. Test Page Visit Tracking

1. **Start Development Server**
   ```bash
   npm run dev
   ```

2. **Navigate Through Site**
   - Visit home page: `http://localhost:3000/`
   - Visit different pages: `/dashboard`, `/pricing`, `/about`, etc.
   - Each visit should be automatically tracked

3. **Verify Tracking in Database**
   ```sql
   -- Check recent page visits
   SELECT 
     page_path, 
     page_title, 
     device_type, 
     browser, 
     os, 
     visited_at 
   FROM page_visits 
   ORDER BY visited_at DESC 
   LIMIT 20;
   ```

### 2. Test Admin Dashboard

1. **Login as Admin**
   - Your account must have an email containing "admin"
   - Navigate to: `http://localhost:3000/admin`

2. **Verify Page Visit Analytics Section**
   - Should see "Page Visit Analytics" heading
   - Three stat cards should display:
     - Total Page Visits
     - Today's Visitors
     - Active Users (30d)

3. **Verify Popular Pages Table**
   - Table should show most visited pages
   - Columns: Page, Views, Visitors, Avg. Time, Actions
   - Click "Visit" link to navigate to each page

### 3. Test Different Scenarios

#### Anonymous User Tracking
```javascript
// Visit site in incognito/private mode
// Page visits should still be tracked with user_id = null
```

#### Authenticated User Tracking
```javascript
// Login and navigate
// Page visits should include user_id
```

#### Session Tracking
```javascript
// Open browser dev tools -> Application -> Local Storage
// Check for 'session_id' key
// Multiple page views in same session should use same session_id
```

### 4. Verify API Endpoint

```bash
# Test the tracking endpoint directly
curl -X POST http://localhost:3000/api/analytics/track-visit \
  -H "Content-Type: application/json" \
  -d '{
    "page_path": "/test",
    "page_title": "Test Page",
    "session_id": "test_session_123",
    "device_type": "desktop",
    "visited_at": "2024-01-01T00:00:00Z"
  }'
```

## Expected Results

### Admin Dashboard Should Show:

1. **Stats Section**
   - ✅ Total Users
   - ✅ Monthly Revenue
   - ✅ Total Searches
   - ✅ Conversion Rate

2. **Page Visit Analytics Section** (NEW)
   - ✅ Total Page Visits (with monthly count)
   - ✅ Today's Visitors (with page views count)
   - ✅ Active Users 30d (with weekly visits)

3. **Popular Pages Table** (NEW)
   - ✅ List of top 20 pages
   - ✅ Visit counts
   - ✅ Unique visitor counts
   - ✅ Average duration
   - ✅ Working "Visit" links

### Database Queries for Verification

```sql
-- Count total page visits
SELECT COUNT(*) as total_visits FROM page_visits;

-- Count unique sessions today
SELECT COUNT(DISTINCT session_id) as unique_sessions 
FROM page_visits 
WHERE visited_at >= CURRENT_DATE;

-- Most popular pages
SELECT 
  page_path,
  COUNT(*) as visits,
  COUNT(DISTINCT session_id) as unique_visitors
FROM page_visits
WHERE visited_at >= NOW() - INTERVAL '30 days'
GROUP BY page_path
ORDER BY visits DESC
LIMIT 10;

-- Device breakdown
SELECT 
  device_type,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM page_visits
GROUP BY device_type;

-- Browser breakdown
SELECT 
  browser,
  COUNT(*) as count
FROM page_visits
GROUP BY browser
ORDER BY count DESC;
```

## Troubleshooting

### No Page Visits Showing
1. Check browser console for errors
2. Verify API endpoint is running: `/api/analytics/track-visit`
3. Check database connection
4. Verify migration ran successfully

### Admin Dashboard Not Loading Stats
1. Verify user has "admin" in email
2. Check `admin_statistics` view exists
3. Check browser console for errors
4. Verify Supabase credentials are correct

### Popular Pages Empty
1. Navigate through site to generate data
2. Wait a few seconds for async tracking to complete
3. Refresh admin dashboard
4. Check `popular_pages` view in database

## Success Criteria

- ✅ Page visits tracked automatically on every page navigation
- ✅ Admin dashboard shows page visit statistics
- ✅ Popular pages table displays correctly
- ✅ Both anonymous and authenticated users tracked
- ✅ Session IDs generated and persist
- ✅ Device/browser information captured
- ✅ No console errors
- ✅ No linting errors

## Next Steps After Testing

1. Deploy database migration to production
2. Monitor initial data collection
3. Set up regular analytics reviews
4. Consider adding more metrics based on needs
5. Update privacy policy to reflect data collection
