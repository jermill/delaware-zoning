import { useState } from 'react';
import Link from 'next/link';
import { FaInfoCircle, FaTimes } from 'react-icons/fa';

interface CountyCoverageBannerProps {
  county?: string;
  show?: boolean;
}

export default function CountyCoverageBanner({ county, show = true }: CountyCoverageBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  // Only show for Kent County or when explicitly requested
  const shouldShow = show && !dismissed && (county?.toLowerCase() === 'kent' || county === undefined);

  if (!shouldShow) {
    return null;
  }

  const isKentCounty = county?.toLowerCase() === 'kent';

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border-l-4 border-yellow-400 p-4 mb-4 rounded-r-lg shadow-sm relative">
      <button
        onClick={() => setDismissed(true)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition-colors"
        aria-label="Dismiss banner"
      >
        <FaTimes className="text-sm" />
      </button>

      <div className="flex items-start">
        <FaInfoCircle className="text-yellow-500 text-xl mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1 pr-8">
          {isKentCounty ? (
            <>
              <h3 className="text-yellow-900 font-semibold text-base mb-1">
                Kent County Coverage Coming Soon! 🏛️
              </h3>
              <p className="text-yellow-800 text-sm mb-2">
                We're currently working with Kent County GIS to integrate their official zoning data. 
                This includes Dover and all of central Delaware.
              </p>
              <p className="text-yellow-800 text-sm mb-3">
                <strong>Currently available:</strong> New Castle County (Wilmington area) and Sussex County (Beach communities) 
                with 1,000+ verified zoning districts.
              </p>
              <Link 
                href="/kent-county-updates"
                className="inline-flex items-center text-yellow-900 font-semibold text-sm hover:text-yellow-700 transition-colors underline"
              >
                Learn more & get notified →
              </Link>
            </>
          ) : (
            <>
              <h3 className="text-yellow-900 font-semibold text-base mb-1">
                Complete Delaware Coverage
              </h3>
              <p className="text-yellow-800 text-sm">
                ✅ <strong>New Castle County</strong> - 999 districts (Wilmington, Newark)
                <br />
                ✅ <strong>Sussex County</strong> - 63 districts (Rehoboth Beach, Lewes)
                <br />
                🔄 <strong>Kent County</strong> - Coming next week! (Dover, Smyrna)
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

