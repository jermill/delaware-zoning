#!/usr/bin/env ts-node

/**
 * Production Data Verification Script
 * 
 * This script runs comprehensive SQL queries against the production database
 * to verify data integrity, identify mock data, and generate a verification report.
 * 
 * Usage:
 *   ts-node scripts/verify-production-data.ts
 * 
 * Environment Variables Required:
 *   - SUPABASE_URL: Your Supabase project URL
 *   - SUPABASE_SERVICE_ROLE_KEY: Service role key for admin access
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
require('dotenv').config({ path: '.env.local' });

interface VerificationResult {
  timestamp: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  checks: {
    mockDataCheck: CheckResult;
    countyCoverage: CheckResult;
    dataCompleteness: CheckResult;
    permittedUsesCheck: CheckResult;
    orphanedMockData: CheckResult;
    geometryValidation: CheckResult;
  };
  summary: {
    totalZones: number;
    totalPermittedUses: number;
    totalDimensionalStandards: number;
    totalPermitsRequired: number;
    criticalIssues: number;
    warnings: number;
  };
  recommendations: string[];
}

interface CheckResult {
  name: string;
  status: 'PASS' | 'FAIL' | 'WARNING';
  message: string;
  data?: any;
  details?: string;
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
 * Run SQL query and return results
 */
async function runQuery(sql: string): Promise<any> {
  const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });
  
  if (error) {
    // If exec_sql RPC doesn't exist, try direct table queries
    console.warn(`⚠️  Warning: exec_sql RPC not available, using direct queries`);
    return null;
  }
  
  return data;
}

/**
 * Check for mock data (MUST be 0 in production)
 */
async function checkMockData(): Promise<CheckResult> {
  console.log('🔍 Checking for mock data...');
  
  const { data, error } = await supabase
    .from('zoning_districts')
    .select('id, district_code, county', { count: 'exact' })
    .eq('is_mock', true);
  
  if (error) {
    return {
      name: 'Mock Data Check',
      status: 'FAIL',
      message: `Database query failed: ${error.message}`,
    };
  }
  
  const mockCount = data?.length || 0;
  
  if (mockCount > 0) {
    return {
      name: 'Mock Data Check',
      status: 'FAIL',
      message: `Found ${mockCount} mock zoning districts in production database`,
      data: data,
      details: 'CRITICAL: Remove all mock data before production launch',
    };
  }
  
  return {
    name: 'Mock Data Check',
    status: 'PASS',
    message: 'No mock data found ✓',
  };
}

/**
 * Check data coverage by county
 */
async function checkCountyCoverage(): Promise<CheckResult> {
  console.log('🗺️  Checking county coverage...');
  
  const { data, error } = await supabase
    .from('zoning_districts')
    .select('county')
    .eq('is_mock', false);
  
  if (error) {
    return {
      name: 'County Coverage Check',
      status: 'FAIL',
      message: `Database query failed: ${error.message}`,
    };
  }
  
  // Group by county
  const countsByCounty: Record<string, number> = {};
  data?.forEach((row) => {
    const county = row.county;
    countsByCounty[county] = (countsByCounty[county] || 0) + 1;
  });
  
  const counties = Object.keys(countsByCounty);
  const expectedCounties = ['New Castle', 'Kent', 'Sussex'];
  const missingCounties = expectedCounties.filter(c => !counties.includes(c));
  
  let status: 'PASS' | 'WARNING' = 'PASS';
  let message = `Coverage: ${counties.join(', ')}`;
  let details = '';
  
  Object.entries(countsByCounty).forEach(([county, count]) => {
    details += `\n  - ${county}: ${count} zones`;
  });
  
  if (missingCounties.length > 0) {
    status = 'WARNING';
    message = `Missing coverage: ${missingCounties.join(', ')}`;
    details += `\n  ⚠️  Counties without data: ${missingCounties.join(', ')}`;
  }
  
  if (counties.length === 0) {
    return {
      name: 'County Coverage Check',
      status: 'FAIL',
      message: 'No zoning data found in database',
      details: 'CRITICAL: Database appears to be empty',
    };
  }
  
  return {
    name: 'County Coverage Check',
    status,
    message,
    data: countsByCounty,
    details,
  };
}

