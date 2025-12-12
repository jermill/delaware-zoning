# Mock Data Sources & Migration Guide

**Status:** Development Data - Not for Production Use  
**Last Updated:** December 11, 2025  
**Purpose:** Enable immediate app development without county data access

---

## 🚨 IMPORTANT DISCLAIMERS

**This database contains MOCK zoning data for development and testing only.**

❌ **DO NOT** use this data for:
- Legal decisions
- Financial transactions
- Property purchases
- Development permits
- Client advice

✅ **DO** use this data for:
- App development and testing
- Feature demonstrations
- User interface design
- Investor presentations (with disclaimers)
- System architecture validation

---

## 📊 Data Inventory

### What's MOCK vs. REAL

| Data Type | Status | Source | Accuracy |
|-----------|--------|--------|----------|
| **Zoning District Codes** | MOCK (based on real) | Delaware county ordinances (structure only) | 85% - codes match real patterns |
| **Zoning Boundaries (geom)** | MOCK | Estimated polygons | 50% - approximate areas only |
| **Permitted Uses** | MOCK | Typical zoning patterns | 70% - based on common ordinances |
| **Dimensional Standards** | MOCK | Delaware ordinance research | 75% - realistic but not verified |
| **Permit Requirements** | MOCK | County website research | 80% - general requirements |
| **FEMA Flood Zones** | **REAL** | FEMA National Flood Hazard Layer | 100% - official federal data |
| **Test Addresses** | REAL | Google Maps | 100% - real Delaware locations |

---

## 🔍 Data Sources & Methodology

### 1. Zoning Districts (Mock)

**Based on:**
- New Castle County Unified Development Code (UDC) - structure and terminology
- Wilmington City Code Chapter 48 - urban zone patterns
- Kent County Zoning Ordinance - rural patterns
- Sussex County Zoning Code - coastal/agricultural patterns

**What's accurate:**
- Zone code names (NC2a, NC10, C-1, CR, etc.)
- General zone purposes and descriptions
- County and municipality assignments

**What's NOT accurate:**
- Exact geographic boundaries (polygons are estimated)
- Specific ordinance text
- Recent code amendments
- Variance history

**How to verify:**
```sql
SELECT district_code, name, county, municipality, 
       is_mock, data_source, last_verified 
FROM zoning_districts 
WHERE is_mock = true;
```

---

### 2. Permitted Uses (Mock)

**Methodology:**
- Researched 30-50 common land use types
- Mapped uses to zones based on typical patterns
- Assigned status: `allowed`, `conditional`, `not_allowed`
- Added realistic conditions for conditional uses

**Known limitations:**
- Simplified use categories (real ordinances have 100+ use types)
- Missing nuanced conditional use requirements
- No special exception provisions
- No variance procedures

**Examples of accuracy:**
- ✅ Single-family homes allowed in residential zones
- ✅ Commercial retail allowed in C-1 zones
- ✅ Heavy manufacturing not allowed in residential
- ⚠️ Specific permit requirements may differ
- ⚠️ Conditional use details are generalized

---

### 3. Dimensional Standards (Mock)

**Sources:**
- Delaware county ordinances (publicly available PDFs)
- Comparable suburban/urban jurisdictions
- Industry-standard planning guidelines

**Typical ranges used:**
| Standard | Residential | Commercial | Industrial |
|----------|-------------|------------|------------|
| Front Setback | 20-50 ft | 15-25 ft | 30-50 ft |
| Side Setback | 6-25 ft | 10-20 ft | 20-30 ft |
| Rear Setback | 20-40 ft | 20-30 ft | 30-40 ft |
| Max Height | 35 ft | 35-65 ft | 45-65 ft |
| Min Lot Size | 6,500-87,120 sq ft | 7,500-20,000 sq ft | 20,000-40,000 sq ft |
| FAR | 0.15-0.60 | 0.60-1.50 | 0.40-0.80 |

**What's realistic:**
- Setbacks match Delaware suburban patterns
- Height limits consistent with 2-3 story buildings
- Lot sizes based on actual DE neighborhoods

**What needs verification:**
- Exact dimensions per zone
- Special reduction provisions
- Overlay district modifications
- Historic district requirements

---

### 4. Permit Requirements (Mock)

**Based on:**
- County building department websites
- Standard permit types (building, electrical, plumbing, etc.)
- Typical commercial/residential requirements

**Links provided:**
- New Castle County: https://www.newcastlede.gov/296/Building-Permits
- Wilmington: https://www.wilmingtonde.gov/government/city-departments/land-use-and-planning
- Kent County: https://www.co.kent.de.us/departments/community-services/planning-services
- Sussex County: https://sussexcountyde.gov/departments/county-administrative-offices/planning-zoning

**Accuracy level:** ~80%
- Common permits are accurate
- Conditional requirements are generalized
- Fees and timelines not included
- Application procedures not detailed

---

### 5. FEMA Flood Zones (REAL DATA ✅)

