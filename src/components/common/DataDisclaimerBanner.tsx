import React from 'react';

interface DataDisclaimerBannerProps {
  variant?: 'default' | 'compact' | 'prominent';
  className?: string;
}

/**
 * DataDisclaimerBanner Component
 * 
 * Displays a prominent warning that the app currently uses mock data
 * for development purposes. This component should be removed or updated
 * once real county data is integrated.
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
      <div className={`bg-amber-50 border border-amber-300 rounded-md p-3 text-xs ${className}`}>
        <div className="flex items-start gap-2">
          <span className="text-amber-600 font-bold text-sm">⚠️</span>
          <div className="flex-1">
            <p className="text-amber-800 font-medium">Development Data Only</p>
            <p className="text-amber-700 mt-1">
              Not verified with county authorities. Do not use for legal or financial decisions.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'prominent') {
    return (
      <div className={`bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-400 rounded-lg shadow-md ${className}`}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-amber-900 mb-2">
                Development Data Notice
              </h3>
              <div className="text-amber-800 space-y-2">
                <p className="font-medium">
                  This application currently uses <strong>mock zoning data</strong> for development and testing purposes only.
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm ml-2">
                  <li>Data has <strong>not been verified</strong> with Delaware county authorities</li>
                  <li>Should <strong>NOT</strong> be used for legal, financial, or property decisions</li>
                  <li>Zoning classifications and boundaries are approximate</li>
                  <li>Permitted uses and dimensional standards are generalized</li>
                </ul>
                <p className="text-sm font-semibold mt-3">
                  📞 For official zoning information, contact your local planning office:
                </p>
                <div className="text-sm mt-2 space-y-1">
                  <p>• New Castle County: (302) 395-5400</p>
                  <p>• Wilmington: (302) 576-3050</p>
                  <p>• Kent County: (302) 744-2471</p>
                  <p>• Sussex County: (302) 855-7878</p>
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
    <div className={`bg-amber-100 border-l-4 border-amber-500 rounded-md shadow-sm ${className}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <span className="text-amber-600 font-bold text-xl">⚠️</span>
          <div className="flex-1">
            <h4 className="text-amber-900 font-bold text-sm mb-1">
              Development Data Notice
            </h4>
            <p className="text-amber-800 text-sm">
              This application currently uses mock zoning data for development purposes only. 
              Data has not been verified with Delaware county authorities and should <strong>NOT</strong> be 
              used for legal, financial, or property decisions.
            </p>
            <p className="text-amber-700 text-xs mt-2">
              For official zoning information, contact your county planning office. 
              See our <a href="/data-disclaimer" className="underline font-medium hover:text-amber-900">
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
    <p className={`text-xs text-amber-700 bg-amber-50 px-3 py-2 rounded border border-amber-200 ${className}`}>
      ⚠️ <strong>Mock data:</strong> Not verified with county authorities. Do not use for legal decisions.
    </p>
  );
}

/**
 * Footer disclaimer (for pages without banner)
 */
export function FooterDataDisclaimer() {
  return (
    <div className="bg-amber-900 text-amber-100 py-3 px-4 text-center text-xs border-t border-amber-800">
      <p>
        ⚠️ <strong>Development Notice:</strong> This site uses mock zoning data for demonstration purposes. 
        Not for legal, financial, or property decisions. | 
        <a href="/data-disclaimer" className="underline ml-2 hover:text-white">
          Learn More
        </a>
      </p>
    </div>
  );
}

