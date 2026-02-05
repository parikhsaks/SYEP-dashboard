import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { SectionCompletion } from './types';

interface CompletionRateChartProps {
  data: SectionCompletion[];
  colors?: string[];
  title?: string;
}

const defaultColors = ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#ef4444'];

const CompletionRateChart: React.FC<CompletionRateChartProps> = ({ 
  data, 
  colors = defaultColors,
  title = 'Completion Rate by Section'
}) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">{title}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="section" 
            angle={-45} 
            textAnchor="end" 
            height={100}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            label={{ value: 'Completion Rate (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}%`, 'Completion Rate']}
            contentStyle={{ backgroundColor: 'white', border: '1px solid #ccc' }}
          />
          <Bar dataKey="completionRate" radius={[8, 8, 0, 0]}>
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompletionRateChart;