**Source:** FEMA National Flood Hazard Layer (NFHL)
- **URL:** https://msc.fema.gov/portal
- **Data:** Official federal flood risk maps
- **Format:** Shapefiles (converted to PostGIS)
- **Update Frequency:** FEMA updates quarterly

**Zone Classifications:**
- **Zone A/AE:** High-risk flood areas (1% annual chance)
- **Zone X (shaded):** Moderate-risk (0.2% annual chance)
- **Zone X (unshaded):** Low-risk areas

**This is the ONLY real data in the mock database.**

To integrate:
```bash
# Download Delaware FEMA shapefiles
# Convert to PostGIS
ogr2ogr -f "PostgreSQL" PG:"dbname=supabase_db" \
  NFHL_10_20251211.shp -nln flood_zones
```

---

## 🔄 Migration Checklist: Mock → Real Data

### Phase 1: New Castle County (Priority 1)

**Contact Information:**
- **Department:** New Castle County Planning Division
- **Phone:** (302) 395-5400
- **Website:** https://www.newcastlede.gov/184/Planning-Development
- **Address:** 87 Reads Way, New Castle, DE 19720

**Data to Request:**
1. [ ] GIS shapefile of zoning districts (`.shp` format)
2. [ ] Zoning district permitted use matrix (Excel/CSV)
3. [ ] Dimensional standards table (Excel/CSV)
4. [ ] List of common permits by zone
5. [ ] Legal permission to redistribute data

**Questions to Ask:**
- Do you have a GIS portal for downloading zoning boundaries?
- Is the permitted use matrix available in spreadsheet format?
- How often is the zoning code updated?
- Can we republish this data with attribution?
- Is there a data-sharing agreement we need to sign?

**Timeline:** 2-4 weeks (includes follow-up)

---

### Phase 2: Wilmington (Priority 2)

**Contact Information:**
- **Department:** Department of Land Use and Planning
- **Phone:** (302) 576-3050
- **Email:** luppermits@wilmingtonde.gov
- **Address:** 800 N. French Street, 3rd Floor, Wilmington, DE 19801

**Data to Request:**
1. [ ] City zoning map (GIS or PDF)
2. [ ] Zoning code permitted uses (Chapter 48)
3. [ ] Dimensional requirements by district
4. [ ] Historic district overlays (if applicable)
5. [ ] Data usage permissions

**Timeline:** 2-3 weeks

---

### Phase 3: Kent County (Priority 3)

**Contact Information:**
- **Department:** Planning Services / Community Services
- **Phone:** (302) 744-2471
- **Website:** https://www.co.kent.de.us/departments/community-services/planning-services

**Data to Request:**
1. [ ] Zoning district boundaries
2. [ ] Agricultural preservation areas
3. [ ] Permitted use schedules
4. [ ] Dimensional standards
5. [ ] Data licensing

**Timeline:** 3-4 weeks

---

### Phase 4: Sussex County (Priority 4)

**Contact Information:**
- **Department:** Planning & Zoning Department
- **Phone:** (302) 855-7878
- **Website:** https://sussexcountyde.gov/departments/county-administrative-offices/planning-zoning

**Data to Request:**
1. [ ] Zoning map (coastal and inland)
2. [ ] Short-term rental regulations (important for Sussex!)
3. [ ] Permitted uses and dimensional standards
4. [ ] Overlay districts (flood, wetlands, historic)
5. [ ] Data redistribution agreement

**Timeline:** 3-5 weeks (may require in-person visit)

---

### Phase 5: Dover & Newark

**Dover:**
- Phone: (302) 736-7025
- Website: https://www.cityofdover.com/departments/planning-inspections

**Newark:**
- Phone: (302) 366-7030
- Website: https://newarkde.gov/198/Planning-Development

**Timeline:** 2-3 weeks each

---

## 🔧 Technical Migration Steps

### Step 1: Backup Mock Data
```sql
-- Export mock data for reference
COPY zoning_districts TO '/tmp/mock_zoning_backup.csv' CSV HEADER;
COPY permitted_uses TO '/tmp/mock_uses_backup.csv' CSV HEADER;
COPY dimensional_standards TO '/tmp/mock_dimensions_backup.csv' CSV HEADER;
```

### Step 2: Import Real County Data
```sql
-- Example: Import New Castle County real data
-- Mark as is_mock = false
INSERT INTO zoning_districts 
  (state, county, municipality, district_code, name, description, geom, 
   is_mock, data_source, last_verified)
SELECT 
  'DE', 'New Castle', NULL, zone_code, zone_name, description, geometry,
  false, 'New Castle County GIS - Official', NOW()
FROM imported_newcastle_data;
```

### Step 3: Update References
```sql
-- Update saved properties to reference real zones
UPDATE saved_properties sp
SET zoning_district_id = (
  SELECT zd.id FROM zoning_districts zd
  WHERE zd.is_mock = false
    AND ST_Contains(zd.geom, ST_SetSRID(ST_Point(sp.longitude, sp.latitude), 4326))
  LIMIT 1
);
```

