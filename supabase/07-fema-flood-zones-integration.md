# FEMA Flood Zone Integration Guide

**Data Type:** REAL DATA (Not Mock)  
**Source:** FEMA National Flood Hazard Layer (NFHL)  
**Status:** Public Domain - Free to Use  
**Last Updated:** December 11, 2025

---

## 🎯 Overview

FEMA (Federal Emergency Management Agency) provides official flood risk data for the entire United States. This is **real, authoritative data** that can be integrated immediately into the Delaware Zoning app at no cost.

**Why FEMA Data is Important:**
- Realtors need to disclose flood risk to buyers
- Developers need to assess flood insurance requirements
- Pro tier users expect dimensional data + risk assessments
- It's FREE and regularly updated by the federal government

---

## 📥 Step 1: Download Delaware FEMA Data

### Option A: FEMA Map Service Center (Recommended)

1. **Visit:** https://msc.fema.gov/portal/home
2. **Search for:** "Delaware" or specific county
3. **Select:** "National Flood Hazard Layer (NFHL)"
4. **Download Format:** Shapefile (`.shp`)
5. **File Size:** ~200-500 MB for Delaware

### Option B: FEMA Data Distribution System

1. **Visit:** https://hazards-fema.maps.arcgis.com/apps/MapSeries/index.html?appid=28b3273d1f7d4e27a02ac4e06c96d3c5
2. **Navigate to:** Delaware (FIPS Code: 10)
3. **Download:** Complete NFHL dataset

### Option C: Command Line (Advanced)

```bash
# Using wget to download Delaware NFHL
wget https://hazards.fema.gov/nfhlv2/output/State/NFHL_10_20251211.zip

# Unzip the file
unzip NFHL_10_20251211.zip -d delaware_fema/
```

---

## 📊 Understanding FEMA Flood Zones

### Zone Classifications

| Zone Code | Flood Risk | Description | Insurance Required? |
|-----------|------------|-------------|---------------------|
| **A** | High Risk | 1% annual chance (100-year floodplain) | Yes (if federally backed mortgage) |
| **AE** | High Risk | 1% annual chance with base flood elevations | Yes |
| **AO** | High Risk | Sheet flow flooding (1-3 feet) | Yes |
| **AH** | High Risk | Ponding areas (1-3 feet) | Yes |
| **VE** | High Risk | Coastal areas with wave action | Yes (higher rates) |
| **X (shaded)** | Moderate Risk | 0.2% annual chance (500-year flood) | No (but recommended) |
| **X (unshaded)** | Low Risk | Minimal flood hazard | No |
| **D** | Undetermined | No analysis performed | No |

### What Users Care About

**Sarah (Realtor):**
- "Is this property in a flood zone?" (Yes/No)
- "Will my buyer need flood insurance?" (If Zone A/AE/VE)

**Marcus (Developer):**
- Detailed flood risk assessment
- Base flood elevation (BFE) data
- Flood insurance costs (affects ROI)

**Jennifer (Architect):**
- Elevation requirements for building design
- Foundation requirements
- Floodproofing specifications

---

## 🔧 Step 2: Convert Shapefile to PostGIS

### Prerequisites

Install GDAL (includes ogr2ogr):

```bash
# macOS
brew install gdal

# Ubuntu/Debian
sudo apt-get install gdal-bin

# Verify installation
ogr2ogr --version
```

### Import to Supabase

**Method 1: Direct Import (if you have Supabase connection)**

```bash
# Set your Supabase connection string
export SUPABASE_DB="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Import Delaware FEMA flood zones
ogr2ogr -f "PostgreSQL" \
  PG:"$SUPABASE_DB" \
  delaware_fema/S_FLD_HAZ_AR.shp \
  -nln flood_zones_raw \
  -lco GEOMETRY_NAME=geom \
  -lco FID=fid \
  -lco SPATIAL_INDEX=GIST \
  -t_srs EPSG:4326
```

**Method 2: Convert to SQL (upload via Supabase dashboard)**

```bash
# Convert shapefile to SQL
ogr2ogr -f "PGDUMP" \
  delaware_fema_import.sql \
  delaware_fema/S_FLD_HAZ_AR.shp \
  -lco GEOMETRY_NAME=geom \
  -lco SPATIAL_INDEX=GIST \
  -t_srs EPSG:4326

# Upload delaware_fema_import.sql via Supabase SQL editor
```

---

## 📝 Step 3: Transform FEMA Data to Our Schema

Once imported, transform the raw FEMA data to match our `flood_zones` table:

