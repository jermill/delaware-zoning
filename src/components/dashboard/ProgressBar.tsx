import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  max: number | null;
  label?: string;
  showPercentage?: boolean;
}

export default function ProgressBar({ current, max, label, showPercentage = true }: ProgressBarProps) {
  if (max === null) {
    return (
      <div className="w-full">
        {label && <p className="text-sm text-gray-600 mb-2">{label}</p>}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-delaware-gold"
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </div>
          <span className="text-sm font-medium text-gray-700">Unlimited</span>
        </div>
      </div>
    );
  }

  const percentage = Math.min((current / max) * 100, 100);
  const isNearLimit = percentage >= 80;
  const isAtLimit = percentage >= 100;

  return (
    <div className="w-full">
      {label && <p className="text-sm text-gray-600 mb-2">{label}</p>}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div
            className={`h-full ${
              isAtLimit
                ? 'bg-error'
                : isNearLimit
                ? 'bg-yellow-500'
                : 'bg-delaware-blue'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
        {showPercentage && (
          <span className={`text-sm font-medium ${
            isAtLimit ? 'text-error' : isNearLimit ? 'text-yellow-600' : 'text-gray-700'
          }`}>
            {current}/{max}
          </span>
        )}
      </div>
    </div>
  );
}
