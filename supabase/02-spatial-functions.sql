-- ========================================
-- SPATIAL QUERY FUNCTIONS
-- ========================================
-- Functions for finding zoning districts by coordinates

-- Function to find zoning district at a specific point
-- This is the core function used by the search API

-- Drop existing function if it exists (it may have different return type)
DROP FUNCTION IF EXISTS find_zoning_at_point(NUMERIC, NUMERIC);

CREATE OR REPLACE FUNCTION find_zoning_at_point(lat NUMERIC, lon NUMERIC)
RETURNS TABLE (
  id UUID,
  district_code TEXT,
  name TEXT,
  description TEXT,
  county TEXT,
  municipality TEXT,
  state TEXT
) AS $$
BEGIN
  -- Return the zoning district that contains this point
  -- Uses PostGIS ST_Contains to check if point is within polygon
  RETURN QUERY
  SELECT 
    zd.id,
    zd.district_code,
    zd.name,
    zd.description,
    zd.county,
    zd.municipality,
    zd.state
  FROM zoning_districts zd
  WHERE ST_Contains(
    zd.geometry, 
    ST_SetSRID(ST_Point(lon, lat), 4326)
  )
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION find_zoning_at_point IS 'Find zoning district at specific coordinates using PostGIS spatial query';

-- Create spatial index on geometry column if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_zoning_districts_geometry 
ON zoning_districts USING GIST(geometry);

-- Create additional useful indexes
CREATE INDEX IF NOT EXISTS idx_zoning_districts_county 
ON zoning_districts(county);

CREATE INDEX IF NOT EXISTS idx_zoning_districts_code 
ON zoning_districts(district_code);

CREATE INDEX IF NOT EXISTS idx_zoning_districts_mock 
ON zoning_districts(is_mock) 
WHERE is_mock = false;
