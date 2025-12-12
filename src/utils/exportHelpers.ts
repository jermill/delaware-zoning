// Helper functions for exporting data to CSV

import { SavedProperty, SearchHistoryEntry } from '@/data/mockDashboardData';

// Convert array of objects to CSV string
function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(',');
  const rows = data.map(row => 
    headers.map(header => {
      const value = row[header] || '';
      // Escape quotes and wrap in quotes if contains comma
      const stringValue = String(value).replace(/"/g, '""');
      return stringValue.includes(',') ? `"${stringValue}"` : stringValue;
    }).join(',')
  );
  return [headerRow, ...rows].join('\n');
}

// Download CSV file
function downloadCSV(csv: string, filename: string) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Export saved properties to CSV
export function exportSavedPropertiesToCSV(properties: SavedProperty[]) {
  const headers = ['address', 'zoneCode', 'zoneName', 'county', 'city', 'dateSaved', 'notes', 'tags'];
  
  const data = properties.map(prop => ({
    address: prop.address,
    zoneCode: prop.zoneCode,
    zoneName: prop.zoneName,
    county: prop.county,
    city: prop.city,
    dateSaved: new Date(prop.dateSaved).toLocaleDateString(),
    notes: prop.notes || '',
    tags: prop.tags ? prop.tags.join('; ') : '',
  }));

  const csv = convertToCSV(data, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `saved-properties-${timestamp}.csv`);
}

// Export search history to CSV
export function exportSearchHistoryToCSV(searches: SearchHistoryEntry[]) {
  const headers = ['date', 'time', 'address', 'zoneCode', 'zoneName', 'county', 'success'];
  
  const data = searches.map(search => {
    const date = new Date(search.searchedAt);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString(),
      address: search.address,
      zoneCode: search.zoneCode,
      zoneName: search.zoneName,
      county: search.county,
      success: search.success ? 'Yes' : 'No',
    };
  });

  const csv = convertToCSV(data, headers);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `search-history-${timestamp}.csv`);
}

// Export dashboard summary
export function exportDashboardSummary(data: {
  userName: string;
  tier: string;
  searchesThisMonth: number;
  savedProperties: number;
  totalSearches: number;
}) {
  const summary = [
    ['Delaware Zoning - Dashboard Summary'],
    [''],
    ['User Information'],
    ['Name', data.userName],
    ['Subscription Tier', data.tier],
    [''],
    ['Usage Statistics'],
    ['Searches This Month', data.searchesThisMonth],
    ['Saved Properties', data.savedProperties],
    ['Total Searches (All Time)', data.totalSearches],
    [''],
    ['Generated', new Date().toLocaleString()],
  ];

  const csv = summary.map(row => row.join(',')).join('\n');
  const timestamp = new Date().toISOString().split('T')[0];
  downloadCSV(csv, `dashboard-summary-${timestamp}.csv`);
}
