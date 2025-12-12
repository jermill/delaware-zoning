-- ========================================
-- SEED SCRIPT: DIMENSIONAL STANDARDS
-- ========================================
-- Setbacks, height limits, lot requirements based on Delaware standards
-- Values based on research of DE county ordinances

-- ========== RESIDENTIAL ZONES ==========

-- NC2a (2-acre residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 50, 25, 40, 35, 87120, 150, 0.15, 2, '2 spaces per dwelling unit', true
FROM zoning_districts WHERE district_code = 'NC2a';

-- NC40 (40,000 SF residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 40, 15, 35, 35, 40000, 120, 0.25, 2, '2 spaces per dwelling unit', true
FROM zoning_districts WHERE district_code = 'NC40';

-- NC15 (15,000 SF residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 30, 10, 30, 35, 15000, 80, 0.35, 2, '2 spaces per dwelling unit', true
FROM zoning_districts WHERE district_code = 'NC15';

-- NC10 (10,000 SF residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 25, 8, 25, 35, 10000, 70, 0.40, 2, '2 spaces per dwelling unit', true
FROM zoning_districts WHERE district_code = 'NC10';

-- NC6.5 (6,500 SF residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 20, 6, 20, 35, 6500, 50, 0.50, 2, '2 spaces per dwelling unit', true
FROM zoning_districts WHERE district_code = 'NC6.5';

-- ========== COMMERCIAL ZONES ==========

-- C-1 (Community Commercial)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 15, 10, 20, 35, 7500, 75, 0.60, 4, '1 space per 250 sq ft of retail; 1 per 300 sq ft office', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'New Castle';

-- CR (Commercial Regional)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 20, 15, 25, 50, 20000, 150, 0.80, 5, '1 space per 200 sq ft retail; varies by use', true
FROM zoning_districts WHERE district_code = 'CR';

-- O (Office)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 25, 15, 20, 65, 10000, 100, 1.50, 3.5, '1 space per 300 sq ft of office space', true
FROM zoning_districts WHERE district_code = 'O';

-- ========== INDUSTRIAL ZONES ==========

-- LI (Light Industrial)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 30, 20, 30, 45, 20000, 150, 0.50, 2, '1 space per 1,000 sq ft; plus loading areas', true
FROM zoning_districts WHERE district_code = 'LI';

-- HI (Heavy Industrial)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 50, 30, 40, 65, 40000, 200, 0.40, 1.5, '1 space per 2,000 sq ft; extensive loading required', true
FROM zoning_districts WHERE district_code = 'HI';

-- ========== WILMINGTON CITY ZONES ==========

-- R-2 (Low-Density Residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 20, 5, 20, 35, 5000, 40, 0.60, 1.5, '1.5 spaces per unit; may use on-street parking', true
FROM zoning_districts WHERE district_code = 'R-2' AND municipality = 'Wilmington';

-- R-5 (Medium-Density Residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 15, 5, 20, 45, 3600, 30, 1.20, 1.25, '1.25 spaces per unit; structured parking allowed', true
FROM zoning_districts WHERE district_code = 'R-5' AND municipality = 'Wilmington';

-- B-1 (Neighborhood Business)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 10, 5, 15, 35, 5000, 40, 1.00, 3, '1 space per 300 sq ft; on-street parking counts', true
FROM zoning_districts WHERE district_code = 'B-1' AND municipality = 'Wilmington';

-- B-3 (Central Business District)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 0, 0, 0, 250, 0, 0, 12.0, 0, 'No minimum parking in CBD; build to street line', true
FROM zoning_districts WHERE district_code = 'B-3' AND municipality = 'Wilmington';

-- M-1 (Light Manufacturing - Wilmington)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 25, 15, 25, 50, 15000, 100, 0.80, 2, '1 space per 1,000 sq ft; loading docks required', true
FROM zoning_districts WHERE district_code = 'M-1' AND municipality = 'Wilmington';

-- ========== KENT COUNTY ZONES ==========

-- AR (Agricultural Residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 50, 30, 50, 35, 130680, 200, 0.10, 2, '2 spaces per dwelling; agricultural structures exempt', true
FROM zoning_districts WHERE district_code = 'AR' AND county = 'Kent';

-- R-1 (Low-Density Residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 35, 15, 35, 35, 43560, 125, 0.25, 2, '2 spaces per dwelling unit', true
FROM zoning_districts WHERE district_code = 'R-1' AND county = 'Kent';

-- C-2 (General Commercial)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 20, 15, 25, 40, 10000, 100, 0.70, 4, '1 space per 250 sq ft retail; varies by use', true
FROM zoning_districts WHERE district_code = 'C-2' AND county = 'Kent';

-- ========== DOVER CITY ZONES ==========

-- RS (Residential Suburban)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 25, 10, 30, 35, 8000, 60, 0.40, 2, '2 spaces per dwelling unit', true
FROM zoning_districts WHERE district_code = 'RS' AND municipality = 'Dover';

-- GC (General Commercial)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 15, 10, 20, 40, 8000, 80, 0.75, 4.5, '1 space per 250 sq ft; restaurant 1 per 100 sq ft', true
FROM zoning_districts WHERE district_code = 'GC' AND municipality = 'Dover';

-- ========== SUSSEX COUNTY ZONES ==========

-- AR-1 (Agricultural Residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 50, 30, 50, 35, 217800, 250, 0.08, 2, '2 spaces per dwelling; farm buildings exempt', true
FROM zoning_districts WHERE district_code = 'AR-1';

-- GR (General Residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 30, 12, 30, 35, 12000, 80, 0.40, 2, '2 spaces per unit; duplex 3 spaces total', true
FROM zoning_districts WHERE district_code = 'GR';

-- C-1 (Limited Commercial)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 20, 15, 25, 35, 10000, 100, 0.50, 4, '1 space per 300 sq ft retail/office', true
FROM zoning_districts WHERE district_code = 'C-1' AND county = 'Sussex';

-- C-3 (Highway Commercial)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 25, 20, 30, 45, 15000, 120, 0.65, 5, '1 space per 200 sq ft; gas stations 1 per pump plus 3', true
FROM zoning_districts WHERE district_code = 'C-3' AND county = 'Sussex';

-- ========== NEWARK CITY ZONES ==========

-- RS (Single Family Residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 25, 8, 25, 35, 7500, 60, 0.45, 2, '2 spaces per dwelling; may use driveway', true
FROM zoning_districts WHERE district_code = 'RS' AND municipality = 'Newark';

-- RM (Multi-Family Residential)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 20, 10, 25, 45, 5000, 50, 1.00, 1.75, '1.75 spaces per unit; structured parking allowed', true
FROM zoning_districts WHERE district_code = 'RM' AND municipality = 'Newark';

-- BB (Central Business)
INSERT INTO dimensional_standards (zoning_id, front_setback_ft, side_setback_ft, rear_setback_ft, max_height_ft, min_lot_area_sqft, min_lot_width_ft, far, parking_ratio, parking_notes, is_mock)
SELECT id, 0, 0, 10, 60, 0, 0, 3.00, 0, 'Build to street line; shared parking encouraged; no minimum', true
FROM zoning_districts WHERE district_code = 'BB' AND municipality = 'Newark';

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_dimensional_mock ON dimensional_standards(is_mock);

-- Add comments for clarity
COMMENT ON COLUMN dimensional_standards.front_setback_ft IS 'Minimum distance from front property line to building (feet)';
COMMENT ON COLUMN dimensional_standards.side_setback_ft IS 'Minimum distance from side property line to building (feet)';
COMMENT ON COLUMN dimensional_standards.rear_setback_ft IS 'Minimum distance from rear property line to building (feet)';
COMMENT ON COLUMN dimensional_standards.max_height_ft IS 'Maximum building height allowed (feet)';
COMMENT ON COLUMN dimensional_standards.min_lot_area_sqft IS 'Minimum lot size required (square feet)';
COMMENT ON COLUMN dimensional_standards.min_lot_width_ft IS 'Minimum lot width/frontage (feet)';
COMMENT ON COLUMN dimensional_standards.far IS 'Floor Area Ratio - ratio of building floor area to lot area';
COMMENT ON COLUMN dimensional_standards.parking_ratio IS 'Parking spaces required (varies by use - see notes)';
