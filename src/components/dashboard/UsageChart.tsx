import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface UsageChartProps {
  data: Array<{
    date: string;
    searches: number;
  }>;
}

export default function UsageChart({ data }: UsageChartProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Search Activity (Last 30 Days)</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorSearches" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#002B5C" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#002B5C" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#6B7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
            }}
          />
          <Area 
            type="monotone" 
            dataKey="searches" 
            stroke="#002B5C" 
            fillOpacity={1} 
            fill="url(#colorSearches)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