/**
 * Check data completeness (descriptions, geometry, etc.)
 */
async function checkDataCompleteness(): Promise<CheckResult> {
  console.log('📊 Checking data completeness...');
  
  const { data, error } = await supabase
    .from('zoning_districts')
    .select('id, description, data_source, geom')
    .eq('is_mock', false);
  
  if (error) {
    return {
      name: 'Data Completeness Check',
      status: 'FAIL',
      message: `Database query failed: ${error.message}`,
    };
  }
  
  const total = data?.length || 0;
  const hasDescription = data?.filter(row => row.description).length || 0;
  const hasSource = data?.filter(row => row.data_source).length || 0;
  const hasGeometry = data?.filter(row => row.geom).length || 0;
  
  const descriptionPercent = ((hasDescription / total) * 100).toFixed(1);
  const sourcePercent = ((hasSource / total) * 100).toFixed(1);
  const geometryPercent = ((hasGeometry / total) * 100).toFixed(1);
  
  let status: 'PASS' | 'WARNING' | 'FAIL' = 'PASS';
  let issues: string[] = [];
  
  if (geometryPercent < 95) {
    status = 'FAIL';
    issues.push(`Only ${geometryPercent}% have geometry (critical for spatial queries)`);
  } else if (geometryPercent < 100) {
    status = 'WARNING';
    issues.push(`${geometryPercent}% have geometry (some missing)`);
  }
  
  if (descriptionPercent < 80) {
    if (status === 'PASS') status = 'WARNING';
    issues.push(`Only ${descriptionPercent}% have descriptions`);
  }
  
  if (sourcePercent < 90) {
    if (status === 'PASS') status = 'WARNING';
    issues.push(`Only ${sourcePercent}% have data source`);
  }
  
  const details = `
  Total zones: ${total}
  - With descriptions: ${hasDescription} (${descriptionPercent}%)
  - With data source: ${hasSource} (${sourcePercent}%)
  - With geometry: ${hasGeometry} (${geometryPercent}%)
  `;
  
  return {
    name: 'Data Completeness Check',
    status,
    message: issues.length > 0 ? issues.join('; ') : 'All data fields well-populated ✓',
    data: {
      total,
      hasDescription,
      hasSource,
      hasGeometry,
      descriptionPercent,
      sourcePercent,
      geometryPercent,
    },
    details,
  };
}

/**
 * Check permitted uses are linked to zoning districts
 */
async function checkPermittedUses(): Promise<CheckResult> {
  console.log('✅ Checking permitted uses...');
  
  // Get zones
  const { data: zones, error: zonesError } = await supabase
    .from('zoning_districts')
    .select('id, county')
    .eq('is_mock', false);
  
  if (zonesError) {
    return {
      name: 'Permitted Uses Check',
      status: 'FAIL',
      message: `Database query failed: ${zonesError.message}`,
    };
  }
  
  // Get permitted uses
  const { data: uses, error: usesError } = await supabase
    .from('permitted_uses')
    .select('id, district_id')
    .eq('is_mock', false);
  
  if (usesError) {
    return {
      name: 'Permitted Uses Check',
      status: 'FAIL',
      message: `Database query failed: ${usesError.message}`,
    };
  }
  
  const totalZones = zones?.length || 0;
  const totalUses = uses?.length || 0;
  
  // Count zones with at least one permitted use
  const districtIds = new Set(uses?.map(u => u.district_id));
  const zonesWithUses = zones?.filter(z => districtIds.has(z.id)).length || 0;
  
  const coveragePercent = totalZones > 0 
    ? ((zonesWithUses / totalZones) * 100).toFixed(1)
    : '0';
  
  let status: 'PASS' | 'WARNING' | 'FAIL' = 'PASS';
  let message = `${zonesWithUses}/${totalZones} zones have permitted uses (${coveragePercent}%)`;
  
  if (parseFloat(coveragePercent) < 50) {
    status = 'FAIL';
    message += ' - CRITICAL: Most zones missing permitted uses';
  } else if (parseFloat(coveragePercent) < 80) {
    status = 'WARNING';
    message += ' - Some zones missing permitted uses';
  }
  
  const avgUsesPerZone = totalZones > 0 
    ? (totalUses / totalZones).toFixed(1)
    : '0';
  
  return {
    name: 'Permitted Uses Check',
    status,
    message,
    data: {
      totalZones,
      totalUses,
      zonesWithUses,
      coveragePercent,
      avgUsesPerZone,
    },
    details: `
  Total zones: ${totalZones}
  Total permitted uses: ${totalUses}
  Zones with uses: ${zonesWithUses} (${coveragePercent}%)
  Average uses per zone: ${avgUsesPerZone}
  `,
  };
}

