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
      className="bg-white rounded-2xl shadow-md p-6 border border-[#A8BDBE]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">County Distribution</h3>
        <p className="text-sm text-gray-600 mb-6">Saved Properties by County</p>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name}: ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={80}
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
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(8px)',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                padding: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
              }}
              itemStyle={{ fontWeight: 500 }}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
              wrapperStyle={{ fontSize: '14px', fontWeight: 500 }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

