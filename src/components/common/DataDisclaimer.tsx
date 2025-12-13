import { FiAlertTriangle, FiInfo } from 'react-icons/fi';

interface DataDisclaimerProps {
  variant?: 'warning' | 'info';
  showIcon?: boolean;
  compact?: boolean;
  lastVerified?: string;
  className?: string;
}

export default function DataDisclaimer({
  variant = 'warning',
  showIcon = true,
  compact = false,
  lastVerified,
  className = '',
}: DataDisclaimerProps) {
  const isWarning = variant === 'warning';
  
  const bgColor = isWarning ? 'bg-yellow-50' : 'bg-blue-50';
  const borderColor = isWarning ? 'border-yellow-400' : 'border-blue-400';
  const textColor = isWarning ? 'text-yellow-800' : 'text-blue-800';
  const iconColor = isWarning ? 'text-yellow-600' : 'text-blue-600';
  
  const Icon = isWarning ? FiAlertTriangle : FiInfo;

  if (compact) {
    return (
      <div className={`flex items-start gap-2 p-3 ${bgColor} border-l-4 ${borderColor} rounded ${className}`}>
        {showIcon && <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${iconColor}`} />}
        <p className={`text-xs ${textColor}`}>
          <strong>Disclaimer:</strong> Zoning information is for reference only. 
          Always verify with local authorities before making property decisions.
          {lastVerified && (
            <span className="block mt-1 text-xs opacity-75">
              Last verified: {new Date(lastVerified).toLocaleDateString()}
            </span>
          )}
        </p>
      </div>
    );
  }

  return (
    <div className={`${bgColor} border-l-4 ${borderColor} p-4 rounded-lg ${className}`}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <div className="flex-shrink-0">
            <Icon className={`w-5 h-5 ${iconColor}`} />
          </div>
        )}
        <div className="flex-1">
          <h4 className={`text-sm font-semibold ${textColor} mb-2`}>
            Important Legal Disclaimer
          </h4>
          <div className={`text-sm ${textColor} space-y-2`}>
            <p>
              <strong>This zoning information is provided for informational purposes only</strong> and 
              should not be relied upon as a substitute for professional legal, architectural, or zoning advice.
            </p>
            <p>
              Zoning regulations are subject to change and may have been updated since our last data verification. 
              The information provided here represents our best interpretation of available public records, 
              but errors or omissions may occur.
            </p>
            <p className="font-semibold">
              Before making any property purchase, development, or construction decisions, you must:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Verify all information with the local zoning office or planning department</li>
              <li>Consult with licensed professionals (attorneys, architects, surveyors)</li>
              <li>Obtain official zoning verification letters from the municipality</li>
              <li>Review all applicable ordinances, overlays, and special conditions</li>
            </ul>
            {lastVerified && (
              <p className="text-xs mt-3 pt-2 border-t border-yellow-300">
                Data last verified: {new Date(lastVerified).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


