-- ========================================
-- SEED SCRIPT: PERMITTED USES
-- ========================================
-- Maps allowed land uses to each zoning district
-- Status: 'allowed', 'conditional', 'not_allowed'

-- Helper: Get zone IDs for reference
-- We'll use district_code to match zones

-- ========== RESIDENTIAL ZONES - PERMITTED USES ==========

-- NC2a (2-acre residential)
INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Single-Family Detached', 'allowed', NULL, 'Primary permitted use', true
FROM zoning_districts WHERE district_code = 'NC2a';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Accessory Dwelling Unit', 'conditional', 'Must meet ADU regulations', 'Subject to size and placement restrictions', true
FROM zoning_districts WHERE district_code = 'NC2a';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Agricultural', 'Farming', 'allowed', NULL, 'Non-commercial farming allowed', true
FROM zoning_districts WHERE district_code = 'NC2a';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Home Occupation', 'conditional', 'Must not alter residential character', 'No external employees, no commercial vehicles', true
FROM zoning_districts WHERE district_code = 'NC2a';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Retail Store', 'not_allowed', NULL, 'Not permitted in residential zones', true
FROM zoning_districts WHERE district_code = 'NC2a';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Multi-Family', 'not_allowed', NULL, 'Only single-family allowed', true
FROM zoning_districts WHERE district_code = 'NC2a';

-- NC10 (10,000 SF residential) - Similar but more urban
INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Single-Family Detached', 'allowed', NULL, 'Primary permitted use', true
FROM zoning_districts WHERE district_code = 'NC10';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Two-Family (Duplex)', 'conditional', 'Requires conditional use permit', 'Subject to parking and design standards', true
FROM zoning_districts WHERE district_code = 'NC10';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Accessory Dwelling Unit', 'allowed', NULL, 'Must meet ADU size limits', true
FROM zoning_districts WHERE district_code = 'NC10';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Institutional', 'Place of Worship', 'conditional', 'Requires conditional use permit', 'Must meet traffic and parking requirements', true
FROM zoning_districts WHERE district_code = 'NC10';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Institutional', 'Daycare Center', 'conditional', 'Requires conditional use permit', 'Limited to specified number of children', true
FROM zoning_districts WHERE district_code = 'NC10';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Short-Term Rental', 'conditional', 'Requires STR permit', 'Maximum 90 days per year, owner must be present', true
FROM zoning_districts WHERE district_code = 'NC10';

-- ========== COMMERCIAL ZONES - PERMITTED USES ==========

-- C-1 (Community Commercial)
INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Retail Store', 'allowed', NULL, 'Up to 10,000 sq ft', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Restaurant', 'allowed', NULL, 'Including fast food with drive-through', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Professional Office', 'allowed', NULL, 'Medical, legal, accounting, etc.', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Bank/Financial Institution', 'allowed', NULL, 'Including ATM facilities', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Personal Service', 'allowed', NULL, 'Hair salon, dry cleaner, repair shop', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Pharmacy', 'allowed', NULL, 'Including convenience items', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Fitness Center/Gym', 'allowed', NULL, 'Subject to parking requirements', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Multi-Family Above Commercial', 'conditional', 'Mixed-use development', 'Residential uses on upper floors only', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Gas Station', 'conditional', 'Requires conditional use permit', 'Must meet environmental and safety standards', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Industrial', 'Manufacturing', 'not_allowed', NULL, 'Not permitted in commercial zones', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

-- CR (Commercial Regional)
INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Shopping Center', 'allowed', NULL, 'Regional shopping facilities', true
FROM zoning_districts WHERE district_code = 'CR';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Big Box Retail', 'allowed', NULL, 'Stores over 50,000 sq ft', true
FROM zoning_districts WHERE district_code = 'CR';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Department Store', 'allowed', NULL, 'Large format retail', true
FROM zoning_districts WHERE district_code = 'CR';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Movie Theater', 'allowed', NULL, 'Entertainment venues', true
FROM zoning_districts WHERE district_code = 'CR';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Hotel', 'allowed', NULL, 'Full-service hotels', true
FROM zoning_districts WHERE district_code = 'CR';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Restaurant/Bar', 'allowed', NULL, 'Full-service and limited-service', true
FROM zoning_districts WHERE district_code = 'CR';

-- ========== INDUSTRIAL ZONES - PERMITTED USES ==========

