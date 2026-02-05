import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { AverageResponseTime } from './types';

interface ResponseTimeChartProps {
  data: AverageResponseTime[];
  lineColor?: string;
  title?: string;
  yAxisLabel?: string;
}

const ResponseTimeChart: React.FC<ResponseTimeChartProps> = ({ 
  data, 
  lineColor = '#3b82f6',
  title = 'Average Response Time by Section',
  yAxisLabel = 'Time (minutes)'
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="section" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip 
            formatter={(value: number) => [`${value} min`, 'Avg Time']}
            contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="avgTime" 
            stroke={lineColor} 
            strokeWidth={3}
            dot={{ fill: lineColor, r: 6 }}
            activeDot={{ r: 8 }}
            name="Average Time"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ResponseTimeChart;