```sql
-- ========================================
-- TRANSFORM FEMA DATA TO FLOOD_ZONES TABLE
-- ========================================

-- Insert transformed FEMA data into our flood_zones table
INSERT INTO flood_zones (
  fema_zone, 
  flood_risk, 
  zone_description, 
  geom, 
  data_source,
  last_updated
)
SELECT 
  FLD_ZONE as fema_zone,
  CASE 
    WHEN FLD_ZONE IN ('A', 'AE', 'AO', 'AH', 'VE', 'V') THEN 'High Risk'
    WHEN FLD_ZONE LIKE 'X%' AND ZONE_SUBTY = '0.2 PCT ANNUAL CHANCE FLOOD HAZARD' THEN 'Moderate Risk'
    WHEN FLD_ZONE LIKE 'X%' THEN 'Low Risk'
    ELSE 'Undetermined'
  END as flood_risk,
  CASE 
    WHEN FLD_ZONE = 'A' THEN 'Special Flood Hazard Area - 1% annual chance'
    WHEN FLD_ZONE = 'AE' THEN 'Special Flood Hazard Area with Base Flood Elevations'
    WHEN FLD_ZONE = 'VE' THEN 'Coastal High Hazard Area with wave action'
    WHEN FLD_ZONE = 'X' AND ZONE_SUBTY = '0.2 PCT ANNUAL CHANCE FLOOD HAZARD' THEN 'Moderate flood hazard - 0.2% annual chance'
    WHEN FLD_ZONE = 'X' THEN 'Minimal flood hazard'
    ELSE CONCAT('Flood Zone ', FLD_ZONE)
  END as zone_description,
  ST_Transform(geom, 4326) as geom,
  'FEMA National Flood Hazard Layer' as data_source,
  NOW() as last_updated
FROM flood_zones_raw
WHERE STATE = 'DE';  -- Filter to Delaware only

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_flood_zones_geom ON flood_zones USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_flood_zones_fema_zone ON flood_zones(fema_zone);
CREATE INDEX IF NOT EXISTS idx_flood_zones_risk ON flood_zones(flood_risk);

-- Verify import
SELECT fema_zone, flood_risk, COUNT(*) 
FROM flood_zones 
GROUP BY fema_zone, flood_risk 
ORDER BY flood_risk, fema_zone;
```

---

## 🧪 Step 4: Test Flood Zone Lookups

### Test Query 1: Find flood zone at a point

```sql
-- Test: Rehoboth Beach (coastal area - likely VE or AE)
SELECT fema_zone, flood_risk, zone_description
FROM find_flood_zone_at_point(38.7209, -75.0760);

-- Expected: Zone VE or AE (coastal high hazard)

-- Test: Dover (inland - likely X)
SELECT fema_zone, flood_risk, zone_description
FROM find_flood_zone_at_point(39.1582, -75.5244);

-- Expected: Zone X (minimal flood hazard)
```

### Test Query 2: Find properties in high-risk zones

```sql
-- Find all test addresses in high-risk flood areas
SELECT ta.address, ta.city, 
       fz.fema_zone, fz.flood_risk
FROM test_addresses ta
CROSS JOIN LATERAL (
  SELECT fema_zone, flood_risk
  FROM flood_zones
  WHERE ST_Contains(geom, ST_SetSRID(ST_Point(ta.longitude, ta.latitude), 4326))
  LIMIT 1
) fz
WHERE fz.flood_risk = 'High Risk';
```

### Test Query 3: Combined zoning + flood zone lookup

```sql
-- Get both zoning AND flood zone for an address
WITH location AS (
  SELECT 39.7209 as lat, -75.0760 as lon  -- Rehoboth Beach example
)
SELECT 
  -- Zoning info
  zd.district_code, 
  zd.name as zone_name,
  zd.county,
  -- Flood zone info
  fz.fema_zone,
  fz.flood_risk,
  fz.zone_description
FROM location l
LEFT JOIN zoning_districts zd ON ST_Contains(zd.geom, ST_SetSRID(ST_Point(l.lon, l.lat), 4326))
LEFT JOIN flood_zones fz ON ST_Contains(fz.geom, ST_SetSRID(ST_Point(l.lon, l.lat), 4326));
```

---

## 🚀 Step 5: Integrate into API

### Update `/api/search.ts` to include flood data

```typescript
// Add flood zone lookup to search results
const searchResult = {
  address: address,
  zoning: {
    zoneCode: zoneData.district_code,
    zoneName: zoneData.name,
    county: zoneData.county,
    municipality: zoneData.municipality,
  },
  floodZone: {
    femaZone: floodData.fema_zone,
    floodRisk: floodData.flood_risk,
    description: floodData.zone_description,
    insuranceRequired: ['A', 'AE', 'AO', 'AH', 'VE', 'V'].includes(floodData.fema_zone),
  },
  permittedUses: [...],
  dimensionalStandards: {...},
};
```

