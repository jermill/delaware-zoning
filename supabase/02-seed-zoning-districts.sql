-- ========================================
-- SEED SCRIPT: ZONING DISTRICTS
-- ========================================
-- Mock zoning data based on real Delaware zoning structures
-- Sources: New Castle County UDC, Wilmington City Code, Kent/Sussex County ordinances

-- ========== NEW CASTLE COUNTY ==========

-- Residential Zones (based on NC - Neighborhood Conservation districts)
INSERT INTO zoning_districts (state, county, municipality, district_code, name, description, geom, is_mock, data_source, last_verified) VALUES
('DE', 'New Castle', NULL, 'NC2a', 'Neighborhood Conservation - 2 Acre', 
 'Single-family detached homes on 2-acre minimum lots. Low density residential.',
 ST_MakeEnvelope(-75.65, 39.65, -75.60, 39.70, 4326),
 true, 'Mock Data - Based on New Castle County UDC', NOW()),

('DE', 'New Castle', NULL, 'NC40', 'Neighborhood Conservation - 40,000 SF', 
 'Single-family detached homes on 40,000 square foot minimum lots. Suburban residential.',
 ST_MakeEnvelope(-75.65, 39.60, -75.60, 39.65, 4326),
 true, 'Mock Data - Based on New Castle County UDC', NOW()),

('DE', 'New Castle', NULL, 'NC15', 'Neighborhood Conservation - 15,000 SF', 
 'Single-family detached homes on 15,000 square foot minimum lots. Standard suburban.',
 ST_MakeEnvelope(-75.60, 39.60, -75.55, 39.65, 4326),
 true, 'Mock Data - Based on New Castle County UDC', NOW()),

('DE', 'New Castle', NULL, 'NC10', 'Neighborhood Conservation - 10,000 SF', 
 'Single-family detached homes on 10,000 square foot minimum lots. Higher density suburban.',
 ST_MakeEnvelope(-75.60, 39.55, -75.55, 39.60, 4326),
 true, 'Mock Data - Based on New Castle County UDC', NOW()),

('DE', 'New Castle', NULL, 'NC6.5', 'Neighborhood Conservation - 6,500 SF', 
 'Single-family detached homes on 6,500 square foot minimum lots. Urban residential.',
 ST_MakeEnvelope(-75.55, 39.55, -75.50, 39.60, 4326),
 true, 'Mock Data - Based on New Castle County UDC', NOW()),

-- Commercial Zones
('DE', 'New Castle', NULL, 'C-1', 'Community Commercial', 
 'Neighborhood-scale commercial. Retail, services, offices serving local community.',
 ST_MakeEnvelope(-75.60, 39.70, -75.55, 39.72, 4326),
 true, 'Mock Data - Based on New Castle County UDC', NOW()),

('DE', 'New Castle', NULL, 'CR', 'Commercial Regional', 
 'Large-scale commercial serving regional market. Shopping centers, big box retail.',
 ST_MakeEnvelope(-75.65, 39.72, -75.60, 39.75, 4326),
 true, 'Mock Data - Based on New Castle County UDC', NOW()),

('DE', 'New Castle', NULL, 'O', 'Office', 
 'Professional and business offices. Medical offices, corporate headquarters.',
 ST_MakeEnvelope(-75.55, 39.70, -75.50, 39.72, 4326),
 true, 'Mock Data - Based on New Castle County UDC', NOW()),

-- Industrial Zones
('DE', 'New Castle', NULL, 'LI', 'Light Industrial', 
 'Light manufacturing, warehousing, research and development facilities.',
 ST_MakeEnvelope(-75.65, 39.75, -75.60, 39.78, 4326),
 true, 'Mock Data - Based on New Castle County UDC', NOW()),

('DE', 'New Castle', NULL, 'HI', 'Heavy Industrial', 
 'Heavy manufacturing, processing plants, major distribution centers.',
 ST_MakeEnvelope(-75.70, 39.75, -75.65, 39.78, 4326),
 true, 'Mock Data - Based on New Castle County UDC', NOW());

-- ========== WILMINGTON (CITY) ==========

INSERT INTO zoning_districts (state, county, municipality, district_code, name, description, geom, is_mock, data_source, last_verified) VALUES
('DE', 'New Castle', 'Wilmington', 'R-2', 'Low-Density Residential', 
 'Single and two-family homes. Urban residential character.',
 ST_MakeEnvelope(-75.55, 39.73, -75.52, 39.75, 4326),
 true, 'Mock Data - Based on Wilmington City Code Ch. 48', NOW()),

('DE', 'New Castle', 'Wilmington', 'R-5', 'Medium-Density Residential', 
 'Multi-family residential. Townhouses, small apartment buildings.',
 ST_MakeEnvelope(-75.55, 39.75, -75.52, 39.77, 4326),
 true, 'Mock Data - Based on Wilmington City Code Ch. 48', NOW()),

('DE', 'New Castle', 'Wilmington', 'B-1', 'Neighborhood Business', 
 'Small-scale retail and services. Corner stores, cafes, professional offices.',
 ST_MakeEnvelope(-75.52, 39.73, -75.50, 39.75, 4326),
 true, 'Mock Data - Based on Wilmington City Code Ch. 48', NOW()),

