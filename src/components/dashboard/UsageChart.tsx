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
      className="bg-white rounded-2xl shadow-md p-6 border border-[#A8BDBE]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Search Activity</h3>
        <p className="text-sm text-gray-600 mb-6">Last 30 Days</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="#9CA3AF"
              style={{ fontSize: '12px', fontWeight: 500 }}
              tickLine={false}
              axisLine={{ stroke: '#E5E7EB' }}
            />
            <YAxis 
              stroke="#9CA3AF"
              style={{ fontSize: '12px', fontWeight: 500 }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              labelStyle={{ fontWeight: 600, marginBottom: '4px', color: '#111827' }}
              itemStyle={{ color: '#2C5F9E', fontWeight: 500 }}
            />
            <Area 
              type="monotone" 
              dataKey="searches" 
              stroke="#152F50" 
              strokeWidth={3}
              fill="#82B8DE"
              dot={{ r: 4, fill: '#152F50', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#152F50', strokeWidth: 3, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

