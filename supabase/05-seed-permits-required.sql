-- ========================================
-- SEED SCRIPT: PERMITS REQUIRED
-- ========================================
-- Common permits required for different zoning districts
-- Links to county permit application pages

-- ========== RESIDENTIAL ZONE PERMITS ==========

-- NC2a, NC40, NC15, NC10, NC6.5 (All Residential Zones)
INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Building Permit', true, false, 
 'Required for new construction, additions, and structural modifications',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts 
WHERE district_code IN ('NC2a', 'NC40', 'NC15', 'NC10', 'NC6.5');

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Electrical Permit', true, false, 
 'Required for electrical work including new service, panels, and wiring',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts 
WHERE district_code IN ('NC2a', 'NC40', 'NC15', 'NC10', 'NC6.5');

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Plumbing Permit', true, false, 
 'Required for plumbing installations, water lines, and septic systems',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts 
WHERE district_code IN ('NC2a', 'NC40', 'NC15', 'NC10', 'NC6.5');

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Mechanical Permit', false, true, 
 'Required for HVAC installation or modification',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts 
WHERE district_code IN ('NC2a', 'NC40', 'NC15', 'NC10', 'NC6.5');

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Demolition Permit', false, true, 
 'Required for demolition of structures',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts 
WHERE district_code IN ('NC2a', 'NC40', 'NC15', 'NC10', 'NC6.5');

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Fence Permit', false, true, 
 'May be required for fences over 6 feet or in front yard',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts 
WHERE district_code IN ('NC2a', 'NC40', 'NC15', 'NC10', 'NC6.5');

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Pool Permit', false, true, 
 'Required for swimming pools and hot tubs',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts 
WHERE district_code IN ('NC2a', 'NC40', 'NC15', 'NC10', 'NC6.5');

-- ========== COMMERCIAL ZONE PERMITS ==========

-- C-1 (Community Commercial)
INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Building Permit', true, false, 
 'Required for all commercial construction and tenant improvements',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Site Plan Review', true, false, 
 'Required for new commercial development and major modifications',
 'https://www.newcastlede.gov/184/Planning-Development', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Sign Permit', true, false, 
 'Required for new signs or changes to existing signage',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Fire Marshal Approval', true, false, 
 'Required for commercial occupancy and fire safety systems',
 'https://www.newcastlede.gov/175/Fire-Marshal', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Health Department Approval', false, true, 
 'Required for food service establishments',
 'https://www.newcastlede.gov/health', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Stormwater Management Permit', true, false, 
 'Required for developments with impervious surface',
 'https://www.newcastlede.gov/184/Planning-Development', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Conditional Use Permit', false, true, 
 'Required for certain uses like gas stations',
 'https://www.newcastlede.gov/184/Planning-Development', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

-- CR (Commercial Regional)
INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Building Permit', true, false, 
 'Required for all commercial construction',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts WHERE district_code = 'CR';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Major Site Plan Review', true, false, 
 'Required for large-scale commercial development',
 'https://www.newcastlede.gov/184/Planning-Development', true
FROM zoning_districts WHERE district_code = 'CR';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Traffic Impact Study', true, false, 
 'Required for developments generating significant traffic',
 'https://www.newcastlede.gov/184/Planning-Development', true
FROM zoning_districts WHERE district_code = 'CR';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Sign Permit', true, false, 
 'Required for all commercial signage',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts WHERE district_code = 'CR';

-- ========== INDUSTRIAL ZONE PERMITS ==========

-- LI (Light Industrial)
INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Building Permit', true, false, 
 'Required for all industrial construction',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts WHERE district_code = 'LI';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Site Plan Review', true, false, 
 'Required for industrial development',
 'https://www.newcastlede.gov/184/Planning-Development', true
FROM zoning_districts WHERE district_code = 'LI';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Environmental Review', false, true, 
 'May be required depending on operations and materials',
 'https://dnrec.delaware.gov/', true
FROM zoning_districts WHERE district_code = 'LI';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Stormwater Management Permit', true, false, 
 'Required for industrial sites',
 'https://www.newcastlede.gov/184/Planning-Development', true
FROM zoning_districts WHERE district_code = 'LI';

