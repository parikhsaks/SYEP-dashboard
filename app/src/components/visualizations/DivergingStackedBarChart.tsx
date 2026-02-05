// ============================================================================
// DIVERGING STACKED BAR CHART COMPONENT
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
} from 'recharts';
import type { FrequencyData } from './types';


interface DivergingStackedBarChartProps {
  data: FrequencyData[];
  height?: number;
  title?: string;
  description?: string;
}

// ============================================================================
// CUSTOM TOOLTIP COMPONENTS
// ============================================================================

const FrequencyTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-300 rounded shadow-lg">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }} className="text-sm">
            {entry.name}: {Math.abs(entry.value)}%
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DivergingStackedBarChart: React.FC<DivergingStackedBarChartProps> = ({
  data,
  height = 400,
  title = 'Frequency Scale Distribution (Never → Always)',
  description = 'Percentage distribution of responses across frequency scales for various well-being metrics',
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-600 mb-4 text-sm">{description}</p>
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout="vertical"
          stackOffset="sign"
          margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" domain={[-50, 100]} />
          <YAxis type="category" dataKey="metric" />
          <Tooltip content={<FrequencyTooltip />} />
          <Legend />
          <Bar dataKey="Never" fill="#1e40af" stackId="stack" />
          <Bar dataKey="Rarely" fill="#3b82f6" stackId="stack" />
          <Bar dataKey="Sometimes" fill="#cbd5e1" stackId="stack" />
          <Bar dataKey="Often" fill="#f97316" stackId="stack" />
          <Bar dataKey="Always" fill="#dc2626" stackId="stack" />
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Interpretation:</strong> Negative values (left) represent lower
          frequency responses (Never, Rarely), while positive values (right) represent
          higher frequency responses (Often, Always).
        </p>
      </div>
    </div>
  );
};

export default DivergingStackedBarChart;
