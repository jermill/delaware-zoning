# Delaware Zoning API Documentation

## 🎉 Setup Complete!

Your Supabase database is fully configured with:
- ✅ 27 zoning districts across all DE counties
- ✅ 51+ permitted uses
- ✅ Dimensional standards (setbacks, heights, lot sizes)
- ✅ Required permits by zone
- ✅ 25+ test addresses for development
- ✅ User authentication & profiles
- ✅ Subscription management (Looker, Pro, Whale tiers)
- ✅ Row-level security policies

---

## 📡 Available API Endpoints

### **1. Test Connection**
Check if Supabase is connected and database is populated.

```bash
GET /api/test-connection
```

**Response:**
```json
{
  "success": true,
  "message": "Supabase connection successful!",
  "data": {
    "zoningDistricts": 27,
    "permittedUses": 51,
    "testAddresses": 25,
    "sampleZone": { ... }
  }
}
```

---

### **2. Search Zoning Information**
Get comprehensive zoning data for a specific location.

```bash
GET /api/zoning/search?lat=39.7459&lon=-75.5466&address=10%20E%2010th%20St,%20Wilmington,%20DE
```

**Parameters:**
- `lat` (required): Latitude
- `lon` (required): Longitude  
- `address` (optional): Street address for reference

**Response:**
```json
{
  "success": true,
  "data": {
    "address": "10 E 10th St, Wilmington, DE",
    "coordinates": {
      "latitude": 39.7459,
      "longitude": -75.5466
    },
    "zoning": {
      "districtCode": "R-2",
      "name": "Low-Density Residential",
      "description": "Single and two-family homes...",
      "county": "New Castle",
      "municipality": "Wilmington",
      "isMock": true,
      "dataSource": "Mock Data - Based on Wilmington City Code Ch. 48"
    },
    "permittedUses": [
      {
        "category": "Residential",
        "type": "Single-Family Detached",
        "status": "allowed",
        "conditions": null
      }
    ],
    "dimensionalStandards": {
      "frontSetback": 20,
      "sideSetback": 5,
      "rearSetback": 20,
      "maxHeight": 35,
      "minLotArea": 5000,
      "minLotWidth": 40,
      "far": 0.6,
      "parkingRatio": 1.5,
      "parkingNotes": "1.5 spaces per unit; may use on-street parking"
    },
    "requiredPermits": [
      {
        "type": "Building Permit",
        "required": true,
        "description": "Required for construction within city limits",
        "link": "https://www.wilmingtonde.gov/..."
      }
    ],
    "floodZone": null
  }
}
```

---

### **3. Save Property** 🔒
Save a property to user's dashboard (requires authentication).

```bash
POST /api/properties/save
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "property_id": "prop-123",
  "parcel_id": "12-345-678",
  "address": "123 Market St",
  "city": "Wilmington",
  "county": "New Castle",
  "zip_code": "19801",
  "zoning_district": "C-3",
  "permitted_uses": { ... },
  "dimensional_standards": { ... },
  "notes": "Potential retail site",
  "tags": ["commercial", "downtown"]
}
```

**Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Property saved successfully"
}
```

**Subscription Limits:**
- **Looker**: 5 saved properties
- **Pro**: Unlimited
- **Whale**: Unlimited

---

### **4. List Saved Properties** 🔒
Get all properties saved by the authenticated user.

```bash
GET /api/properties/list
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "properties": [ ... ],
    "count": 5,
    "subscription": {
      "tier": "pro",
      "status": "active",
      "save_limit": null
    }
  }
}
```

---

### **5. Delete Saved Property** 🔒
Remove a property from user's saved list.

```bash
DELETE /api/properties/delete?id=<property_uuid>
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Property deleted successfully"
}
```

---

### **6. Get Test Addresses**
Retrieve test addresses for development (no auth required).

```bash
GET /api/test-addresses?city=Wilmington&zone=B-3
```

**Parameters:**
- `city` (optional): Filter by city
- `zone` (optional): Filter by zone code

**Response:**
```json
{
  "success": true,
  "data": {
    "addresses": [ ... ],
    "count": 4,
    "groupedByCounty": {
      "New Castle": [ ... ],
      "Kent": [ ... ],
      "Sussex": [ ... ]
    }
  }
}
```

---

## 🔐 Authentication

All protected endpoints require a Supabase JWT token in the Authorization header:

```bash
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Get a token:**
```typescript
import { supabase } from '@/lib/supabase';

const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password',
});

const token = data.session?.access_token;
```

---

## 📊 Subscription Tiers

### **The Looker** (Free)
- 3 searches per month
- 5 saved properties
- 0 PDF exports
- Basic zoning info only

### **The Pro** ($49/month)
- 50 searches per month
- Unlimited saved properties
- 0 PDF exports
- Full dimensional standards
- Parking requirements
- Detailed permitted uses
- Flood zone information

### **The Whale** ($129/month)
- Unlimited searches
- Unlimited saved properties
- Unlimited PDF exports
- Everything in Pro PLUS:
- Required permits & timelines
- Overlay districts
- Zoning office contacts
- Direct ordinance links

---

## 🧪 Testing

### Test with cURL:
```bash
# Test connection
curl http://localhost:3000/api/test-connection

# Search zoning
curl "http://localhost:3000/api/zoning/search?lat=39.7459&lon=-75.5466"

# Get test addresses
curl http://localhost:3000/api/test-addresses
```

### Test Addresses Available:
- **Wilmington**: Public library, office towers, residential areas
- **Newark**: University of Delaware, downtown retail
- **Dover**: State Capitol, commercial areas
- **Beach Towns**: Rehoboth, Lewes (tourist/commercial zones)

---

## 🚀 Next Steps

### Frontend Integration:
1. **Create a search page** that calls `/api/zoning/search`
2. **Build property details modal** using the enhanced component we created
3. **Add save functionality** that calls `/api/properties/save`
4. **Display saved properties** from `/api/properties/list`

### Future Enhancements:
- [ ] Add Google Places API for address autocomplete
- [ ] Implement Stripe for subscription payments
- [ ] Add PDF export generation
- [ ] Create admin dashboard for analytics
- [ ] Add real FEMA flood zone data
- [ ] Integrate with county GIS systems

---

## 📞 Support

For issues or questions:
- Check logs in Supabase Dashboard → Database → Logs
- Verify environment variables in `.env.local`
- Test connection with `/api/test-connection`

---

**Last Updated:** December 12, 2024  
**Database Status:** ✅ Fully Operational  
**API Status:** ✅ Ready for Development
