import { adminStats } from '@/data/mockAdminData';

export default function AdminTierBreakdown() {
  const tiers = [
    {
      name: 'The Looker',
      count: adminStats.lookerUsers,
      color: 'bg-delaware-tan',
      textColor: 'text-white',
    },
    {
      name: 'The Pro',
      count: adminStats.proUsers,
      color: 'bg-delaware-blue',
      textColor: 'text-white',
    },
    {
      name: 'The Whale',
      count: adminStats.whaleUsers,
      color: 'bg-delaware-gold',
      textColor: 'text-white',
    },
  ];

  const total = adminStats.totalUsers;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Tier Breakdown</h3>
      
      {/* Progress Bar */}
      <div className="flex h-8 rounded-lg overflow-hidden mb-4">
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            className={`${tier.color} flex items-center justify-center text-xs font-semibold ${tier.textColor} transition-all`}
            style={{ width: `${(tier.count / total) * 100}%` }}
          >
            {tier.count > 0 && tier.count}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="space-y-2">
        {tiers.map((tier) => (
          <div key={tier.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-4 h-4 rounded ${tier.color}`} />
              <span className="text-sm text-gray-700">{tier.name}</span>
            </div>
            <div className="text-sm font-medium text-gray-900">
              {tier.count} ({Math.round((tier.count / total) * 100)}%)
            </div>
          </div>
        ))}
      </div>

      {/* MRR by Tier */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Revenue by Tier</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">The Pro ($49/mo × {adminStats.proUsers})</span>
            <span className="font-medium text-gray-900">${adminStats.proUsers * 49}/mo</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-700">The Whale ($129/mo × {adminStats.whaleUsers})</span>
            <span className="font-medium text-gray-900">${adminStats.whaleUsers * 129}/mo</span>
          </div>
          <div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200">
            <span className="font-semibold text-gray-900">Total MRR</span>
            <span className="font-bold text-delaware-gold">${adminStats.totalMRR}/mo</span>
          </div>
        </div>
      </div>
    </div>
  );
}
