import type { NextApiRequest, NextApiResponse } from 'next';
import { generateZoningReportPDF } from '@/lib/pdf-generator';
import { fetchZoningData } from '@/lib/zoning-data-fetcher';

/**
 * Test endpoint for PDF generation
 * Only enabled in development mode
 * 
 * Usage: GET /api/test/generate-report?lat=39.7459&lon=-75.5466&address=10 E 10th St, Wilmington, DE
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
    const { lat, lon, address } = req.query;

    if (!lat || !lon || !address) {
      return res.status(400).json({ 
        error: 'Missing required parameters: lat, lon, and address are required',
        example: '/api/test/generate-report?lat=39.7459&lon=-75.5466&address=10 E 10th St, Wilmington, DE'
      });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lon as string);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ error: 'Invalid coordinates' });
    }

    console.log(`🧪 Testing PDF generation for: ${address}`);

    // Fetch zoning data
    console.log('1. Fetching zoning data...');
    const zoningData = await fetchZoningData(latitude, longitude);
    console.log(`✅ Zoning data fetched: ${zoningData.districtCode}`);

    // Generate PDF
    console.log('2. Generating PDF...');
    const startTime = Date.now();
    const pdfBuffer = await generateZoningReportPDF({
      address: address as string,
      coordinates: { latitude, longitude },
      zoning: zoningData,
    });
    const generationTime = Date.now() - startTime;
    console.log(`✅ PDF generated in ${generationTime}ms (${pdfBuffer.length} bytes)`);

    // Return PDF as download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Zoning-Report-Test.pdf"`);
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
