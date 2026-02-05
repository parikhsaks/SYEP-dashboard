// ============================================================================
// DualBarChart Component
// ============================================================================
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';
import type { DualBarData } from './types';

interface ColorScheme {
  question1: string;
  question2: string;
  positive: string;
  negative: string;
}

const COLORS: ColorScheme = {
  question1: '#3b82f6',
  question2: '#10b981',
  positive: '#10b981',
  negative: '#ef4444'
};

interface DualBarChartProps {
  data: DualBarData[];
}

const DualBarChartComponent: React.FC<DualBarChartProps> = ({ data }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Side-by-Side Comparison
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis 
            dataKey="category" 
            angle={-45}
            textAnchor="end"
            height={100}
            tick={{ fill: '#4b5563' }}
          />
          <YAxis tick={{ fill: '#4b5563' }}>
            <Label value="Percentage (%)" angle={-90} position="insideLeft" style={{ fill: '#4b5563' }} />
          </YAxis>
          <Tooltip 
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
            formatter={(value: number) => `${value}%`}
          />
          <Legend 
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => value === 'question1' ? 'Question 1' : 'Question 2'}
          />
          <Bar dataKey="question1" fill={COLORS.question1} radius={[8, 8, 0, 0]} />
          <Bar dataKey="question2" fill={COLORS.question2} radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <p className="text-sm text-gray-600 mt-4 text-center">
        Direct comparison of response distributions with identical scales
      </p>
    </div>
  );
};

export default DualBarChartComponent;
