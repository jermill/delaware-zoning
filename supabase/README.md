# Delaware Zoning - Database Setup Guide

This directory contains all SQL scripts needed to set up the Delaware Zoning database with mock data.

## 🎯 Quick Start

**Total Setup Time:** ~30 minutes

### Prerequisites

1. **Supabase Account** - Sign up at https://supabase.com (free tier works fine)
2. **PostgreSQL Knowledge** - Basic SQL understanding
3. **PostGIS Extension** - Enabled in your Supabase project (usually enabled by default)

---

## 📁 File Execution Order

**IMPORTANT:** Execute these scripts in order!

| Order | File | Purpose | Time | Status |
|-------|------|---------|------|--------|
| 1 | `01-schema-updates.sql` | Add tracking columns & flood_zones table | 2 min | Required |
| 2 | `02-seed-zoning-districts.sql` | Create 27 mock zoning districts | 3 min | Required |
| 3 | `03-seed-permitted-uses.sql` | Map 100+ permitted uses to zones | 5 min | Required |
| 4 | `04-seed-dimensional-standards.sql` | Add setbacks, heights, lot sizes | 3 min | Required |
| 5 | `05-seed-permits-required.sql` | Map permits to zones | 3 min | Required |
| 6 | `06-seed-sample-addresses.sql` | Create 25+ test addresses | 2 min | Required |
| 7 | `07-fema-flood-zones-integration.md` | FEMA flood data guide | N/A | Documentation |

---

## 🚀 Step-by-Step Setup

### Option A: Supabase SQL Editor (Recommended)

1. **Open Supabase Dashboard**
   ```
   https://app.supabase.com/project/YOUR_PROJECT_ID/sql
   ```

2. **Create New Query**
   - Click "SQL Editor" in left sidebar
   - Click "New query"

3. **Execute Scripts in Order**
   - Copy contents of `01-schema-updates.sql`
   - Paste into SQL editor
   - Click "Run" (or press Cmd/Ctrl + Enter)
   - Repeat for files 02-06

4. **Verify Installation**
   ```sql
   -- Check if data was loaded
   SELECT COUNT(*) FROM zoning_districts WHERE is_mock = true;
   -- Should return: 27
   
   SELECT COUNT(*) FROM permitted_uses WHERE is_mock = true;
   -- Should return: 100+
   
   SELECT COUNT(*) FROM dimensional_standards WHERE is_mock = true;
   -- Should return: 27
   
   SELECT COUNT(*) FROM test_addresses;
   -- Should return: 25+
   ```

### Option B: psql Command Line

1. **Get Supabase Connection String**
   - Dashboard → Settings → Database → Connection string (URI)
   - Example: `postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres`

2. **Execute Scripts**
   ```bash
   # Set connection string
   export DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
   
   # Run each script
   psql $DATABASE_URL -f 01-schema-updates.sql
   psql $DATABASE_URL -f 02-seed-zoning-districts.sql
   psql $DATABASE_URL -f 03-seed-permitted-uses.sql
   psql $DATABASE_URL -f 04-seed-dimensional-standards.sql
   psql $DATABASE_URL -f 05-seed-permits-required.sql
   psql $DATABASE_URL -f 06-seed-sample-addresses.sql
   ```

3. **Verify**
   ```bash
   psql $DATABASE_URL -c "SELECT COUNT(*) FROM zoning_districts WHERE is_mock = true;"
   ```

---

## 🧪 Testing Your Setup

### Test 1: Geographic Query

```sql
-- Find zoning at Christiana Mall (Newark)
SELECT district_code, name, county, municipality
FROM find_zoning_at_point(39.6776, -75.6514);

-- Expected result: CR (Commercial Regional)
```

### Test 2: Permitted Uses Lookup

```sql
-- Get allowed uses for C-1 (Community Commercial)
SELECT use_type, status, conditions
FROM permitted_uses
WHERE zoning_id = (
  SELECT id FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle'
)
ORDER BY status, use_type;
```

### Test 3: Full Search Query

