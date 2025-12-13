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

async function testLookup() {
  console.log('\n🧪 Testing Zoning Lookup\n');
  
  // Test address: 1910 Dorset Rd, Wilmington, DE 19810 (from your screenshot)
  const lat = 39.7673;
  const lon = -75.5962;
  
  console.log(`📍 Test Location: ${lat}, ${lon}`);
  console.log('   (1910 Dorset Rd, Wilmington, DE 19810)\n');
  
  const { data, error } = await supabase
    .rpc('find_zoning_at_point', {
      lat: lat,
      lon: lon,
    });

  if (error) {
    console.error('❌ Error:', error);
    return;
  }

  if (!data || data.length === 0) {
    console.log('❌ No zoning found at this location');
    console.log('\nℹ️  Database Stats:');
    const { data: stats } = await supabase
      .from('zoning_districts')
      .select('county, district_code, is_mock')
      .limit(10);
    console.log(stats);
    return;
  }

  const zone = data[0];
  console.log('✅ ZONING FOUND!\n');
  console.log(`   Zone Code: ${zone.district_code}`);
  console.log(`   Zone Name: ${zone.name}`);
  console.log(`   Description: ${zone.description}`);
  console.log(`   County: ${zone.county}`);
  console.log(`   Municipality: ${zone.municipality || 'N/A'}`);
  
  // Count total zones
  const { count } = await supabase
    .from('zoning_districts')
    .select('*', { count: 'exact', head: true });
  
  console.log(`\n📊 Total zones in database: ${count}`);
}

testLookup().catch(console.error);
