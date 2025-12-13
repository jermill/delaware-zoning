#!/usr/bin/env ts-node

/**
 * Import Real Delaware Zoning Data from Official County GIS Services
 * 
 * Data Sources:
 * - New Castle County: gis.nccde.org (Official GIS REST API)
 * - Kent County: gis.kentcountyde.gov (Official GIS REST API)
 * - Sussex County: map.sussexcountyde.gov (Official GIS REST API)
 * 
 * This script fetches REAL zoning data from county ArcGIS servers
 * and imports it into Supabase, replacing mock data.
 */

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

// Supabase connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface ArcGISFeature {
  attributes: {
    [key: string]: any;
  };
  geometry?: {
    rings?: number[][][];
    x?: number;
    y?: number;
  };
}

interface ArcGISResponse {
  features: ArcGISFeature[];
}

/**
 * Fetch data from ArcGIS REST API
 */
async function fetchArcGISData(url: string): Promise<ArcGISResponse> {
  const queryUrl = `${url}/query?where=1%3D1&outFields=*&f=json&outSR=4326`;
  
  console.log(`Fetching data from: ${queryUrl}`);
  
  const response = await fetch(queryUrl);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  return data;
}

/**
 * Convert ArcGIS Esri JSON polygon to PostGIS GeoJSON
 */
function convertToGeoJSON(geometry: any): any | null {
  if (!geometry || !geometry.rings) {
    return null;
  }

  try {
    // Esri polygon format has "rings" array
    // Each ring is an array of [lon, lat] coordinates
    // First ring is outer boundary, subsequent rings are holes
    
    // Convert to GeoJSON Polygon/MultiPolygon format
    const rings = geometry.rings;
    
    if (rings.length === 0) {
      return null;
    }

    // GeoJSON MultiPolygon structure
    const coordinates = [rings];  // Wrap all rings in another array for MultiPolygon
    
    return {
      type: 'MultiPolygon',
      coordinates: coordinates,
      crs: {
        type: 'name',
        properties: {
          name: 'EPSG:4326'
        }
      }
    };
  } catch (error) {
    console.error('Error converting geometry:', error);
    return null;
  }
}

/**
 * Import New Castle County zoning data
 */