('DE', 'New Castle', 'Wilmington', 'B-3', 'Central Business District', 
 'Downtown mixed-use. High-rise offices, retail, residential, hotels.',
 ST_MakeEnvelope(-75.55, 39.74, -75.53, 39.76, 4326),
 true, 'Mock Data - Based on Wilmington City Code Ch. 48', NOW()),

('DE', 'New Castle', 'Wilmington', 'M-1', 'Light Manufacturing', 
 'Light industrial and manufacturing. Flex space, warehouses.',
 ST_MakeEnvelope(-75.53, 39.70, -75.50, 39.72, 4326),
 true, 'Mock Data - Based on Wilmington City Code Ch. 48', NOW());

-- ========== KENT COUNTY ==========

INSERT INTO zoning_districts (state, county, municipality, district_code, name, description, geom, is_mock, data_source, last_verified) VALUES
('DE', 'Kent', NULL, 'AR', 'Agricultural Residential', 
 'Agricultural uses with residential. Farms, single-family homes on large lots.',
 ST_MakeEnvelope(-75.55, 39.15, -75.45, 39.25, 4326),
 true, 'Mock Data - Based on Kent County Zoning', NOW()),

('DE', 'Kent', NULL, 'R-1', 'Low-Density Residential', 
 'Single-family residential. Minimum 1-acre lots.',
 ST_MakeEnvelope(-75.55, 39.10, -75.50, 39.15, 4326),
 true, 'Mock Data - Based on Kent County Zoning', NOW()),

('DE', 'Kent', NULL, 'C-2', 'General Commercial', 
 'Broad range of commercial uses. Retail, restaurants, services.',
 ST_MakeEnvelope(-75.50, 39.15, -75.48, 39.17, 4326),
 true, 'Mock Data - Based on Kent County Zoning', NOW());

-- ========== DOVER (CITY) ==========

INSERT INTO zoning_districts (state, county, municipality, district_code, name, description, geom, is_mock, data_source, last_verified) VALUES
('DE', 'Kent', 'Dover', 'RS', 'Residential Suburban', 
 'Single-family homes. Suburban development pattern.',
 ST_MakeEnvelope(-75.53, 39.15, -75.51, 39.17, 4326),
 true, 'Mock Data - Based on Dover City Code', NOW()),

('DE', 'Kent', 'Dover', 'GC', 'General Commercial', 
 'Mixed commercial uses. Retail, offices, restaurants.',
 ST_MakeEnvelope(-75.53, 39.17, -75.51, 39.19, 4326),
 true, 'Mock Data - Based on Dover City Code', NOW());

-- ========== SUSSEX COUNTY ==========

INSERT INTO zoning_districts (state, county, municipality, district_code, name, description, geom, is_mock, data_source, last_verified) VALUES
('DE', 'Sussex', NULL, 'AR-1', 'Agricultural Residential', 
 'Agricultural preservation. Farms, rural residential on 5+ acre lots.',
 ST_MakeEnvelope(-75.20, 38.70, -75.10, 38.80, 4326),
 true, 'Mock Data - Based on Sussex County Zoning', NOW()),

('DE', 'Sussex', NULL, 'GR', 'General Residential', 
 'Medium-density residential. Single-family and duplex homes.',
 ST_MakeEnvelope(-75.20, 38.65, -75.15, 38.70, 4326),
 true, 'Mock Data - Based on Sussex County Zoning', NOW()),

('DE', 'Sussex', NULL, 'C-1', 'Limited Commercial', 
 'Small-scale commercial. Convenience stores, services.',
 ST_MakeEnvelope(-75.15, 38.70, -75.13, 38.72, 4326),
 true, 'Mock Data - Based on Sussex County Zoning', NOW()),

('DE', 'Sussex', NULL, 'C-3', 'Highway Commercial', 
 'Highway-oriented commercial. Gas stations, hotels, restaurants.',
 ST_MakeEnvelope(-75.15, 38.72, -75.13, 38.74, 4326),
 true, 'Mock Data - Based on Sussex County Zoning', NOW());

-- ========== NEWARK (CITY) ==========

INSERT INTO zoning_districts (state, county, municipality, district_code, name, description, geom, is_mock, data_source, last_verified) VALUES
('DE', 'New Castle', 'Newark', 'RS', 'Single Family Residential', 
 'Traditional single-family neighborhood. Mix of lot sizes.',
 ST_MakeEnvelope(-75.76, 39.68, -75.74, 39.70, 4326),
 true, 'Mock Data - Based on Newark City Code', NOW()),

('DE', 'New Castle', 'Newark', 'RM', 'Multi-Family Residential', 
 'Apartments and townhouses. Student housing near university.',
 ST_MakeEnvelope(-75.76, 39.66, -75.74, 39.68, 4326),
 true, 'Mock Data - Based on Newark City Code', NOW()),

('DE', 'New Castle', 'Newark', 'BB', 'Central Business', 
 'Downtown mixed-use. Retail, dining, offices, upper-floor residential.',
 ST_MakeEnvelope(-75.755, 39.68, -75.745, 39.69, 4326),
 true, 'Mock Data - Based on Newark City Code', NOW());

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_zoning_mock ON zoning_districts(is_mock);
CREATE INDEX IF NOT EXISTS idx_zoning_county_muni ON zoning_districts(county, municipality);