-- LI (Light Industrial)
INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Industrial', 'Warehouse/Distribution', 'allowed', NULL, 'Storage and distribution facilities', true
FROM zoning_districts WHERE district_code = 'LI';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Industrial', 'Light Manufacturing', 'allowed', NULL, 'Assembly and fabrication', true
FROM zoning_districts WHERE district_code = 'LI';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Industrial', 'Research & Development', 'allowed', NULL, 'Laboratory and research facilities', true
FROM zoning_districts WHERE district_code = 'LI';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Wholesale Trade', 'allowed', NULL, 'Wholesale distribution', true
FROM zoning_districts WHERE district_code = 'LI';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Vehicle Repair', 'allowed', NULL, 'Auto repair and service', true
FROM zoning_districts WHERE district_code = 'LI';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Industrial', 'Heavy Manufacturing', 'not_allowed', NULL, 'Requires Heavy Industrial zone', true
FROM zoning_districts WHERE district_code = 'LI';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Any Residential', 'not_allowed', NULL, 'Not permitted in industrial zones', true
FROM zoning_districts WHERE district_code = 'LI';

-- ========== WILMINGTON CITY ZONES ==========

-- R-2 (Low-Density Residential)
INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Single-Family Detached', 'allowed', NULL, 'Primary use', true
FROM zoning_districts WHERE district_code = 'R-2' AND municipality = 'Wilmington';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Two-Family (Duplex)', 'allowed', NULL, 'By right in this zone', true
FROM zoning_districts WHERE district_code = 'R-2' AND municipality = 'Wilmington';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Institutional', 'Place of Worship', 'conditional', 'Requires special permit', 'Subject to design review', true
FROM zoning_districts WHERE district_code = 'R-2' AND municipality = 'Wilmington';

-- R-5 (Medium-Density Residential)
INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Multi-Family', 'allowed', NULL, 'Up to 12 units per acre', true
FROM zoning_districts WHERE district_code = 'R-5' AND municipality = 'Wilmington';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Townhouses', 'allowed', NULL, 'Attached single-family', true
FROM zoning_districts WHERE district_code = 'R-5' AND municipality = 'Wilmington';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Apartment Building', 'allowed', NULL, 'Multi-story permitted', true
FROM zoning_districts WHERE district_code = 'R-5' AND municipality = 'Wilmington';

-- B-3 (Central Business District)
INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Office - High Rise', 'allowed', NULL, 'No height limit in downtown', true
FROM zoning_districts WHERE district_code = 'B-3' AND municipality = 'Wilmington';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Retail Store', 'allowed', NULL, 'Ground floor retail encouraged', true
FROM zoning_districts WHERE district_code = 'B-3' AND municipality = 'Wilmington';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Hotel', 'allowed', NULL, 'Full-service and limited-service', true
FROM zoning_districts WHERE district_code = 'B-3' AND municipality = 'Wilmington';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'High-Rise Residential', 'allowed', NULL, 'Mixed-use encouraged', true
FROM zoning_districts WHERE district_code = 'B-3' AND municipality = 'Wilmington';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Restaurant/Bar', 'allowed', NULL, 'Entertainment uses permitted', true
FROM zoning_districts WHERE district_code = 'B-3' AND municipality = 'Wilmington';

-- ========== AGRICULTURAL ZONES ==========

-- AR (Kent County Agricultural Residential)
INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Agricultural', 'Crop Production', 'allowed', NULL, 'Agricultural operations by right', true
FROM zoning_districts WHERE district_code = 'AR' AND county = 'Kent';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Agricultural', 'Livestock', 'allowed', NULL, 'Subject to state regulations', true
FROM zoning_districts WHERE district_code = 'AR' AND county = 'Kent';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Residential', 'Single-Family Detached', 'allowed', NULL, 'One dwelling per lot', true
FROM zoning_districts WHERE district_code = 'AR' AND county = 'Kent';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Agricultural', 'Farm Stand', 'allowed', NULL, 'Sale of products grown on-site', true
FROM zoning_districts WHERE district_code = 'AR' AND county = 'Kent';

INSERT INTO permitted_uses (zoning_id, use_category, use_type, status, conditions, notes, is_mock)
SELECT id, 'Commercial', 'Agritourism', 'conditional', 'Requires conditional use permit', 'Farm tours, corn mazes, etc.', true
FROM zoning_districts WHERE district_code = 'AR' AND county = 'Kent';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_permitted_uses_mock ON permitted_uses(is_mock);
CREATE INDEX IF NOT EXISTS idx_permitted_uses_status_mock ON permitted_uses(status, is_mock);
