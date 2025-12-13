#!/usr/bin/env ts-node
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function simpleTest() {
  console.log('\n🧪 Simple Geometry Test\n');
  
  // Test with Wilmington, DE coordinates
  const testLat = 39.7459;  // Center of Wilmington
  const testLon = -75.5466;
  
  console.log(`Testing at: ${testLat}, ${testLon} (Wilmington, DE)`);
  
  // Try the RPC function
  console.log('\n1️⃣  Testing find_zoning_at_point RPC...');
  const { data, error } = await supabase
    .rpc('find_zoning_at_point', {
      lat: testLat,
      lon: testLon,
    });

  if (error) {
    console.error('❌ RPC Error:', error);
  } else if (!data || data.length === 0) {
    console.log('❌ No results from RPC');
  } else {
    console.log('✅ RPC Success!');
    console.log(data[0]);
  }

  // Count total zones with geometry
  console.log('\n2️⃣  Counting zones with geometry...');
  const { count } = await supabase
    .from('zoning_districts')
    .select('*', { count: 'exact', head: true })
    .not('geom', 'is', null);
  
  console.log(`   Total zones with geometry: ${count}`);

  // Get one zone and check its geometry
  console.log('\n3️⃣  Sample geometry check...');
  const { data: sample } = await supabase
    .from('zoning_districts')
    .select('district_code, name, geom')
    .not('geom', 'is', null)
    .limit(1)
    .single();

  if (sample) {
    console.log(`   Zone: ${sample.district_code} - ${sample.name}`);
    console.log(`   Geometry type: ${sample.geom?.type}`);
    console.log(`   Has coordinates: ${!!sample.geom?.coordinates}`);
    if (sample.geom?.coordinates) {
      console.log(`   Coordinate arrays: ${sample.geom.coordinates.length}`);
    }
  }
}

simpleTest().catch(console.error);

