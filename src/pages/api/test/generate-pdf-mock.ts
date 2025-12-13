import type { NextApiRequest, NextApiResponse } from 'next';
import { generateZoningReportPDF } from '@/lib/pdf-generator';

/**
 * Test endpoint for PDF generation with MOCK data
 * Bypasses database queries to test PDF generation
 * 
 * Usage: GET /api/test/generate-pdf-mock
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow in development
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Test endpoint not available in production' });
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('🧪 Testing PDF generation with mock data...');

    // Mock comprehensive zoning data
    const mockZoningData = {
      id: 'test-zone-123',
      districtCode: 'R-1',
      name: 'Single Family Residential - 10,000 sq ft lots',
      description: 'Low-density single-family residential district designed to provide for single-family homes on larger lots with ample open space.',
      county: 'New Castle',
      municipality: 'Wilmington',
      permittedUses: [
        { use_category: 'Residential', use_name: 'Single-family detached dwelling', status: 'permitted' as const },
        { use_category: 'Residential', use_name: 'Accessory dwelling unit', status: 'permitted' as const },
        { use_category: 'Agricultural', use_name: 'Home gardening', status: 'permitted' as const },
        { use_category: 'Accessory', use_name: 'Private garage', status: 'permitted' as const },
        { use_category: 'Residential', use_name: 'Duplex', status: 'conditional' as const },
        { use_category: 'Institutional', use_name: 'Church or place of worship', status: 'conditional' as const },
        { use_category: 'Educational', use_name: 'Private school', status: 'conditional' as const },
        { use_category: 'Commercial', use_name: 'Retail store', status: 'prohibited' as const },
        { use_category: 'Commercial', use_name: 'Restaurant', status: 'prohibited' as const },
        { use_category: 'Industrial', use_name: 'Manufacturing facility', status: 'prohibited' as const },
      ],
      dimensionalStandards: {
        min_lot_size: 10000,
        front_setback: 25,
        side_setback: 10,
        rear_setback: 30,
        max_height: 35,
        max_lot_coverage: 0.35,
        parking_ratio: 2,
        parking_notes: 'Two spaces required per dwelling unit, must be off-street',
      },
      requiredPermits: [
        {
          permit_type: 'Building Permit',
          required: true,
          description: 'Required for all new construction and major renovations',
          review_timeline: '4-6 weeks',
        },
        {
          permit_type: 'Site Plan Review',
          required: true,
          description: 'Review of site layout, drainage, and landscaping',
          review_timeline: '6-8 weeks',
        },
        {
          permit_type: 'Zoning Variance',
          required: false,
          description: 'Only required if seeking exception to dimensional standards',
          review_timeline: '8-12 weeks',
        },
      ],
      floodZone: {
        fema_zone: 'X',
        flood_risk: 'Minimal Flood Risk',
        zone_description: 'Area of minimal flood hazard, usually above the 500-year flood level',
      },
    };

    // Generate PDF
    console.log('1. Generating PDF with mock data...');
    const startTime = Date.now();
    const pdfBuffer = await generateZoningReportPDF({
      address: '123 Main Street, Wilmington, DE 19801',
      coordinates: { latitude: 39.7459, longitude: -75.5466 },
      zoning: mockZoningData,
    });
    const generationTime = Date.now() - startTime;
    console.log(`✅ PDF generated in ${generationTime}ms (${pdfBuffer.length} bytes)`);

    // Return PDF as download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Delaware-Zoning-Report-MOCK-TEST.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.status(200).send(pdfBuffer);

  } catch (error: any) {
    console.error('Test PDF generation failed:', error);
    res.status(500).json({ 
      error: error.message || 'Failed to generate PDF',
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}

