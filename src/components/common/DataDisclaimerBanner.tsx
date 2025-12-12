import React from 'react';

interface DataDisclaimerBannerProps {
  variant?: 'default' | 'compact' | 'prominent';
  className?: string;
}

/**
 * DataDisclaimerBanner Component
 * 
 * Displays important information about data coverage and accuracy.
 * Updated to reflect REAL data from New Castle and Sussex Counties.
 * 
 * Variants:
 * - default: Standard banner for most pages
 * - compact: Smaller version for sidebars/footers
 * - prominent: Large, attention-grabbing version for search results
 */
export default function DataDisclaimerBanner({ 
  variant = 'default',
  className = '' 
}: DataDisclaimerBannerProps) {
  
  if (variant === 'compact') {
    return (
      <div className={`bg-blue-50 border border-blue-300 rounded-md p-3 text-xs ${className}`}>
        <div className="flex items-start gap-2">
          <span className="text-blue-600 font-bold text-sm">ℹ️</span>
          <div className="flex-1">
            <p className="text-blue-800 font-medium">Official County Data</p>
            <p className="text-blue-700 mt-1">
              1,000+ real zoning districts from New Castle & Sussex Counties. Always verify with county planning offices before making property decisions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'prominent') {
    return (
      <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-400 rounded-lg shadow-md ${className}`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">ℹ️</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-blue-900 mb-2">
                Data Accuracy Notice
              </h3>
              <div className="text-blue-800 space-y-2">
                <p className="font-medium">
                  Zoning data sourced from <strong>official Delaware county GIS systems</strong> and updated regularly.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li><strong>New Castle County:</strong> 999 verified districts from official ArcGIS REST API</li>
                  <li><strong>Sussex County:</strong> 63 verified districts from official ArcGIS REST API</li>
                  <li><strong>Kent County:</strong> Coming soon - integration in progress</li>
                  <li>Zoning regulations can change - always verify before making property decisions</li>
                </ul>
                <p className="text-sm font-semibold mt-3">
                  📞 For the most current official information, contact:
                </p>
                <div className="text-sm mt-2 space-y-1">
                  <p>• New Castle County Planning: (302) 395-5400</p>
                  <p>• Sussex County Planning: (302) 855-7878</p>
                  <p>• Kent County Planning: (302) 744-2471</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div className={`bg-blue-100 border-l-4 border-blue-500 rounded-md shadow-sm ${className}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-blue-600 font-bold text-xl">ℹ️</span>
          <div className="flex-1">
            <h4 className="text-blue-900 font-bold text-sm mb-1">
              Data Accuracy Notice
            </h4>
            <p className="text-blue-800 text-sm">
              Zoning data sourced from official Delaware county GIS systems. Currently serving 
              <strong> 1,000+ verified zoning districts</strong> in New Castle and Sussex Counties.
              Kent County coverage coming soon.
            </p>
            <p className="text-blue-700 text-xs mt-2">
              While we strive for accuracy, zoning regulations can change. Always verify with your county planning office before making property decisions. 
              See our <a href="/data-disclaimer" className="underline font-medium hover:text-blue-900">
                Data Disclaimer page
              </a> for details.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Inline disclaimer for smaller UI elements
 */
export function InlineDataDisclaimer({ className = '' }: { className?: string }) {
  return (
    <p className={`text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded border border-blue-200 ${className}`}>
      ℹ️ <strong>Official data:</strong> Sourced from county GIS. Always verify with planning offices before making decisions.
    </p>
  );
}

/**
 * Footer disclaimer (for pages without banner)
 */
export function FooterDataDisclaimer() {
  return (
    <div className="bg-blue-900 text-blue-100 py-3 px-4 text-center text-xs border-t border-blue-800">
      <p>
        ℹ️ <strong>Data Notice:</strong> Sourced from official DE county GIS systems. 
        1,000+ verified districts in New Castle & Sussex. Kent County coming soon. 
        Always verify with planning offices before property decisions. | 
        <a href="/data-disclaimer" className="underline ml-2 hover:text-white">
          Learn More
        </a>
      </p>
    </div>
  );
}

