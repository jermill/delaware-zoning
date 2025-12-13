import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface UsageChartProps {
  data: Array<{
    date: string;
    searches: number;
  }>;
}

export default function UsageChart({ data }: UsageChartProps) {
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-md p-5 border border-[#A8BDBE]"
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
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={data}>
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
    </motion.div>
  );
}
