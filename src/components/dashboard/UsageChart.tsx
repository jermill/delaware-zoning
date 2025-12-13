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
      className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 border border-gray-200/50 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent pointer-events-none" />
      
      <div className="relative z-10">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Search Activity</h3>
        <p className="text-sm text-gray-600 mb-6">Last 30 Days</p>
        <ResponsiveContainer width="100%" height={240}>
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2C5F9E" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#2C5F9E" stopOpacity={0}/>
              </linearGradient>
            </defs>
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
              stroke="#2C5F9E" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorSearches)"
              dot={{ r: 4, fill: '#2C5F9E', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, fill: '#2C5F9E', strokeWidth: 3, stroke: '#fff' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