```sql
-- Simulate a complete property search
WITH location AS (
  SELECT 39.7459 as lat, -75.5466 as lon  -- Wilmington Public Library
)
SELECT 
  zd.district_code,
  zd.name,
  zd.county,
  zd.municipality,
  ds.front_setback_ft,
  ds.max_height_ft,
  ds.min_lot_area_sqft,
  COUNT(pu.id) as total_uses
FROM location l
JOIN zoning_districts zd ON ST_Contains(zd.geom, ST_SetSRID(ST_Point(l.lon, l.lat), 4326))
LEFT JOIN dimensional_standards ds ON ds.zoning_id = zd.id
LEFT JOIN permitted_uses pu ON pu.zoning_id = zd.id
GROUP BY zd.id, ds.id;
```

### Test 4: Test Addresses

```sql
-- List all test addresses with expected zones
SELECT address, city, expected_zone_code, expected_zone_name, property_type
FROM test_addresses
ORDER BY city, address;
```

---

## 📊 What You've Created

After running all scripts, your database will contain:

### Zoning Districts (27 zones)
- **New Castle County:** 10 zones (NC2a, NC40, NC15, NC10, NC6.5, C-1, CR, O, LI, HI)
- **Wilmington:** 5 zones (R-2, R-5, B-1, B-3, M-1)
- **Kent County:** 3 zones (AR, R-1, C-2)
- **Dover:** 2 zones (RS, GC)
- **Sussex County:** 4 zones (AR-1, GR, C-1, C-3)
- **Newark:** 3 zones (RS, RM, BB)

### Permitted Uses (100+ mappings)
- Residential uses (Single-Family, Multi-Family, ADU, etc.)
- Commercial uses (Retail, Office, Restaurant, etc.)
- Industrial uses (Manufacturing, Warehouse, etc.)
- Institutional uses (Place of Worship, Schools, etc.)
- Agricultural uses (Farming, Livestock, etc.)

### Dimensional Standards (27 records)
- Front/Side/Rear setbacks
- Maximum heights (25-250 ft)
- Minimum lot sizes (0-217,800 sq ft)
- Floor Area Ratios (0.08-12.0)
- Parking requirements

### Permits Required (80+ records)
- Building, Electrical, Plumbing permits
- Site plan reviews
- Sign permits
- Conditional use permits
- Environmental reviews

### Test Addresses (25+ addresses)
- Real Delaware locations
- Mix of residential, commercial, industrial
- Covers all 3 counties + 3 cities
- Includes lat/lon coordinates

---

## 🔧 Troubleshooting

### Issue: "PostGIS extension not found"

**Solution:**
```sql
-- Run this first
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Issue: "Table already exists"

**Solution:**
```sql
-- If you need to start over, drop tables in reverse order
DROP TABLE IF EXISTS permits_required CASCADE;
DROP TABLE IF EXISTS dimensional_standards CASCADE;
DROP TABLE IF EXISTS permitted_uses CASCADE;
DROP TABLE IF EXISTS test_addresses CASCADE;
DROP TABLE IF EXISTS zoning_districts CASCADE;
DROP TABLE IF EXISTS flood_zones CASCADE;

-- Then re-run all scripts
```

### Issue: "Duplicate key value violates unique constraint"

**Solution:**
```sql
-- Clear existing mock data
DELETE FROM permits_required WHERE is_mock = true;
DELETE FROM dimensional_standards WHERE is_mock = true;
DELETE FROM permitted_uses WHERE is_mock = true;
DELETE FROM zoning_districts WHERE is_mock = true;

-- Then re-run seed scripts (02-06)
```

### Issue: Slow Queries

**Solution:**
```sql
-- Ensure indexes exist
CREATE INDEX IF NOT EXISTS idx_zoning_districts_geometry ON zoning_districts USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_permitted_uses_zoning_id ON permitted_uses(zoning_id);
CREATE INDEX IF NOT EXISTS idx_dimensional_standards_zoning_id ON dimensional_standards(zoning_id);

