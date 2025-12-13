import { FiAlertCircle, FiCheckCircle, FiTrendingUp } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface AnalyticsStatusStripProps {
  tier: 'looker' | 'pro' | 'whale';
  tierName: string;
  searchesUsed: number;
  searchLimit: number | null;
  nextBillingDate?: string;
}

export default function AnalyticsStatusStrip({
  tier,
  tierName,
  searchesUsed,
  searchLimit,
  nextBillingDate
}: AnalyticsStatusStripProps) {
  const getUsageStatus = () => {
    if (searchLimit === null) return 'unlimited';
    const percentage = (searchesUsed / searchLimit) * 100;
    if (percentage >= 80) return 'warning';
    if (percentage >= 50) return 'moderate';
    return 'good';
  };

  const status = getUsageStatus();

  return (
    <motion.div
      className={`rounded-xl p-4 border-2 ${
        status === 'warning'
          ? 'bg-amber-50 border-amber-200'
          : status === 'moderate'
          ? 'bg-blue-50 border-blue-200'
          : 'bg-gray-50 border-gray-200'
      }`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between flex-wrap gap-3">
        {/* Left side - Status message */}
        <div className="flex items-center gap-3">
          {status === 'warning' ? (
            <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          ) : status === 'unlimited' ? (
            <FiTrendingUp className="w-5 h-5 text-[#152F50] flex-shrink-0" />
          ) : (
            <FiCheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          )}
          
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {status === 'warning' ? (
                `⚠️ You've used ${searchesUsed} of ${searchLimit} searches`
              ) : status === 'unlimited' ? (
                `🚀 ${tierName} • Unlimited searches`
              ) : (
                `✓ ${tierName} • ${searchesUsed} of ${searchLimit} searches used`
              )}
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              {status === 'warning' ? (
                'Upgrade to get unlimited access and unlock advanced features'
              ) : status === 'unlimited' ? (
                nextBillingDate ? `Next billing: ${new Date(nextBillingDate).toLocaleDateString()}` : 'Active subscription'
              ) : (
                `${searchLimit! - searchesUsed} searches remaining this month`
              )}
            </p>
          </div>
        </div>

        {/* Right side - CTA */}
        {tier !== 'whale' && (
          <a
            href="/dashboard?tab=billing"
            className="px-4 py-2 bg-[#152F50] text-white rounded-lg text-sm font-semibold hover:bg-[#82B8DE] transition-colors whitespace-nowrap"
          >
            Upgrade Plan
          </a>
        )}
      </div>
    </motion.div>
  );
}
