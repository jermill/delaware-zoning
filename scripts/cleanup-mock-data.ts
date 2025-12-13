#!/usr/bin/env ts-node

/**
 * Production Data Cleanup Script
 * 
 * This script removes mock data from the production database.
 * 
 * ⚠️  WARNING: This script performs DELETE operations.
 *     Review the data verification report first.
 *     Always test in a development environment before running in production.
 * 
 * Usage:
 *   # Dry run (shows what would be deleted without deleting):
 *   ts-node scripts/cleanup-mock-data.ts --dry-run
 * 
 *   # Actually delete mock data:
 *   ts-node scripts/cleanup-mock-data.ts --confirm
 * 
 * Environment Variables Required:
 *   - SUPABASE_URL: Your Supabase project URL
 *   - SUPABASE_SERVICE_ROLE_KEY: Service role key for admin access
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

interface CleanupResult {
  timestamp: string;
  dryRun: boolean;
  tablesProcessed: {
    table: string;
    mockRecordsFound: number;
    recordsDeleted: number;
    status: 'success' | 'error';
    error?: string;
  }[];
  totalDeleted: number;
}

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ ERROR: Missing required environment variables');
  console.error('   Required: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  console.error('   Make sure .env.local is configured correctly');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Tables to clean (in order - respects foreign key constraints)
 */
const TABLES_TO_CLEAN = [
  'permits_required',      // Child table
  'dimensional_standards', // Child table
  'permitted_uses',        // Child table
  'zoning_districts',      // Parent table
];

/**
 * Get user confirmation before deletion
 */
