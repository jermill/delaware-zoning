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
  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-md p-5 border border-[#A8BDBE]"
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
      <ResponsiveContainer width="100%" height={180}>
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
    </motion.div>
  );
}