-- HI (Heavy Industrial)
INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Building Permit', true, false, 
 'Required for all industrial construction',
 'https://www.newcastlede.gov/296/Building-Permits', true
FROM zoning_districts WHERE district_code = 'HI';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Environmental Impact Assessment', true, false, 
 'Required for heavy industrial operations',
 'https://dnrec.delaware.gov/', true
FROM zoning_districts WHERE district_code = 'HI';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Air Quality Permit', false, true, 
 'Required for operations with emissions',
 'https://dnrec.delaware.gov/', true
FROM zoning_districts WHERE district_code = 'HI';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Hazardous Materials Storage Permit', false, true, 
 'Required if storing hazardous materials',
 'https://dnrec.delaware.gov/', true
FROM zoning_districts WHERE district_code = 'HI';

-- ========== WILMINGTON CITY PERMITS ==========

-- All Wilmington zones
INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Building Permit', true, false, 
 'Required for construction within city limits',
 'https://www.wilmingtonde.gov/government/city-departments/land-use-and-planning', true
FROM zoning_districts WHERE municipality = 'Wilmington';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Electrical Permit', true, false, 
 'Required for electrical work',
 'https://www.wilmingtonde.gov/government/city-departments/land-use-and-planning', true
FROM zoning_districts WHERE municipality = 'Wilmington';

-- B-3 (CBD) specific permits
INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Historic District Approval', false, true, 
 'May be required for properties in historic districts',
 'https://www.wilmingtonde.gov/government/city-departments/land-use-and-planning', true
FROM zoning_districts WHERE district_code = 'B-3' AND municipality = 'Wilmington';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Sidewalk Café Permit', false, true, 
 'Required for outdoor dining in public right-of-way',
 'https://www.wilmingtonde.gov/government/city-departments/land-use-and-planning', true
FROM zoning_districts WHERE district_code = 'B-3' AND municipality = 'Wilmington';

-- ========== KENT & SUSSEX COUNTIES ==========

-- Kent County permits
INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Building Permit', true, false, 
 'Required for construction in Kent County',
 'https://www.co.kent.de.us/departments/community-services/planning-services', true
FROM zoning_districts WHERE county = 'Kent' AND municipality IS NULL;

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Septic System Permit', false, true, 
 'Required if not connected to public sewer',
 'https://www.co.kent.de.us/departments/community-services/wastewater', true
FROM zoning_districts WHERE county = 'Kent' AND municipality IS NULL;

-- Sussex County permits
INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Building Permit', true, false, 
 'Required for construction in Sussex County',
 'https://sussexcountyde.gov/departments/county-administrative-offices/planning-zoning', true
FROM zoning_districts WHERE county = 'Sussex';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Subdivision Review', false, true, 
 'Required for dividing land into multiple parcels',
 'https://sussexcountyde.gov/departments/county-administrative-offices/planning-zoning', true
FROM zoning_districts WHERE county = 'Sussex';

-- Dover City permits
INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Building Permit', true, false, 
 'Required for construction within Dover city limits',
 'https://www.cityofdover.com/departments/planning-inspections', true
FROM zoning_districts WHERE municipality = 'Dover';

-- Newark City permits
INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Building Permit', true, false, 
 'Required for construction within Newark city limits',
 'https://newarkde.gov/198/Planning-Development', true
FROM zoning_districts WHERE municipality = 'Newark';

INSERT INTO permits_required (zoning_id, permit_type, required, conditional, description, county_link, is_mock)
SELECT id, 'Special Use Permit', false, true, 
 'Required for student housing near University of Delaware',
 'https://newarkde.gov/198/Planning-Development', true
FROM zoning_districts WHERE district_code = 'RM' AND municipality = 'Newark';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_permits_mock ON permits_required(is_mock);
CREATE INDEX IF NOT EXISTS idx_permits_required_type ON permits_required(permit_type, required);

-- Add comments
COMMENT ON TABLE permits_required IS 'Common permits required by zoning district';
COMMENT ON COLUMN permits_required.required IS 'True if permit is always required';
COMMENT ON COLUMN permits_required.conditional IS 'True if permit is only required under certain conditions';