async function getUserConfirmation(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  return new Promise((resolve) => {
    rl.question(`${message} (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Count mock records in a table
 */
async function countMockRecords(table: string): Promise<number> {
  const { data, error, count } = await supabase
    .from(table)
    .select('id', { count: 'exact', head: true })
    .eq('is_mock', true);
  
  if (error) {
    console.error(`  ❌ Error counting ${table}:`, error.message);
    return 0;
  }
  
  return count || 0;
}

/**
 * Delete mock records from a table
 */
async function deleteMockRecords(table: string, dryRun: boolean): Promise<{
  found: number;
  deleted: number;
  status: 'success' | 'error';
  error?: string;
}> {
  console.log(`\n📋 Processing table: ${table}`);
  
  // Count mock records
  const mockCount = await countMockRecords(table);
  console.log(`  Found ${mockCount} mock records`);
  
  if (mockCount === 0) {
    return {
      found: 0,
      deleted: 0,
      status: 'success',
    };
  }
  
  if (dryRun) {
    console.log(`  🔍 DRY RUN: Would delete ${mockCount} records`);
    return {
      found: mockCount,
      deleted: 0,
      status: 'success',
    };
  }
  
  // Actually delete
  console.log(`  🗑️  Deleting ${mockCount} mock records...`);
  
  const { error } = await supabase
    .from(table)
    .delete()
    .eq('is_mock', true);
  
  if (error) {
    console.error(`  ❌ Error deleting from ${table}:`, error.message);
    return {
      found: mockCount,
      deleted: 0,
      status: 'error',
      error: error.message,
    };
  }
  
  console.log(`  ✅ Successfully deleted ${mockCount} records`);
  
  return {
    found: mockCount,
    deleted: mockCount,
    status: 'success',
  };
}

/**
 * Fix incorrectly flagged real data
 */
async function fixIncorrectlyFlaggedData(): Promise<number> {
  console.log('\n🔧 Checking for incorrectly flagged real data...');
  
  // Find records with data_source but marked as mock
  const { data, error } = await supabase
    .from('zoning_districts')
    .select('id, district_code, county, data_source')
    .eq('is_mock', true)
    .not('data_source', 'is', null)
    .neq('data_source', 'Mock Data');
  
  if (error) {
    console.error('  ❌ Error querying data:', error.message);
    return 0;
  }
  
  const incorrectCount = data?.length || 0;
  
  if (incorrectCount === 0) {
    console.log('  ✅ No incorrectly flagged data found');
    return 0;
  }
  
  console.log(`  ⚠️  Found ${incorrectCount} real records incorrectly marked as mock:`);
  data?.slice(0, 5).forEach(record => {
    console.log(`     - ${record.district_code} (${record.county}): ${record.data_source}`);
  });
  
  if (incorrectCount > 5) {
    console.log(`     ... and ${incorrectCount - 5} more`);
  }
  
  const confirmed = await getUserConfirmation(
    '\n  These records appear to be real data. Update is_mock to false?'
  );
  
  if (!confirmed) {
    console.log('  ⏭️  Skipped fixing incorrectly flagged data');
    return 0;
  }
  
  const { error: updateError } = await supabase
    .from('zoning_districts')
    .update({ is_mock: false })
    .eq('is_mock', true)
    .not('data_source', 'is', null)
    .neq('data_source', 'Mock Data');
  
  if (updateError) {
    console.error('  ❌ Error updating data:', updateError.message);
    return 0;
  }
  
  console.log(`  ✅ Fixed ${incorrectCount} incorrectly flagged records`);
  return incorrectCount;
}

/**
 * Main cleanup execution
 */
async function main() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('🧹 Delaware Zoning - Mock Data Cleanup');
  console.log('═══════════════════════════════════════════════════\n');
  
  // Parse command line arguments
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const confirmed = args.includes('--confirm');
  
  if (!dryRun && !confirmed) {
    console.log('⚠️  This script will DELETE data from your database.\n');
    console.log('Usage:');
    console.log('  --dry-run   : Preview what would be deleted (safe)');
    console.log('  --confirm   : Actually delete mock data (destructive)\n');
    console.log('Example:');
    console.log('  ts-node scripts/cleanup-mock-data.ts --dry-run\n');
    process.exit(1);
  }
  
  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No data will be deleted\n');
  } else {
    console.log('⚠️  DELETION MODE - Mock data will be permanently removed\n');
    
    const userConfirmed = await getUserConfirmation(
      'Are you sure you want to delete all mock data? This cannot be undone!'
    );
    
    if (!userConfirmed) {
      console.log('\n❌ Cleanup cancelled by user\n');
      process.exit(0);
    }
    
    console.log('\n✅ Confirmed - proceeding with cleanup...');
  }
  
  const result: CleanupResult = {
    timestamp: new Date().toISOString(),
    dryRun,
    tablesProcessed: [],
    totalDeleted: 0,
  };
  
  try {
    // Step 1: Fix incorrectly flagged data (only if not dry run)
    if (!dryRun) {
      const fixedCount = await fixIncorrectlyFlaggedData();
      if (fixedCount > 0) {
        console.log(`\n✅ Fixed ${fixedCount} incorrectly flagged records\n`);
      }
    }
    
    // Step 2: Delete mock data from each table
    console.log('\n═══════════════════════════════════════════════════');
    console.log('🗑️  Removing mock data from tables...');
    console.log('═══════════════════════════════════════════════════');
    
    for (const table of TABLES_TO_CLEAN) {
      const tableResult = await deleteMockRecords(table, dryRun);
      
      result.tablesProcessed.push({
        table,
        mockRecordsFound: tableResult.found,
        recordsDeleted: tableResult.deleted,
        status: tableResult.status,
        error: tableResult.error,
      });
      
      result.totalDeleted += tableResult.deleted;
    }
    
    // Print summary
    console.log('\n═══════════════════════════════════════════════════');
    console.log('📊 Cleanup Summary');
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log('Tables processed:');
    result.tablesProcessed.forEach(({ table, mockRecordsFound, recordsDeleted, status }) => {
      const statusIcon = status === 'success' ? '✅' : '❌';
      if (dryRun) {
        console.log(`  ${statusIcon} ${table}: ${mockRecordsFound} records found`);
      } else {
        console.log(`  ${statusIcon} ${table}: ${recordsDeleted}/${mockRecordsFound} deleted`);
      }
    });
    
    console.log(`\nTotal records ${dryRun ? 'found' : 'deleted'}: ${dryRun ? result.tablesProcessed.reduce((sum, t) => sum + t.mockRecordsFound, 0) : result.totalDeleted}`);
    
    // Check for errors
    const errors = result.tablesProcessed.filter(t => t.status === 'error');
    if (errors.length > 0) {
      console.log('\n❌ Errors encountered:');
      errors.forEach(({ table, error }) => {
        console.log(`  - ${table}: ${error}`);
      });
      process.exit(1);
    }
    
    if (dryRun) {
      console.log('\n🔍 DRY RUN COMPLETE - No data was deleted');
      console.log('\nTo actually delete mock data, run:');
      console.log('  ts-node scripts/cleanup-mock-data.ts --confirm\n');
    } else {
      console.log('\n✅ CLEANUP COMPLETE - All mock data removed');
      console.log('\nNext steps:');
      console.log('  1. Run verification script to confirm:');
      console.log('     ts-node scripts/verify-production-data.ts');
      console.log('  2. Test the application to ensure it works correctly');
      console.log('  3. Review data quality before production launch\n');
    }
    
    process.exit(0);
    
  } catch (error: any) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { main, CleanupResult };
