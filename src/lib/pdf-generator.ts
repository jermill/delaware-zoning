import puppeteer from 'puppeteer';
import { serverEnv } from './env.server';

interface ZoningData {
  id: string;
  districtCode: string;
  name: string;
  description?: string;
  county: string;
  municipality?: string;
  permittedUses?: Array<{
    use_category: string;
    use_name: string;
    status: 'permitted' | 'conditional' | 'prohibited';
  }>;
  dimensionalStandards?: {
    min_lot_size?: number;
    front_setback?: number;
    side_setback?: number;
    rear_setback?: number;
    max_height?: number;
    max_lot_coverage?: number;
    parking_ratio?: number;
    parking_notes?: string;
  } | null;
  requiredPermits?: Array<{
    permit_type: string;
    required: boolean;
    description?: string;
    review_timeline?: string;
  }>;
  floodZone?: {
    fema_zone: string;
    flood_risk: string;
    zone_description?: string;
  } | null;
}

interface ReportData {
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  zoning: ZoningData;
}

export async function generateZoningReportPDF(data: ReportData): Promise<Buffer> {
  const html = createHTMLTemplate(data);
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'letter',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    });

    return Buffer.from(pdfBuffer);
  } finally {
    await browser.close();
  }
}

function createHTMLTemplate(data: ReportData): string {
  const { address, coordinates, zoning } = data;
  const generatedDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mapUrl = generateStaticMapUrl(coordinates.latitude, coordinates.longitude);

  // Categorize permitted uses
  const permitted = zoning.permittedUses?.filter(u => u.status === 'permitted') || [];
  const conditional = zoning.permittedUses?.filter(u => u.status === 'conditional') || [];
  const prohibited = zoning.permittedUses?.filter(u => u.status === 'prohibited') || [];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Zoning Report - ${address}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Helvetica Neue', Arial, sans-serif;
      font-size: 11pt;
      line-height: 1.6;
      color: #1f2937;
    }
    
    .header {
      background: linear-gradient(135deg, #152F50 0%, #82B8DE 100%);
      color: white;
      padding: 30px;
      margin-bottom: 30px;
      border-radius: 8px;
    }
    
    .logo {
      font-size: 24pt;
      font-weight: bold;
      margin-bottom: 10px;
    }
    
    .report-title {
      font-size: 18pt;
      font-weight: 600;
      margin-bottom: 5px;
    }
    
    .property-address {
      font-size: 14pt;
      margin-top: 15px;
      padding: 15px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 6px;
    }
    
    .meta-info {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      background: #f9fafb;
      border-radius: 8px;
      margin-bottom: 25px;
    }
    
    .meta-item {
      flex: 1;
    }
    
    .meta-label {
      font-size: 9pt;
      color: #6b7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 5px;
    }
    
    .meta-value {
      font-size: 11pt;
      font-weight: 600;
      color: #1f2937;
    }
    
    .section {
      margin-bottom: 30px;
      page-break-inside: avoid;
    }
    
    .section-title {
      font-size: 16pt;
      font-weight: bold;
      color: #152F50;
      margin-bottom: 15px;
      padding-bottom: 8px;
      border-bottom: 3px solid #F2AF29;
    }
    
    .zoning-box {
      background: #ecfdf5;
      border: 2px solid #10b981;
      border-radius: 8px;
      padding: 20px;
      margin-bottom: 15px;
    }
    
    .zoning-code {
      font-size: 24pt;
      font-weight: bold;
      color: #152F50;
      margin-bottom: 5px;
    }
    
    .zoning-name {
      font-size: 13pt;
      color: #374151;
      margin-bottom: 10px;
    }
    
    .zoning-description {
      font-size: 10pt;
      color: #6b7280;
      line-height: 1.5;
    }
    
    .uses-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-top: 15px;
    }
    
    .uses-column {
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 15px;
    }
    
    .uses-column.permitted {
      background: #ecfdf5;
      border-color: #10b981;
    }
    
    .uses-column.conditional {
      background: #fef3c7;
      border-color: #f59e0b;
    }
    
    .uses-column.prohibited {
      background: #fee2e2;
      border-color: #ef4444;
    }
    
    .column-header {
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 10px;
      padding-bottom: 5px;
      border-bottom: 2px solid currentColor;
    }
    
    .permitted .column-header {
      color: #10b981;
    }
    
    .conditional .column-header {
      color: #f59e0b;
    }
    
    .prohibited .column-header {
      color: #ef4444;
    }
    
    .use-item {
      font-size: 9pt;
      padding: 5px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .use-item:last-child {
      border-bottom: none;
    }
    
    .use-category {
      font-weight: 600;
      color: #374151;
    }
    
    .use-name {
      color: #6b7280;
      margin-left: 5px;
    }
    
    .standards-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }
    
    .standards-table th,
    .standards-table td {
      padding: 12px;
      text-align: left;
      border: 1px solid #e5e7eb;
    }
    
    .standards-table th {
      background: #152F50;
      color: white;
      font-weight: 600;
      font-size: 10pt;
    }
    
    .standards-table td {
      font-size: 10pt;
      background: white;
    }
    
    .standards-table tr:nth-child(even) td {
      background: #f9fafb;
    }
    
    .permits-list {
      margin-top: 15px;
    }
    
    .permit-item {
      padding: 12px;
      margin-bottom: 10px;
      border-left: 4px solid #152F50;
      background: #f9fafb;
      border-radius: 4px;
    }
    
    .permit-title {
      font-weight: bold;
      color: #152F50;
      margin-bottom: 5px;
    }
    
    .permit-description {
      font-size: 9pt;
      color: #6b7280;
    }
    
    .permit-timeline {
      font-size: 9pt;
      color: #f59e0b;
      margin-top: 5px;
      font-weight: 600;
    }
    
    .map-container {
      width: 100%;
      height: 400px;
      margin-top: 15px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .map-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .flood-zone-box {
      background: #dbeafe;
      border: 2px solid #3b82f6;
      border-radius: 8px;
      padding: 15px;
      margin-top: 15px;
    }
    
    .flood-zone-title {
      font-weight: bold;
      color: #1e40af;
      margin-bottom: 5px;
    }
    
    .contact-box {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      padding: 20px;
      margin-top: 15px;
    }
    
    .contact-title {
      font-weight: bold;
      color: #152F50;
      margin-bottom: 10px;
    }
    
    .contact-item {
      font-size: 10pt;
      margin-bottom: 5px;
    }
    
    .disclaimer {
      background: #fef3c7;
      border: 2px solid #f59e0b;
      border-radius: 8px;
      padding: 20px;
      margin-top: 30px;
      page-break-inside: avoid;
    }
    
    .disclaimer-title {
      font-weight: bold;
      color: #92400e;
      margin-bottom: 10px;
      font-size: 12pt;
    }
    
    .disclaimer-text {
      font-size: 9pt;
      color: #78350f;
      line-height: 1.6;
    }
    
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 9pt;
      color: #6b7280;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">Delaware Zoning</div>
    <div class="report-title">Professional Property Zoning Report</div>
    <div class="property-address">${address}</div>
  </div>
  
  <div class="meta-info">
    <div class="meta-item">
      <div class="meta-label">Report Generated</div>
      <div class="meta-value">${generatedDate}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">County</div>
      <div class="meta-value">${zoning.county}</div>
    </div>
    <div class="meta-item">
      <div class="meta-label">Coordinates</div>
      <div class="meta-value">${coordinates.latitude.toFixed(6)}, ${coordinates.longitude.toFixed(6)}</div>
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">Zoning Classification</div>
    <div class="zoning-box">
      <div class="zoning-code">${zoning.districtCode}</div>
      <div class="zoning-name">${zoning.name}</div>
      ${zoning.description ? `<div class="zoning-description">${zoning.description}</div>` : ''}
    </div>
  </div>
  
  ${zoning.permittedUses && zoning.permittedUses.length > 0 ? `
  <div class="section">
    <div class="section-title">Permitted Uses</div>
    <div class="uses-grid">
      <div class="uses-column permitted">
        <div class="column-header">✓ Permitted by-right (${permitted.length})</div>
        ${permitted.map(use => `
          <div class="use-item">
            <span class="use-category">${use.use_category}</span>
            <span class="use-name">- ${use.use_name}</span>
          </div>
        `).join('')}
        ${permitted.length === 0 ? '<div class="use-item">No uses listed</div>' : ''}
      </div>
      
      <div class="uses-column conditional">
        <div class="column-header">⚠ Conditional Uses (${conditional.length})</div>
        ${conditional.map(use => `
          <div class="use-item">
            <span class="use-category">${use.use_category}</span>
            <span class="use-name">- ${use.use_name}</span>
          </div>
        `).join('')}
        ${conditional.length === 0 ? '<div class="use-item">No uses listed</div>' : ''}
      </div>
      
      <div class="uses-column prohibited">
        <div class="column-header">✗ Prohibited (${prohibited.length})</div>
        ${prohibited.map(use => `
          <div class="use-item">
            <span class="use-category">${use.use_category}</span>
            <span class="use-name">- ${use.use_name}</span>
          </div>
        `).join('')}
        ${prohibited.length === 0 ? '<div class="use-item">No uses listed</div>' : ''}
      </div>
    </div>
  </div>
  ` : ''}
  
  ${zoning.dimensionalStandards ? `
  <div class="section">
    <div class="section-title">Dimensional Standards</div>
    <table class="standards-table">
      <thead>
        <tr>
          <th>Requirement</th>
          <th>Minimum/Maximum</th>
          <th>Notes</th>
        </tr>
      </thead>
      <tbody>
        ${zoning.dimensionalStandards.min_lot_size ? `
          <tr>
            <td><strong>Minimum Lot Size</strong></td>
            <td>${zoning.dimensionalStandards.min_lot_size.toLocaleString()} sq ft</td>
            <td>Required for new development</td>
          </tr>
        ` : ''}
        ${zoning.dimensionalStandards.front_setback ? `
          <tr>
            <td><strong>Front Setback</strong></td>
            <td>${zoning.dimensionalStandards.front_setback} feet</td>
            <td>From front property line</td>
          </tr>
        ` : ''}
        ${zoning.dimensionalStandards.side_setback ? `
          <tr>
            <td><strong>Side Setback</strong></td>
            <td>${zoning.dimensionalStandards.side_setback} feet</td>
            <td>Each side</td>
          </tr>
        ` : ''}
        ${zoning.dimensionalStandards.rear_setback ? `
          <tr>
            <td><strong>Rear Setback</strong></td>
            <td>${zoning.dimensionalStandards.rear_setback} feet</td>
            <td>From rear property line</td>
          </tr>
        ` : ''}
        ${zoning.dimensionalStandards.max_height ? `
          <tr>
            <td><strong>Maximum Height</strong></td>
            <td>${zoning.dimensionalStandards.max_height} feet</td>
            <td>Building height limit</td>
          </tr>
        ` : ''}
        ${zoning.dimensionalStandards.max_lot_coverage ? `
          <tr>
            <td><strong>Maximum Lot Coverage</strong></td>
            <td>${(zoning.dimensionalStandards.max_lot_coverage * 100).toFixed(0)}%</td>
            <td>Impervious surface limit</td>
          </tr>
        ` : ''}
        ${zoning.dimensionalStandards.parking_ratio ? `
          <tr>
            <td><strong>Parking Requirements</strong></td>
            <td>${zoning.dimensionalStandards.parking_ratio} spaces per unit</td>
            <td>${zoning.dimensionalStandards.parking_notes || 'Off-street parking required'}</td>
          </tr>
        ` : ''}
      </tbody>
    </table>
  </div>
  ` : ''}
  
  ${zoning.requiredPermits && zoning.requiredPermits.length > 0 ? `
  <div class="section">
    <div class="section-title">Required Permits & Approvals</div>
    <div class="permits-list">
      ${zoning.requiredPermits.map(permit => `
        <div class="permit-item">
          <div class="permit-title">${permit.permit_type}${permit.required ? ' (Required)' : ' (Optional)'}</div>
          ${permit.description ? `<div class="permit-description">${permit.description}</div>` : ''}
          ${permit.review_timeline ? `<div class="permit-timeline">Review Timeline: ${permit.review_timeline}</div>` : ''}
        </div>
      `).join('')}
    </div>
  </div>
  ` : ''}
  
  ${zoning.floodZone ? `
  <div class="section">
    <div class="section-title">Flood Zone Information</div>
    <div class="flood-zone-box">
      <div class="flood-zone-title">FEMA Flood Zone: ${zoning.floodZone.fema_zone}</div>
      <div><strong>Risk Level:</strong> ${zoning.floodZone.flood_risk}</div>
      ${zoning.floodZone.zone_description ? `<div>${zoning.floodZone.zone_description}</div>` : ''}
    </div>
  </div>
  ` : ''}
  
  <div class="section">
    <div class="section-title">Property Location</div>
    <div class="map-container">
      <img src="${mapUrl}" alt="Property Location Map" />
    </div>
  </div>
  
  <div class="section">
    <div class="section-title">County Planning Office Contact</div>
    <div class="contact-box">
      <div class="contact-title">${zoning.county} Planning Department</div>
      ${getCountyContact(zoning.county)}
    </div>
  </div>
  
  <div class="disclaimer">
    <div class="disclaimer-title">⚠ Important Disclaimer</div>
    <div class="disclaimer-text">
      This report is provided for informational purposes only and should not be considered legal advice or an official determination. 
      Zoning regulations are subject to change, and this information may not reflect the most current ordinances or amendments. 
      Property owners should verify all information with the ${zoning.county} Planning Department before making any development 
      or purchase decisions. Additional restrictions may apply, including but not limited to: homeowners association rules, 
      deed restrictions, historic district regulations, and environmental constraints. This report does not constitute a 
      zoning certification or official zoning determination.
      <br><br>
      <strong>Data Source:</strong> ${zoning.county} GIS and Planning Department records
      <br>
      <strong>Report Generated:</strong> ${generatedDate}
    </div>
  </div>
  
  <div class="footer">
    <div><strong>Delaware Zoning</strong> | Professional Property Research</div>
    <div>support@delawarezoning.com | www.delawarezoning.com</div>
    <div>© ${new Date().getFullYear()} Delaware Zoning. All rights reserved.</div>
  </div>
</body>
</html>
  `;
}

function generateStaticMapUrl(lat: number, lon: number): string {
  const apiKey = serverEnv.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const center = `${lat},${lon}`;
  const zoom = 16;
  const size = '800x400';
  const marker = `color:red|${center}`;
  
  return `https://maps.googleapis.com/maps/api/staticmap?center=${center}&zoom=${zoom}&size=${size}&markers=${marker}&maptype=roadmap&key=${apiKey}`;
}

function getCountyContact(county: string): string {
  const contacts: Record<string, string> = {
    'New Castle': `
      <div class="contact-item"><strong>Address:</strong> 87 Reads Way, New Castle, DE 19720</div>
      <div class="contact-item"><strong>Phone:</strong> (302) 395-5400</div>
      <div class="contact-item"><strong>Website:</strong> www.newcastlede.gov</div>
    `,
    'Kent': `
      <div class="contact-item"><strong>Address:</strong> 555 Bay Road, Dover, DE 19901</div>
      <div class="contact-item"><strong>Phone:</strong> (302) 744-2471</div>
      <div class="contact-item"><strong>Website:</strong> www.co.kent.de.us</div>
    `,
    'Sussex': `
      <div class="contact-item"><strong>Address:</strong> 2 The Circle, Georgetown, DE 19947</div>
      <div class="contact-item"><strong>Phone:</strong> (302) 855-7878</div>
      <div class="contact-item"><strong>Website:</strong> www.sussexcountyde.gov</div>
    `
  };
  
  return contacts[county] || `
    <div class="contact-item"><strong>County:</strong> ${county}</div>
    <div class="contact-item">Please contact your local planning department for more information.</div>
  `;
}

