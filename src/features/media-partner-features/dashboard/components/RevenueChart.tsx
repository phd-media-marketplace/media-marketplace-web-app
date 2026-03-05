import {
    BarChart,
    Bar,
    XAxis,
    // YAxis, 
    // CartesianGrid,
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import type { RevenueDataPoint } from '../dummy-data';

interface RevenueChartProps {
  data: RevenueDataPoint[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  // Transform data for better display
  const chartData = data.map(item => ({
    ...item,
    month: new Date(item.date).toLocaleDateString('en-US', { month: 'short' }),
    displayRevenue: `₵${item.revenue.toLocaleString()}`
  }));

  return (
    <div className="w-full h-75 bg-white rounded-lg shadow p-1">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 5 }}>
          {/* <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" /> */}
          <XAxis 
            dataKey="month" 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          {/* <YAxis 
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
            tickFormatter={(value: number) => `₵${value.toLocaleString()}`}
          /> */}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#fff', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px'
            }}
            formatter={(value: number) => [`₵${value.toLocaleString()}`, 'Revenue']}
          />
          <Bar 
            dataKey="revenue" 
            fill="#8b5cf6"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
