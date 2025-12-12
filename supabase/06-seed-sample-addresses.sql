-- ========================================
-- SEED SCRIPT: SAMPLE ADDRESSES
-- ========================================
-- Real Delaware addresses for testing search functionality
-- These are public/commercial buildings that won't cause privacy concerns
-- Addresses mapped to realistic mock zones for testing

-- Note: These addresses are real, but the zoning data is mock
-- Coordinates will be verified by Google Places API at runtime

-- ========== NEW CASTLE COUNTY ==========

-- Sample address: Christiana Mall (major landmark)
-- Expected zone: CR (Commercial Regional)
COMMENT ON TABLE saved_properties IS 'Sample test addresses: Christiana Mall - 132 Christiana Mall, Newark, DE 19702 (CR zone)';

-- Sample address: University of Delaware
-- Expected zone: Institutional (treated as BB for testing)
COMMENT ON TABLE saved_properties IS 'Sample test addresses: University of Delaware - 210 S College Ave, Newark, DE 19716 (BB zone)';

-- Sample address: Delaware Park (racetrack)
-- Expected zone: C-1 or CR
COMMENT ON TABLE saved_properties IS 'Sample test addresses: Delaware Park - 777 Delaware Park Blvd, Wilmington, DE 19804 (CR zone)';

-- ========== WILMINGTON ADDRESSES ==========

-- CBD/Downtown addresses
-- Sample: Wilmington Public Library
COMMENT ON TABLE saved_properties IS 'Sample test addresses: Wilmington Public Library - 10 E 10th St, Wilmington, DE 19801 (B-3 CBD)';

-- Sample: Rodney Square
COMMENT ON TABLE saved_properties IS 'Sample test addresses: Rodney Square - 1000 N Market St, Wilmington, DE 19801 (B-3 CBD)';

-- Residential areas
-- Sample: Residential area in Wilmington
COMMENT ON TABLE saved_properties IS 'Sample test addresses: Residential Wilmington - 1200 N Broom St, Wilmington, DE 19806 (R-2 or R-5)';

-- ========== DOVER ADDRESSES ==========

-- Sample: Delaware State Capitol
COMMENT ON TABLE saved_properties IS 'Sample test addresses: Delaware State Capitol - 411 Legislative Ave, Dover, DE 19901 (GC or Institutional)';

-- Sample: Dover Downs
COMMENT ON TABLE saved_properties IS 'Sample test addresses: Dover Downs - 1131 N Dupont Hwy, Dover, DE 19901 (GC zone)';

-- Sample: Dover Public Library
COMMENT ON TABLE saved_properties IS 'Sample test addresses: Dover Public Library - 35 E Loockerman St, Dover, DE 19901 (GC zone)';

-- ========== SUSSEX COUNTY ==========

-- Sample: Rehoboth Beach Town Hall
COMMENT ON TABLE saved_properties IS 'Sample test addresses: Rehoboth Beach Town Hall - 229 Rehoboth Ave, Rehoboth Beach, DE 19971 (C-1 or B zone)';

-- Sample: Tanger Outlets
COMMENT ON TABLE saved_properties IS 'Sample test addresses: Tanger Outlets - 36470 Seaside Outlet Dr, Rehoboth Beach, DE 19971 (C-3 Highway Commercial)';

-- Sample: Sussex County Airport
COMMENT ON TABLE saved_properties IS 'Sample test addresses: Delaware Coastal Airport - 21143 Rudder Ln, Georgetown, DE 19947 (LI zone)';

-- ========================================
-- TEST ADDRESS REFERENCE TABLE
-- ========================================
-- Create a reference table for developers to use during testing

