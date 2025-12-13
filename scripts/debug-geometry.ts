#!/usr/bin/env ts-node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugGeometry() {
  console.log('\n🔍 Debugging Geometry Issues\n');
  
  // Get a sample zone with geometry
  const { data: zones, error } = await supabase
    .from('zoning_districts')
    .select('id, district_code, name, county, geom')
    .limit(1);

  if (error) {
    console.error('❌ Error fetching zones:', error);
    return;
  }

  if (!zones || zones.length === 0) {
    console.log('❌ No zones in database');
    return;
  }

  const zone = zones[0];
  console.log('Sample Zone:');
  console.log(`  ID: ${zone.id}`);
  console.log(`  Code: ${zone.district_code}`);
  console.log(`  Name: ${zone.name}`);
  console.log(`  County: ${zone.county}`);
  console.log(`  Geometry: ${zone.geom ? 'Present (Object)' : 'NULL'}`);
  
  if (zone.geom) {
    console.log(`  Geometry type: ${typeof zone.geom}`);
    console.log(`  Geometry keys: ${Object.keys(zone.geom).join(', ')}`);
  }

  // Test if geometry is valid
  const { data: validTest } = await supabase
    .rpc('sql_query', {
      query: `SELECT ST_IsValid(geom) as is_valid FROM zoning_districts WHERE id = '${zone.id}'`
    })
    .single();

  console.log(`\n  Geometry Valid: ${validTest ? 'checking...' : 'error'}`);

  // Get bounding box of all geometries
  const { data: bbox } = await supabase
    .rpc('sql_query', {
      query: 'SELECT ST_Extent(geom)::text as bbox FROM zoning_districts WHERE geom IS NOT NULL'
    })
    .single();

  if (bbox) {
    console.log(`\n📏 Bounding Box of All Geometries:`);
    console.log(`  ${bbox.bbox}`);
  }

  // Test coordinates
  const testLat = 39.7673;
  const testLon = -75.5962;
  console.log(`\n🧪 Test Point: ${testLat}, ${testLon}`);
  console.log('   Checking if any geometry contains this point...\n');

  // Manual query
  const { data: manualTest, error: manualError } = await supabase
    .rpc('sql_query', {
      query: `
        SELECT district_code, name, 
               ST_Contains(geom, ST_SetSRID(ST_Point(${testLon}, ${testLat}), 4326)) as contains
        FROM zoning_districts 
        WHERE geom IS NOT NULL 
        LIMIT 5
      `
    });

  if (manualError) {
    console.error('Error in manual query:', manualError);
  } else if (manualTest) {
    console.log('Manual containment test results:');
    manualTest.forEach((row: any) => {
      console.log(`  ${row.district_code} (${row.name}): ${row.contains ? 'YES' : 'NO'}`);
    });
  }
}

debugGeometry().catch(console.error);