### Update PDF Export to include flood data

Add a "Flood Risk" section to the PDF:

```
FLOOD RISK ASSESSMENT
─────────────────────
FEMA Zone: AE
Risk Level: High Risk (1% annual chance)
Flood Insurance: Required for federally backed mortgages

Base Flood Elevation: [if available]
Data Source: FEMA National Flood Hazard Layer
Last Updated: December 11, 2025
```

---

## 📊 Data Quality & Maintenance

### Data Freshness

FEMA updates the NFHL:
- **Major updates:** Every 5-10 years (full county remapping)
- **Minor updates:** Quarterly (letter of map amendments)

**Recommended update schedule:** Quarterly

### Automate Updates (Optional)

```bash
# Create a cron job to check for FEMA updates
# /etc/cron.d/fema-updates

# Every 3 months on the 1st at 2 AM
0 2 1 */3 * /usr/local/bin/update-fema-data.sh
```

**update-fema-data.sh:**
```bash
#!/bin/bash
# Check FEMA website for new Delaware data
# Download if newer than current version
# Import to Supabase
# Send notification email

CURRENT_VERSION="20251211"
LATEST_VERSION=$(curl -s https://hazards.fema.gov/nfhlv2/output/State/ | grep "NFHL_10_" | tail -1 | sed 's/.*NFHL_10_\([0-9]*\).*/\1/')

if [ "$LATEST_VERSION" != "$CURRENT_VERSION" ]; then
  echo "New FEMA data available: $LATEST_VERSION"
  # Download and import
  # ... (automation script)
fi
```

---

## ⚖️ Legal & Attribution

### FEMA Data Usage

✅ **Public Domain** - No restrictions
- No license required
- Free to redistribute
- No attribution legally required (but recommended)

### Recommended Attribution

Add to your Terms of Service:

> Flood zone data is provided by the Federal Emergency Management Agency (FEMA) 
> National Flood Hazard Layer. For official flood determinations, consult FEMA 
> directly at https://msc.fema.gov.

### Disclaimer

> Flood zone data is provided for informational purposes. Property owners should 
> obtain an official Flood Zone Determination from a qualified surveyor or lender 
> for insurance and regulatory purposes.

---

## 🎯 Success Metrics

After integration:

- [ ] FEMA data successfully imported to Supabase
- [ ] `find_flood_zone_at_point()` function works
- [ ] Test addresses return correct flood zones
- [ ] API includes flood data in search results
- [ ] PDF export displays flood risk
- [ ] UI shows flood zone prominently
- [ ] Performance: flood lookup adds <100ms to query time

---

## 🐛 Troubleshooting

### Issue: Shapefile won't import

**Solution:**
```bash
# Check shapefile validity
ogrinfo -al delaware_fema/S_FLD_HAZ_AR.shp | head -20

# Try simplifying geometry
ogr2ogr -simplify 0.0001 delaware_simple.shp delaware_fema/S_FLD_HAZ_AR.shp
```

### Issue: PostGIS errors

**Solution:**
```sql
-- Verify PostGIS is installed
SELECT PostGIS_Version();

-- If not installed
CREATE EXTENSION IF NOT EXISTS postgis;
```

### Issue: Slow queries

**Solution:**
```sql
-- Ensure spatial index exists
CREATE INDEX IF NOT EXISTS idx_flood_zones_geom 
  ON flood_zones USING GIST(geom);

-- Vacuum and analyze
VACUUM ANALYZE flood_zones;
```

---

## 📞 FEMA Support

If you need help with FEMA data:

- **FEMA Map Service Center:** 1-877-336-2627
- **Email:** FEMAMapSpecialist@riskmapcds.com
- **Website:** https://msc.fema.gov/portal/home

---

## ✅ Checklist

- [ ] Downloaded Delaware FEMA NFHL data
- [ ] Installed GDAL/ogr2ogr
- [ ] Converted shapefile to PostGIS
- [ ] Transformed data to flood_zones table
- [ ] Created spatial indexes
- [ ] Tested flood zone lookups
- [ ] Updated API to include flood data
- [ ] Updated PDF export
- [ ] Added UI flood zone display
- [ ] Added legal disclaimer
- [ ] Documented data source and update schedule

---

**Next Steps:**
1. Download FEMA data (15 minutes)
2. Import to Supabase (30 minutes)
3. Test queries (15 minutes)
4. Update API (1-2 hours)
5. Update UI (1-2 hours)

**Total time:** 4-6 hours for complete integration

---

**Document Version:** 1.0  
**Last Updated:** December 11, 2025  
**Data Source:** FEMA NFHL (Public Domain)