/**
 * Check for orphaned mock data in related tables
 */
async function checkOrphanedMockData(): Promise<CheckResult> {
  console.log('🧹 Checking for orphaned mock data...');
  
  const tables = ['permitted_uses', 'dimensional_standards', 'permits_required'];
  const results: Record<string, number> = {};
  
  for (const table of tables) {
    const { data, error } = await supabase
      .from(table)
      .select('id', { count: 'exact', head: true })
      .eq('is_mock', true);
    
    if (error) {
      return {
        name: 'Orphaned Mock Data Check',
        status: 'FAIL',
        message: `Database query failed for ${table}: ${error.message}`,
      };
    }
    
    results[table] = data?.length || 0;
  }
  
  const totalMock = Object.values(results).reduce((sum, count) => sum + count, 0);
  
  if (totalMock > 0) {
    const details = Object.entries(results)
      .filter(([_, count]) => count > 0)
      .map(([table, count]) => `  - ${table}: ${count} mock records`)
      .join('\n');
    
    return {
      name: 'Orphaned Mock Data Check',
      status: 'FAIL',
      message: `Found ${totalMock} mock records in related tables`,
      data: results,
      details: `\nMock data found:\n${details}\n\nRun cleanup script to remove.`,
    };
  }
  
  return {
    name: 'Orphaned Mock Data Check',
    status: 'PASS',
    message: 'No orphaned mock data ✓',
    data: results,
  };
}

/**
 * Validate geometry data
 */
async function checkGeometryValidation(): Promise<CheckResult> {
  console.log('🗺️  Validating geometry data...');
  
  const { data, error } = await supabase
    .from('zoning_districts')
    .select('id, district_code, county, geom')
    .eq('is_mock', false)
    .is('geom', null);
  
  if (error) {
    return {
      name: 'Geometry Validation Check',
      status: 'FAIL',
      message: `Database query failed: ${error.message}`,
    };
  }
  
  const nullGeometryCount = data?.length || 0;
  
  if (nullGeometryCount > 0) {
    return {
      name: 'Geometry Validation Check',
      status: 'FAIL',
      message: `${nullGeometryCount} zones have NULL geometry`,
      data: data?.slice(0, 10), // Show first 10
      details: 'CRITICAL: Spatial queries will fail for these zones',
    };
  }
  
  return {
    name: 'Geometry Validation Check',
    status: 'PASS',
    message: 'All zones have valid geometry ✓',
  };
}

/**
 * Get summary statistics
 */
async function getSummaryStats(): Promise<any> {
  const { data: zones } = await supabase
    .from('zoning_districts')
    .select('id', { count: 'exact', head: true })
    .eq('is_mock', false);
  
  const { data: uses } = await supabase
    .from('permitted_uses')
    .select('id', { count: 'exact', head: true })
    .eq('is_mock', false);
  
  const { data: standards } = await supabase
    .from('dimensional_standards')
    .select('id', { count: 'exact', head: true })
    .eq('is_mock', false);
  
  const { data: permits } = await supabase
    .from('permits_required')
    .select('id', { count: 'exact', head: true })
    .eq('is_mock', false);
  
  return {
    totalZones: zones?.length || 0,
    totalPermittedUses: uses?.length || 0,
    totalDimensionalStandards: standards?.length || 0,
    totalPermitsRequired: permits?.length || 0,
  };
}

/**
 * Generate recommendations based on check results
 */
