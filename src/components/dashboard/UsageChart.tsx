import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface UsageChartProps {
  data: Array<{
    date: string;
    searches: number;
  }>;
}

export default function UsageChart({ data }: UsageChartProps) {
  const [timeRange, setTimeRange] = useState<'7' | '30'>('30');

  // Filter data based on selected time range
  const filteredData = timeRange === '7' ? data.slice(-7) : data;

  // Calculate total searches
  const totalSearches = filteredData.reduce((sum, day) => sum + day.searches, 0);

  // Empty state
  if (data.length === 0 || totalSearches === 0) {
    return (
      <motion.div 
        className="bg-white rounded-2xl shadow-md p-5 border border-[#A8BDBE] h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">Search Activity</h3>
            <p className="text-xs text-gray-500 mt-0.5">Last 30 Days</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center min-h-[220px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No search activity yet</p>
            <p className="text-xs text-gray-500">Start searching to see your activity here</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-md p-5 border border-[#A8BDBE] h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-900">Search Activity</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {totalSearches} {totalSearches === 1 ? 'search' : 'searches'} in last {timeRange} days
          </p>
        </div>
        
        {/* Time range selector */}
        <div className="flex bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setTimeRange('7')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              timeRange === '7'
                ? 'bg-white text-[#152F50] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            7 days
          </button>
          <button
            onClick={() => setTimeRange('30')}
            className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
              timeRange === '30'
                ? 'bg-white text-[#152F50] shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            30 days
          </button>
        </div>
      </div>
      
      <div className="flex-1 min-h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} strokeOpacity={0.5} />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              style={{ fontSize: '11px', fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#6B7280' }}
              interval="preserveStartEnd"
              minTickGap={30}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '11px', fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              width={25}
              tick={{ fill: '#6B7280' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '2px', color: '#111827', fontSize: '11px' }}
              itemStyle={{ color: '#152F50', fontWeight: 500, fontSize: '12px' }}
              cursor={{ stroke: '#82B8DE', strokeWidth: 1, strokeDasharray: '5 5' }}
            />
            <Area 
              type="monotone" 
              dataKey="searches" 
              stroke="#152F50" 
              strokeWidth={2}
              fill="#82B8DE"
              dot={false}
              activeDot={{ r: 4, fill: '#152F50', strokeWidth: 2, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