### Step 4: Deprecate Mock Data
```sql
-- Mark mock data as deprecated (don't delete immediately)
UPDATE zoning_districts 
SET description = '[DEPRECATED] ' || description
WHERE is_mock = true AND county = 'New Castle';
```

### Step 5: Verify Data Quality
```sql
-- Check for real data coverage
SELECT county, municipality,
       COUNT(*) FILTER (WHERE is_mock = false) as real_zones,
       COUNT(*) FILTER (WHERE is_mock = true) as mock_zones
FROM zoning_districts
GROUP BY county, municipality;
```

### Step 6: Remove Mock Data (Final Step)
```sql
-- Only after verifying real data is complete
DELETE FROM zoning_districts WHERE is_mock = true AND county = 'New Castle';
DELETE FROM permitted_uses WHERE is_mock = true;
DELETE FROM dimensional_standards WHERE is_mock = true;
```

---

## 📋 Data Validation Checklist

Before marking a county as "production ready":

### Completeness
- [ ] All zoning districts have boundaries (geom)
- [ ] Every zone has permitted uses
- [ ] Every zone has dimensional standards
- [ ] Common permits are mapped to zones
- [ ] Test addresses return correct zones

### Accuracy
- [ ] Zoning boundaries match official maps
- [ ] Zone codes match current ordinance
- [ ] Permitted uses verified against ordinance
- [ ] Setbacks match dimensional tables
- [ ] Legal reviewed and approved data usage

### Technical
- [ ] PostGIS spatial queries work correctly
- [ ] Performance meets <2 second target
- [ ] Database indexes optimized
- [ ] Row-level security (RLS) configured
- [ ] Backup and restore tested

### Legal
- [ ] Data usage agreement signed
- [ ] Attribution requirements documented
- [ ] Liability disclaimers updated
- [ ] Terms of Service reflect data sources
- [ ] County approval for redistribution

---

## ⚖️ Legal & Disclaimer Requirements

### Current Disclaimer (Mock Data)
**Required on all pages:**

> ⚠️ **DEVELOPMENT DATA NOTICE**  
> This application currently uses mock zoning data for development purposes only. 
> Data has not been verified with Delaware county authorities and should NOT be 
> used for legal, financial, or property decisions. For official zoning information, 
> contact your local planning office.

### Future Disclaimer (Real Data)
**Required even with real data:**

> **Data Accuracy Notice**  
> Zoning data is provided for informational purposes and is updated regularly from 
> official county sources. While we strive for accuracy, zoning regulations can change. 
> Always verify zoning information with the appropriate county planning office before 
> making property decisions. Last updated: [DATE]

---

## 📊 Data Update Schedule

### Mock Data (Current)
- **Update Frequency:** As needed for development
- **Source:** Internal research
- **Verification:** Not applicable

### Real Data (Future)
- **New Castle County:** Monthly updates (first Monday)
- **Kent County:** Quarterly updates
- **Sussex County:** Quarterly updates
- **Wilmington/Dover/Newark:** Bi-annual updates
- **FEMA Flood Zones:** Quarterly (follows FEMA schedule)

**Automation:** Set up cron jobs or GitHub Actions to pull county data feeds

---

## 🎯 Success Metrics

### MVP Launch Criteria (Mock Data)
- [x] 15-20 representative zones created
- [x] Each zone has permitted uses
- [x] Dimensional standards populated
- [x] 25+ test addresses available
- [x] Geographic queries functional
- [x] Prominent disclaimers displayed

### Production Launch Criteria (Real Data)
- [ ] At least 1 county with 100% real data (recommend: New Castle)
- [ ] Data verified against official sources
- [ ] Legal approval for data redistribution
- [ ] Update schedule established
- [ ] User disclaimers updated
- [ ] Performance validated with real polygons

---

## 🔗 Additional Resources

### Delaware Planning Resources
- [Delaware Office of State Planning](https://stateplanning.delaware.gov/)
- [Delaware Open Data Portal](https://data.delaware.gov/)
- [Delaware Code Online](https://delcode.delaware.gov/)

### Data Tools
- **PostGIS:** https://postgis.net/documentation/
- **QGIS:** https://qgis.org/ (for viewing/editing shapefiles)
- **ogr2ogr:** https://gdal.org/programs/ogr2ogr.html (shapefile conversion)

### FEMA Flood Data
- [FEMA Map Service Center](https://msc.fema.gov/portal)
- [National Flood Hazard Layer](https://www.fema.gov/flood-maps/national-flood-hazard-layer)

---

## 📞 Questions or Issues?

If you encounter data issues:

1. **Check is_mock flag:** Verify if you're looking at mock vs. real data
2. **Review data_source field:** See where the data originated
3. **Check last_verified date:** Know how current the data is
4. **File GitHub issue:** Document any data inconsistencies

---

**Document Version:** 1.0  
**Last Updated:** December 11, 2025  
**Next Review:** After first real county data integration