-- Analyze tables
VACUUM ANALYZE zoning_districts;
VACUUM ANALYZE permitted_uses;
VACUUM ANALYZE dimensional_standards;
```

---

## 🔐 Security: Row-Level Security (RLS)

The Build Blueprint includes RLS policies. To implement them:

```sql
-- Enable RLS on tables
ALTER TABLE zoning_districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE permitted_uses ENABLE ROW LEVEL SECURITY;

-- Public read access (zoning data is public)
CREATE POLICY "Zoning districts are public"
  ON zoning_districts FOR SELECT
  USING (true);

CREATE POLICY "Permitted uses are public"
  ON permitted_uses FOR SELECT
  USING (true);

-- Only admins can modify (create service role policy)
CREATE POLICY "Only service role can modify zoning"
  ON zoning_districts FOR ALL
  USING (auth.jwt()->>'role' = 'service_role');
```

---

## 📈 Performance Optimization

### Recommended Indexes

```sql
-- Spatial indexes (most important!)
CREATE INDEX IF NOT EXISTS idx_zoning_geom ON zoning_districts USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_flood_zones_geom ON flood_zones USING GIST(geom);

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_permitted_uses_zoning_id ON permitted_uses(zoning_id);
CREATE INDEX IF NOT EXISTS idx_dimensional_standards_zoning_id ON dimensional_standards(zoning_id);
CREATE INDEX IF NOT EXISTS idx_permits_required_zoning_id ON permits_required(zoning_id);

-- Filter indexes
CREATE INDEX IF NOT EXISTS idx_zoning_mock ON zoning_districts(is_mock);
CREATE INDEX IF NOT EXISTS idx_zoning_county ON zoning_districts(county, municipality);
CREATE INDEX IF NOT EXISTS idx_permitted_uses_status ON permitted_uses(status);

-- Test address indexes
CREATE INDEX IF NOT EXISTS idx_test_addresses_city ON test_addresses(city);
CREATE INDEX IF NOT EXISTS idx_test_addresses_zone ON test_addresses(expected_zone_code);
```

### Query Performance Targets

- **Zone lookup by coordinates:** < 50ms
- **Permitted uses for zone:** < 20ms
- **Full property details:** < 200ms
- **Test address queries:** < 10ms

---

## 🎯 Next Steps

After database setup:

1. **Test API Integration**
   - Create `/api/search.ts` endpoint
   - Test with sample addresses from `test_addresses` table

2. **Integrate FEMA Flood Data**
   - Follow `07-fema-flood-zones-integration.md`
   - Download and import real flood zone data

3. **Build Frontend Components**
   - Search bar with address autocomplete
   - Results display with zoning info
   - PDF export functionality

4. **Plan for Real Data Migration**
   - See `/docs/MOCK-DATA-SOURCES.md`
   - Contact county planning offices
   - Set up data update schedules

---

## 📞 Questions?

If you encounter issues:

1. **Check logs:** Supabase Dashboard → Database → Logs
2. **Verify PostGIS:** `SELECT PostGIS_Version();`
3. **Check table counts:** See "Verify Installation" section above
4. **Review docs:** See `/docs/MOCK-DATA-SOURCES.md`

---

## ✅ Completion Checklist

- [ ] Executed `01-schema-updates.sql` successfully
- [ ] Executed `02-seed-zoning-districts.sql` (27 zones created)
- [ ] Executed `03-seed-permitted-uses.sql` (100+ uses created)
- [ ] Executed `04-seed-dimensional-standards.sql` (27 standards created)
- [ ] Executed `05-seed-permits-required.sql` (80+ permits created)
- [ ] Executed `06-seed-sample-addresses.sql` (25+ addresses created)
- [ ] Verified all counts match expected values
- [ ] Tested geographic queries (find_zoning_at_point function works)
- [ ] Tested permitted uses lookups
- [ ] Reviewed performance (queries < 200ms)
- [ ] Read FEMA integration guide
- [ ] Reviewed mock data documentation

---

**Database Version:** 1.0 (Mock Data)  
**Last Updated:** December 11, 2025  
**Next Review:** After real county data integration

