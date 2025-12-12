-- ========================================
-- SCHEMA UPDATES FOR MOCK DATA TRACKING
-- ========================================
-- This script adds columns to track data provenance
-- allowing us to mix mock and real data

-- Enable PostGIS extension for geographic queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ========== ADD TRACKING COLUMNS ==========

-- Add tracking to zoning_districts
ALTER TABLE zoning_districts 
ADD COLUMN IF NOT EXISTS is_mock BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS data_source TEXT,
ADD COLUMN IF NOT EXISTS last_verified TIMESTAMPTZ;

COMMENT ON COLUMN zoning_districts.is_mock IS 'Indicates if this is mock data for development';
COMMENT ON COLUMN zoning_districts.data_source IS 'Source of the data (e.g., "New Castle County GIS", "Mock Data")';
COMMENT ON COLUMN zoning_districts.last_verified IS 'When this data was last verified with official sources';

-- Add tracking to permitted_uses
ALTER TABLE permitted_uses 
ADD COLUMN IF NOT EXISTS is_mock BOOLEAN DEFAULT false;

COMMENT ON COLUMN permitted_uses.is_mock IS 'Indicates if this is mock data for development';

-- Add tracking to dimensional_standards
ALTER TABLE dimensional_standards 
ADD COLUMN IF NOT EXISTS is_mock BOOLEAN DEFAULT false;

COMMENT ON COLUMN dimensional_standards.is_mock IS 'Indicates if this is mock data for development';

-- Add tracking to permits_required
ALTER TABLE permits_required 
ADD COLUMN IF NOT EXISTS is_mock BOOLEAN DEFAULT false;

COMMENT ON COLUMN permits_required.is_mock IS 'Indicates if this is mock data for development';

-- ========== CREATE FLOOD ZONES TABLE ==========
-- FEMA flood zone data (will contain REAL data, not mock)

CREATE TABLE IF NOT EXISTS flood_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fema_zone TEXT NOT NULL,           -- 'A', 'AE', 'X', 'VE', etc.
  flood_risk TEXT,                   -- 'High Risk', 'Moderate Risk', 'Low Risk'
  zone_description TEXT,
  geom GEOMETRY(MultiPolygon, 4326), -- PostGIS geometry for flood zone areas
  data_source TEXT DEFAULT 'FEMA National Flood Hazard Layer',
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_flood_zones_geometry ON flood_zones USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_flood_zones_fema_zone ON flood_zones(fema_zone);

COMMENT ON TABLE flood_zones IS 'FEMA flood zone data - contains REAL data from federal sources';

-- ========== ADD PARKING REQUIREMENTS ==========
-- Add parking columns to dimensional_standards for future use

ALTER TABLE dimensional_standards 
ADD COLUMN IF NOT EXISTS parking_ratio NUMERIC,
ADD COLUMN IF NOT EXISTS parking_notes TEXT;

COMMENT ON COLUMN dimensional_standards.parking_ratio IS 'Parking spaces required (e.g., 1 space per 1000 sq ft)';
COMMENT ON COLUMN dimensional_standards.parking_notes IS 'Additional parking requirements or notes';

-- ========== HELPER FUNCTIONS ==========

-- Function to find flood zone at a point
CREATE OR REPLACE FUNCTION find_flood_zone_at_point(lat NUMERIC, lon NUMERIC)
RETURNS TABLE (
  fema_zone TEXT,
  flood_risk TEXT,
  zone_description TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    fz.fema_zone,
    fz.flood_risk,
    fz.zone_description
  FROM flood_zones fz
  WHERE ST_Contains(fz.geom, ST_SetSRID(ST_Point(lon, lat), 4326))
  LIMIT 1;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION find_flood_zone_at_point IS 'Find FEMA flood zone at specific coordinates';