CREATE TABLE IF NOT EXISTS test_addresses (
  id SERIAL PRIMARY KEY,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT DEFAULT 'DE',
  zip_code TEXT,
  latitude NUMERIC,
  longitude NUMERIC,
  expected_zone_code TEXT,
  expected_zone_name TEXT,
  property_type TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE test_addresses IS 'Reference addresses for testing search functionality';

-- Insert test addresses
INSERT INTO test_addresses (address, city, state, zip_code, latitude, longitude, expected_zone_code, expected_zone_name, property_type, notes) VALUES

-- New Castle County
('132 Christiana Mall', 'Newark', 'DE', '19702', 39.6776, -75.6514, 'CR', 'Commercial Regional', 'Shopping Center', 'Major regional mall'),
('210 S College Ave', 'Newark', 'DE', '19716', 39.6792, -75.7503, 'BB', 'Central Business', 'University', 'University of Delaware campus'),
('777 Delaware Park Blvd', 'Wilmington', 'DE', '19804', 39.7645, -75.5483, 'CR', 'Commercial Regional', 'Entertainment', 'Horse racing track and casino'),

-- Wilmington City
('10 E 10th St', 'Wilmington', 'DE', '19801', 39.7459, -75.5466, 'B-3', 'Central Business District', 'Library', 'Public library in downtown'),
('1000 N Market St', 'Wilmington', 'DE', '19801', 39.7484, -75.5465, 'B-3', 'Central Business District', 'Office', 'Downtown office tower area'),
('1200 N Broom St', 'Wilmington', 'DE', '19806', 39.7567, -75.5398, 'R-2', 'Low-Density Residential', 'Residential', 'Residential neighborhood'),
('500 W 10th St', 'Wilmington', 'DE', '19801', 39.7456, -75.5534, 'R-5', 'Medium-Density Residential', 'Multi-Family', 'Apartment area'),

-- Newark City
('400 Elkton Rd', 'Newark', 'DE', '19711', 39.6835, -75.7294, 'RM', 'Multi-Family Residential', 'Student Housing', 'Near University of Delaware'),
('92 E Main St', 'Newark', 'DE', '19711', 39.6837, -75.7497, 'BB', 'Central Business', 'Commercial', 'Downtown Newark retail'),
('1655 Capitol Trail', 'Newark', 'DE', '19711', 39.6654, -75.7089, 'C-1', 'Community Commercial', 'Commercial', 'Strip mall area'),

-- Dover City
('411 Legislative Ave', 'Dover', 'DE', '19901', 39.1582, -75.5244, 'GC', 'General Commercial', 'Government', 'State Capitol building'),
('1131 N Dupont Hwy', 'Dover', 'DE', '19901', 39.1726, -75.5268, 'GC', 'General Commercial', 'Casino', 'Dover Downs hotel and casino'),
('35 E Loockerman St', 'Dover', 'DE', '19901', 39.1580, -75.5238, 'GC', 'General Commercial', 'Library', 'Public library downtown'),
('1000 Forest St', 'Dover', 'DE', '19904', 39.1489, -75.5103, 'RS', 'Residential Suburban', 'Residential', 'Suburban neighborhood'),

-- Kent County
('697 Sorghum Mill Rd', 'Camden', 'DE', '19934', 39.1145, -75.5231, 'AR', 'Agricultural Residential', 'Agricultural', 'Rural farmland area'),
('25 The Green', 'Dover', 'DE', '19901', 39.1581, -75.5262, 'GC', 'General Commercial', 'Historic', 'Historic downtown Dover'),

-- Sussex County
('229 Rehoboth Ave', 'Rehoboth Beach', 'DE', '19971', 38.7209, -75.0760, 'C-1', 'Limited Commercial', 'Municipal', 'Beach town center'),
('36470 Seaside Outlet Dr', 'Rehoboth Beach', 'DE', '19971', 38.6425, -75.1273, 'C-3', 'Highway Commercial', 'Outlet Mall', 'Tanger Outlets'),
('21143 Rudder Ln', 'Georgetown', 'DE', '19947', 38.6896, -75.3588, 'LI', 'Light Industrial', 'Airport', 'Small regional airport'),
('18848 Wimble Rd', 'Georgetown', 'DE', '19947', 38.6897, -75.3901, 'AR-1', 'Agricultural Residential', 'Agricultural', 'Rural Sussex County'),
('120 Kings Hwy', 'Lewes', 'DE', '19958', 38.7745, -75.1393, 'C-1', 'Limited Commercial', 'Commercial', 'Historic Lewes downtown'),

-- Mixed-use and edge cases
('1000 Innovation Way', 'Newark', 'DE', '19711', 39.6912, -75.7289, 'O', 'Office', 'Office Park', 'Corporate office park'),
('350 Ogletown Rd', 'Newark', 'DE', '19713', 39.6897, -75.6789, 'LI', 'Light Industrial', 'Industrial', 'Light industrial/warehouse area'),
('2730 Capital Trail', 'Newark', 'DE', '19711', 39.6598, -75.7012, 'NC15', 'Neighborhood Conservation - 15,000 SF', 'Residential', 'Suburban residential'),
('100 Brennan Dr', 'Newark', 'DE', '19713', 39.7012, -75.6534, 'NC10', 'Neighborhood Conservation - 10,000 SF', 'Residential', 'Residential neighborhood'),

-- High-value test cases
('1313 N Market St', 'Wilmington', 'DE', '19801', 39.7512, -75.5463, 'B-3', 'Central Business District', 'Office', 'High-rise office tower'),
('200 Continental Dr', 'Newark', 'DE', '19713', 39.6812, -75.6345, 'CR', 'Commercial Regional', 'Retail', 'Big box retail area'),
('5000 Summit Bridge Rd', 'Middletown', 'DE', '19709', 39.4567, -75.7123, 'AR', 'Agricultural Residential', 'Agricultural', 'Rural farmland');

-- Create indexes for test address lookups
CREATE INDEX IF NOT EXISTS idx_test_addresses_city ON test_addresses(city);
CREATE INDEX IF NOT EXISTS idx_test_addresses_zone ON test_addresses(expected_zone_code);
CREATE INDEX IF NOT EXISTS idx_test_addresses_type ON test_addresses(property_type);

-- ========================================
-- USAGE NOTES
-- ========================================
-- These addresses can be used to test:
-- 1. Google Places API integration (address → lat/lon)
-- 2. PostGIS zone lookup (lat/lon → zone)
-- 3. Permitted uses display
-- 4. PDF generation
-- 5. Save property functionality
-- 
-- To use in testing:
--   SELECT * FROM test_addresses WHERE city = 'Wilmington';
--   SELECT * FROM test_addresses WHERE expected_zone_code = 'B-3';

