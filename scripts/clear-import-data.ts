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

async function clearData() {
  console.log('🗑️  Clearing all zoning_districts data...');
  
  const { data, error } = await supabase
    .from('zoning_districts')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all except impossible UUID

  if (error) {
    console.error('❌ Error:', error);
  } else {
    console.log('✅ All zoning districts cleared');
  }
}

clearData().catch(console.error);