function generateRecommendations(result: VerificationResult): string[] {
  const recommendations: string[] = [];
  
  // Check for critical failures
  if (result.checks.mockDataCheck.status === 'FAIL') {
    recommendations.push('🚨 CRITICAL: Remove all mock data before production launch (run cleanup script)');
  }
  
  if (result.checks.geometryValidation.status === 'FAIL') {
    recommendations.push('🚨 CRITICAL: Fix NULL geometry data - spatial queries will fail');
  }
  
  if (result.checks.dataCompleteness.status === 'FAIL') {
    recommendations.push('🚨 CRITICAL: Improve data completeness - geometry data required');
  }
  
  if (result.checks.orphanedMockData.status === 'FAIL') {
    recommendations.push('⚠️  HIGH: Clean up orphaned mock data in related tables');
  }
  
  // Check for warnings
  if (result.checks.countyCoverage.status === 'WARNING') {
    recommendations.push('⚠️  MEDIUM: Update UI to show only counties with complete coverage');
  }
  
  if (result.checks.permittedUsesCheck.status === 'WARNING') {
    recommendations.push('⚠️  MEDIUM: Improve permitted uses coverage - many zones missing use data');
  }
  
  if (result.checks.dataCompleteness.status === 'WARNING') {
    recommendations.push('ℹ️  LOW: Consider adding more descriptions and source attribution');
  }
  
  // Success case
  if (recommendations.length === 0) {
    recommendations.push('✅ All checks passed - database is production-ready!');
  }
  
  return recommendations;
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(result: VerificationResult): string {
  const statusEmoji = (status: string) => {
    switch (status) {
      case 'PASS': return '✅';
      case 'FAIL': return '❌';
      case 'WARNING': return '⚠️';
      default: return '❓';
    }
  };
  
  let markdown = `# Production Data Verification Report

**Generated:** ${result.timestamp}  
**Overall Status:** ${statusEmoji(result.status)} **${result.status}**

---

## Executive Summary

This report verifies the integrity of production database data and identifies any issues that must be resolved before launch.

### Summary Statistics
- **Total Zoning Districts:** ${result.summary.totalZones.toLocaleString()}
- **Total Permitted Uses:** ${result.summary.totalPermittedUses.toLocaleString()}
- **Total Dimensional Standards:** ${result.summary.totalDimensionalStandards.toLocaleString()}
- **Total Permits Required:** ${result.summary.totalPermitsRequired.toLocaleString()}

### Issues Found
- **Critical Issues:** ${result.summary.criticalIssues}
- **Warnings:** ${result.summary.warnings}

---

## Verification Checks

`;

  // Add each check
  Object.values(result.checks).forEach(check => {
    markdown += `### ${statusEmoji(check.status)} ${check.name}

**Status:** ${check.status}  
**Result:** ${check.message}

`;
    
    if (check.details) {
      markdown += `**Details:**
\`\`\`
${check.details.trim()}
\`\`\`

`;
    }
    
    if (check.data) {
      markdown += `**Data:**
\`\`\`json
${JSON.stringify(check.data, null, 2)}
\`\`\`

`;
    }
  });
  
  markdown += `---

## Recommendations

`;
  
  result.recommendations.forEach((rec, index) => {
    markdown += `${index + 1}. ${rec}\n`;
  });
  
  markdown += `
---

## Next Steps

`;
  
  if (result.status === 'FAIL') {
    markdown += `### 🚨 DO NOT DEPLOY TO PRODUCTION

Critical data issues must be resolved before production launch:

1. Review all FAILED checks above
2. Run cleanup scripts to remove mock data
3. Fix data quality issues (NULL geometry, missing data)
4. Re-run this verification script
5. Ensure all checks show PASS or acceptable WARNINGs

`;
  } else if (result.status === 'WARNING') {
    markdown += `### ⚠️ REVIEW BEFORE DEPLOYMENT

Some data quality issues were found. Review warnings and decide if acceptable:

1. Review all WARNING checks above
2. Update UI/documentation to reflect actual coverage
3. Consider fixing data quality issues before launch
4. Document any accepted limitations

`;
  } else {
    markdown += `### ✅ READY FOR PRODUCTION

All critical checks passed! Database is production-ready.

**Optional improvements:**
- Review any remaining warnings
- Monitor data quality post-launch
- Schedule regular data audits

`;
  }
  
  markdown += `---

**Report Generated by:** \`scripts/verify-production-data.ts\`  
**Documentation:** See \`SECURITY-DATA-TESTING-PLAN.md\` Phase 2
`;
  
  return markdown;
}

/**
 * Main execution
 */
async function main() {
  console.log('\n═══════════════════════════════════════════════════');
  console.log('🔍 Delaware Zoning - Production Data Verification');
  console.log('═══════════════════════════════════════════════════\n');
  
  const result: VerificationResult = {
    timestamp: new Date().toISOString(),
    status: 'PASS',
    checks: {} as any,
    summary: {
      totalZones: 0,
      totalPermittedUses: 0,
      totalDimensionalStandards: 0,
      totalPermitsRequired: 0,
      criticalIssues: 0,
      warnings: 0,
    },
    recommendations: [],
  };
  
  try {
    // Run all verification checks
    result.checks.mockDataCheck = await checkMockData();
    result.checks.countyCoverage = await checkCountyCoverage();
    result.checks.dataCompleteness = await checkDataCompleteness();
    result.checks.permittedUsesCheck = await checkPermittedUses();
    result.checks.orphanedMockData = await checkOrphanedMockData();
    result.checks.geometryValidation = await checkGeometryValidation();
    
    // Get summary stats
    const stats = await getSummaryStats();
    result.summary = {
      ...stats,
      criticalIssues: Object.values(result.checks).filter(c => c.status === 'FAIL').length,
      warnings: Object.values(result.checks).filter(c => c.status === 'WARNING').length,
    };
    
    // Determine overall status
    if (result.summary.criticalIssues > 0) {
      result.status = 'FAIL';
    } else if (result.summary.warnings > 0) {
      result.status = 'WARNING';
    } else {
      result.status = 'PASS';
    }
    
    // Generate recommendations
    result.recommendations = generateRecommendations(result);
    
    // Print summary to console
    console.log('\n═══════════════════════════════════════════════════');
    console.log(`📊 Verification Complete - Status: ${result.status}`);
    console.log('═══════════════════════════════════════════════════\n');
    
    console.log('Summary:');
    console.log(`  Total Zoning Districts: ${result.summary.totalZones.toLocaleString()}`);
    console.log(`  Critical Issues: ${result.summary.criticalIssues}`);
    console.log(`  Warnings: ${result.summary.warnings}\n`);
    
    console.log('Check Results:');
    Object.values(result.checks).forEach(check => {
      const statusIcon = check.status === 'PASS' ? '✅' : 
                        check.status === 'FAIL' ? '❌' : '⚠️';
      console.log(`  ${statusIcon} ${check.name}: ${check.message}`);
    });
    
    console.log('\nRecommendations:');
    result.recommendations.forEach((rec, i) => {
      console.log(`  ${i + 1}. ${rec}`);
    });
    
    // Generate and save markdown report
    const markdown = generateMarkdownReport(result);
    const reportPath = path.join(__dirname, '..', 'DATA-VERIFICATION-REPORT.md');
    fs.writeFileSync(reportPath, markdown);
    
    console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    
    // Save JSON for programmatic access
    const jsonPath = path.join(__dirname, '..', 'data-verification-result.json');
    fs.writeFileSync(jsonPath, JSON.stringify(result, null, 2));
    console.log(`📄 JSON result saved to: ${jsonPath}\n`);
    
    // Exit with appropriate code
    if (result.status === 'FAIL') {
      console.error('❌ VERIFICATION FAILED - Do not deploy to production\n');
      process.exit(1);
    } else if (result.status === 'WARNING') {
      console.warn('⚠️  VERIFICATION PASSED WITH WARNINGS - Review before deployment\n');
      process.exit(0);
    } else {
      console.log('✅ VERIFICATION PASSED - Database is production-ready\n');
      process.exit(0);
    }
    
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

export { main, VerificationResult };

