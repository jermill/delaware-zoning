import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

interface CountyBreakdownChartProps {
  data: Array<{
    name: string;
    value: number;
  }>;
}

const COLORS = ['#152F50', '#82B8DE', '#D8B368'];

export default function CountyBreakdownChart({ data }: CountyBreakdownChartProps) {
  const totalProperties = data.reduce((sum, county) => sum + county.value, 0);
  const topCounty = data.length > 0 ? data.reduce((prev, current) => (prev.value > current.value ? prev : current)) : null;
  const topCountyPercentage = topCounty && totalProperties > 0 ? ((topCounty.value / totalProperties) * 100).toFixed(0) : 0;

  // Empty state
  if (data.length === 0 || totalProperties === 0) {
    return (
      <motion.div 
        className="bg-white rounded-2xl shadow-md p-5 border border-[#A8BDBE] h-full flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex items-baseline justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-gray-900">County Distribution</h3>
            <p className="text-xs text-gray-500 mt-0.5">Saved Properties</p>
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center min-h-[220px]">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">No saved properties</p>
            <p className="text-xs text-gray-500">Save properties to see county breakdown</p>
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
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex items-baseline justify-between mb-2">
        <div>
          <h3 className="text-base font-bold text-gray-900">County Distribution</h3>
          <p className="text-xs text-gray-500 mt-0.5">{totalProperties} saved {totalProperties === 1 ? 'property' : 'properties'}</p>
        </div>
      </div>
      
      {/* Insight */}
      {topCounty && (
        <div className="mb-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-gray-700">
            <span className="font-semibold text-[#152F50]">{topCounty.name}</span> accounts for{' '}
            <span className="font-semibold">{topCountyPercentage}%</span> of saved properties
          </p>
        </div>
      )}
      
      <div className="flex-1 min-h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={65}
              fill="#8884d8"
              dataKey="value"
              strokeWidth={2}
              stroke="#fff"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '8px 12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                fontSize: '12px'
              }}
              itemStyle={{ fontWeight: 500 }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={30}
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', fontWeight: 500 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

