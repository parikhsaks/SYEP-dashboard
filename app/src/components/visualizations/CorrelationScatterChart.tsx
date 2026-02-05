// ============================================================================
// CORRELATION SCATTER CHART (DEMO-ONLY)
// ============================================================================
// Interactive scatter/3D bubble chart that visualizes synthetic relationships
// between satisfaction, preparedness, and well-being. Driven by `SampleData`
// and not currently connected to the real CSV pipeline.
import React, { useState } from 'react';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
  Cell,
} from 'recharts';
import type { CorrelationData2 } from './types';

interface CorrelationScatterChartProps {
  data: CorrelationData2[];
  title?: string;
  description?: string;
}

const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  tertiary: '#ec4899',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
};

type CorrelationType = 'sat-prep' | 'prep-well' | 'matrix';

const CorrelationScatterChart: React.FC<CorrelationScatterChartProps> = ({ 
  data,
  title = "Correlation Analysis",
  description = "Explore relationships between satisfaction, preparedness, and well-being"
}) => {
  const [selectedCorrelation, setSelectedCorrelation] = useState<CorrelationType>('sat-prep');

  const renderChart = () => {
    if (selectedCorrelation === 'sat-prep') {
      return (
        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            type="number" 
            dataKey="preparedness" 
            name="Preparedness"
            domain={[0, 5]}
            tick={{ fill: '#475569' }}
            label={{ value: 'Preparedness Score', position: 'bottom', offset: 20, style: { fill: '#475569' } }}
          />
          <YAxis 
            type="number" 
            dataKey="satisfaction" 
            name="Satisfaction"
            domain={[0, 5]}
            tick={{ fill: '#475569' }}
            label={{ value: 'Satisfaction Score', angle: -90, position: 'insideLeft', style: { fill: '#475569' } }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Scatter 
            name="Participants" 
            data={data} 
            fill={COLORS.primary}
            fillOpacity={0.6}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS.primary} />
            ))}
          </Scatter>
        </ScatterChart>
      );
    } else if (selectedCorrelation === 'prep-well') {
      return (
        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            type="number" 
            dataKey="preparedness" 
            name="Preparedness"
            domain={[0, 5]}
            tick={{ fill: '#475569' }}
            label={{ value: 'Preparedness Score', position: 'bottom', offset: 20, style: { fill: '#475569' } }}
          />
          <YAxis 
            type="number" 
            dataKey="wellbeing" 
            name="Well-being"
            domain={[0, 5]}
            tick={{ fill: '#475569' }}
            label={{ value: 'Well-being Score', angle: -90, position: 'insideLeft', style: { fill: '#475569' } }}
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Scatter 
            name="Participants" 
            data={data} 
            fill={COLORS.secondary}
            fillOpacity={0.6}
          />
        </ScatterChart>
      );
    } else {
      return (
        <ScatterChart margin={{ top: 20, right: 30, bottom: 40, left: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis 
            type="number" 
            dataKey="satisfaction" 
            name="Satisfaction"
            domain={[0, 5]}
            tick={{ fill: '#475569' }}
            label={{ value: 'Satisfaction Score', position: 'bottom', offset: 20, style: { fill: '#475569' } }}
          />
          <YAxis 
            type="number" 
            dataKey="preparedness" 
            name="Preparedness"
            domain={[0, 5]}
            tick={{ fill: '#475569' }}
            label={{ value: 'Preparedness Score', angle: -90, position: 'insideLeft', style: { fill: '#475569' } }}
          />
          <ZAxis 
            type="number" 
            dataKey="wellbeing" 
            range={[50, 400]} 
            name="Well-being"
          />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{ backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}
            formatter={(value: number) => value.toFixed(2)}
          />
          <Scatter 
            name="Participants" 
            data={data} 
            fill={COLORS.tertiary}
            fillOpacity={0.6}
          />
        </ScatterChart>
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-4 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-1">{title}</h2>
          <p className="text-slate-600 text-sm">{description}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCorrelation('sat-prep')}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedCorrelation === 'sat-prep'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            Satisfaction vs Preparedness
          </button>
          <button
            onClick={() => setSelectedCorrelation('prep-well')}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedCorrelation === 'prep-well'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            Preparedness vs Well-being
          </button>
          <button
            onClick={() => setSelectedCorrelation('matrix')}
            className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
              selectedCorrelation === 'matrix'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
            }`}
          >
            3D Matrix
          </button>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
      <p className="text-center text-sm text-slate-500 mt-2">
        {selectedCorrelation === 'matrix' 
          ? 'Bubble size represents well-being score • Positive correlations visible across all dimensions'
          : 'Each point represents an individual participant • Trend suggests positive correlation'
        }
      </p>
    </div>
  );
};

export default CorrelationScatterChart;