async function importNewCastleCounty() {
  console.log('\n🏛️  Importing New Castle County Zoning Data...\n');

  const serviceUrl = 'https://gis.nccde.org/agsserver/rest/services/BaseMaps/Zoning/MapServer/6';
  
  try {
    const data = await fetchArcGISData(serviceUrl);
    console.log(`✅ Found ${data.features.length} zoning districts\n`);

    let importedCount = 0;
    let errorCount = 0;

    for (const feature of data.features) {
      const attrs = feature.attributes;
      
      // Map ArcGIS fields to our schema
      const districtCode = attrs.CODE || attrs.ZONECODE || attrs.ZONE || attrs.ZONING || 'UNKNOWN';
      const zoneName = attrs.DESCRIPTION || attrs.ZONENAME || attrs.ZONE_DESC || districtCode;
      const description = attrs.GENERIC_DESCRIPTION || attrs.DESCRIPTION || attrs.ZONE_DESC || `${zoneName} zoning district`;
      
      // Convert geometry to GeoJSON
      const geojson = convertToGeoJSON(feature.geometry);
      
      try {
        const { error } = await supabase
          .from('zoning_districts')
          .insert({
            state: 'DE',
            county: 'New Castle',
            municipality: null,
            district_code: districtCode,
            name: zoneName,
            description: description,
            geom: geojson,  // PostGIS accepts GeoJSON directly
            is_mock: false,
            data_source: 'New Castle County GIS - Official ArcGIS REST API',
            last_verified: new Date().toISOString(),
          });

        if (error) {
          console.error(`❌ Error importing ${districtCode}:`, error.message);
          errorCount++;
        } else {
          importedCount++;
          console.log(`✅ Imported: ${districtCode} - ${zoneName}`);
        }
      } catch (err) {
        console.error(`❌ Exception importing ${districtCode}:`, err);
        errorCount++;
      }
    }

    console.log(`\n📊 New Castle County Summary:`);
    console.log(`   ✅ Successfully imported: ${importedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    return importedCount;
  } catch (error) {
    console.error('❌ Failed to fetch New Castle County data:', error);
    return 0;
  }
}

/**
 * Import Kent County zoning data
 */
async function importKentCounty() {
  console.log('\n🏛️  Importing Kent County Zoning Data...\n');

  const serviceUrl = 'https://gis.kentcountyde.gov/arcgis/rest/services/Planning/Zoning/MapServer/0';
  
  try {
    const data = await fetchArcGISData(serviceUrl);
    console.log(`✅ Found ${data.features.length} zoning districts\n`);

    let importedCount = 0;
    let errorCount = 0;

    for (const feature of data.features) {
      const attrs = feature.attributes;
      
      // Map ArcGIS fields to our schema
      const districtCode = attrs.ZONE_CODE || attrs.ZONECODE || attrs.ZONE || attrs.ZONING || 'UNKNOWN';
      const zoneName = attrs.ZONE_NAME || attrs.ZONENAME || attrs.ZONE_DESC || attrs.DESCRIPTION || districtCode;
      const description = attrs.ZONE_DESCRIPTION || attrs.DESCRIPTION || attrs.ZONE_DESC || `${zoneName} zoning district`;
      
      // Convert geometry to GeoJSON
      const geojson = convertToGeoJSON(feature.geometry);
      
      try {
        const { error } = await supabase
          .from('zoning_districts')
          .insert({
            state: 'DE',
            county: 'Kent',
            municipality: null,
            district_code: districtCode,
            name: zoneName,
            description: description,
            geom: geojson,
            is_mock: false,
            data_source: 'Kent County GIS - Official ArcGIS REST API',
            last_verified: new Date().toISOString(),
          });

        if (error) {
          console.error(`❌ Error importing ${districtCode}:`, error.message);
          errorCount++;
        } else {
          importedCount++;
          console.log(`✅ Imported: ${districtCode} - ${zoneName}`);
        }
      } catch (err) {
        console.error(`❌ Exception importing ${districtCode}:`, err);
        errorCount++;
      }
    }

    console.log(`\n📊 Kent County Summary:`);
    console.log(`   ✅ Successfully imported: ${importedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    return importedCount;
  } catch (error) {
    console.error('❌ Failed to fetch Kent County data:', error);
    return 0;
  }
}

/**
 * Import Sussex County zoning data
 */
async function importSussexCounty() {
  console.log('\n🏖️  Importing Sussex County Zoning Data...\n');

  const serviceUrl = 'https://map.sussexcountyde.gov/server/rest/services/Zoning_Dimension/MapServer/0';
  
  try {
    const data = await fetchArcGISData(serviceUrl);
    console.log(`✅ Found ${data.features.length} zoning districts\n`);

    let importedCount = 0;
    let errorCount = 0;

    for (const feature of data.features) {
      const attrs = feature.attributes;
      
      // Map ArcGIS fields to our schema
      const districtCode = attrs.ZONE_CODE || attrs.ZONECODE || attrs.ZONE || 'UNKNOWN';
      const zoneName = attrs.ZONE_NAME || attrs.ZONENAME || attrs.ZONE_DESC || districtCode;
      const description = attrs.ZONE_DESCRIPTION || attrs.DESCRIPTION || `${zoneName} zoning district`;
      
      // Convert geometry to GeoJSON
      const geojson = convertToGeoJSON(feature.geometry);
      
      try{
        const { error } = await supabase
          .from('zoning_districts')
          .insert({
            state: 'DE',
            county: 'Sussex',
            municipality: null,
            district_code: districtCode,
            name: zoneName,
            description: description,
            geom: geojson,
            is_mock: false,
            data_source: 'Sussex County GIS - Official ArcGIS REST API',
            last_verified: new Date().toISOString(),
          });

        if (error) {
          console.error(`❌ Error importing ${districtCode}:`, error.message);
          errorCount++;
        } else {
          importedCount++;
          console.log(`✅ Imported: ${districtCode} - ${zoneName}`);
        }
      } catch (err) {
        console.error(`❌ Exception importing ${districtCode}:`, err);
        errorCount++;
      }
    }

    console.log(`\n📊 Sussex County Summary:`);
    console.log(`   ✅ Successfully imported: ${importedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    return importedCount;
  } catch (error) {
    console.error('❌ Failed to fetch Sussex County data:', error);
    return 0;
  }
}

/**
 * Delete mock data after real data is imported
 */
async function deleteMockData() {
  console.log('\n🗑️  Removing mock data...\n');

  const { data, error } = await supabase
    .from('zoning_districts')
    .delete()
    .eq('is_mock', true);

  if (error) {
    console.error('❌ Error deleting mock data:', error);
  } else {
    console.log('✅ Mock data removed successfully');
  }
}

/**
 * Verify data import
 */
async function verifyImport() {
  console.log('\n✅ Verifying import...\n');

  // Count real vs mock data
  const { data: realData, error: realError } = await supabase
    .from('zoning_districts')
    .select('id', { count: 'exact' })
    .eq('is_mock', false);

  const { data: mockData, error: mockError } = await supabase
    .from('zoning_districts')
    .select('id', { count: 'exact' })
    .eq('is_mock', true);

  console.log('📊 Database Status:');
  console.log(`   🟢 Real zoning districts: ${(realData as any)?.length || 0}`);
  console.log(`   🟡 Mock zoning districts: ${(mockData as any)?.length || 0}`);

  // Get county breakdown
  const { data: countyData } = await supabase
    .from('zoning_districts')
    .select('county, is_mock')
    .eq('is_mock', false);

  if (countyData) {
    const counties = countyData.reduce((acc: any, row: any) => {
      acc[row.county] = (acc[row.county] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📍 Real Data Coverage by County:');
    Object.entries(counties).forEach(([county, count]) => {
      console.log(`   ${county}: ${count} districts`);
    });
  }
}

/**
 * Main import function
 */
async function main() {
  console.log('🚀 Delaware Zoning Data Import - REAL DATA ONLY\n');
  console.log('=' .repeat(60));
  console.log('Source: Official County GIS REST APIs');
  console.log('=' .repeat(60));

  let totalImported = 0;

  // Import from each county
  totalImported += await importNewCastleCounty();
  totalImported += await importKentCounty();
  totalImported += await importSussexCounty();

  console.log('\n' + '='.repeat(60));
  console.log(`📊 TOTAL IMPORTED: ${totalImported} real zoning districts`);
  console.log('='.repeat(60));

  if (totalImported > 0) {
    // Verify import
    await verifyImport();

    // Ask before deleting mock data
    console.log('\n⚠️  Mock data still exists in database.');
    console.log('   Run this script with --delete-mock flag to remove it.');
    console.log('   Example: npm run import-real-data -- --delete-mock');

    if (process.argv.includes('--delete-mock')) {
      await deleteMockData();
      await verifyImport();
    }
  }

  console.log('\n✅ Import complete!\n');
}

// Run import
main().catch(console.error);

