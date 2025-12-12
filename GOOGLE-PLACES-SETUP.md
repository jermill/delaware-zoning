# Google Places API Setup Guide

## 1. Get Your API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - **Places API**
   - **Geocoding API**
   - **Maps JavaScript API**

4. Create API credentials:
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **API Key**
   - Copy your API key

## 2. Configure API Key Restrictions (Important for Security)

### Application Restrictions:
- **HTTP referrers (websites)**
- Add your domains:
  ```
  localhost:3000/*
  yourdomain.com/*
  *.yourdomain.com/*
  ```

### API Restrictions:
- **Restrict key**
- Select:
  - Places API
  - Geocoding API
  - Maps JavaScript API

## 3. Add to Environment Variables

Add to your `.env.local` file:

```bash
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

**Note:** The `NEXT_PUBLIC_` prefix is required for client-side access in Next.js.

## 4. Features Implemented

### ✅ Address Autocomplete
- Real-time address suggestions as you type
- Restricted to Delaware addresses only
- Validates that selected address is in Delaware

### ✅ Geocoding
- Automatically converts addresses to coordinates
- Fallback geocoding for manual address entry
- Error handling for invalid addresses

### ✅ Smart Search Flow
1. User types in search bar
2. Google Places shows autocomplete suggestions
3. User selects an address
4. System gets coordinates automatically
5. Zoning search executes with coordinates

## 5. Cost Information

Google Places API pricing (as of 2024):
- **Autocomplete (per session):** $0.017
- **Geocoding:** $0.005 per request
- **Free tier:** $200 credit per month (~11,764 autocomplete sessions)

For a Delaware-focused app with moderate traffic, you'll likely stay within the free tier.

## 6. Testing

Once you've added your API key:

1. Visit http://localhost:3000
2. Start typing an address in the search bar
3. You should see autocomplete suggestions
4. Select an address from the dropdown
5. It will automatically navigate to search results

**Example addresses to test:**
- "10 E 10th St, Wilmington"
- "132 Christiana Mall, Newark"
- "411 Legislative Ave, Dover"

## 7. Troubleshooting

### "Loading address search..." doesn't change
- Check that your API key is in `.env.local`
- Restart your Next.js dev server
- Check browser console for errors

### Autocomplete doesn't show suggestions
- Verify all 3 APIs are enabled in Google Cloud Console
- Check API key restrictions aren't blocking localhost
- Open browser DevTools → Network tab to check for API errors

### "This API key is not authorized for this IP"
- Add `localhost:3000/*` to HTTP referrers in API key restrictions

## 8. Production Deployment

Before deploying:

1. Add your production domain to API key restrictions
2. Set the environment variable in your hosting platform:
   ```bash
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
   ```

3. Consider implementing:
   - Request caching to reduce API calls
   - Session tokens for Autocomplete (included in implementation)
   - Rate limiting to prevent abuse

## Files Modified

- `src/hooks/useGooglePlaces.ts` - Places Autocomplete hook
- `src/hooks/useZoningSearch.ts` - Added geocoding support
- `src/components/landing/Hero.tsx` - Integrated autocomplete

## Next Steps

✅ Google Places API - COMPLETE
⏳ Stripe Payments - IN PROGRESS
