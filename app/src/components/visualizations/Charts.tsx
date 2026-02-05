import React from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface BarChartData {
  [key: string]: string | number;
}

interface PieChartData {
  name: string;
  value: number;
}

interface LineChartData {
  [key: string]: string | number;
}

interface ScatterData {
  x: number;
  y: number;
  label?: string;
}

interface RadarData {
  subject: string;
  value: number;
}

interface ChartConfig {
  title: string;
  xAxisKey?: string;
  yAxisKey?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: number;
}

// ============================================================================
// DATA & CONSTANTS
// ============================================================================

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

// ============================================================================
// REUSABLE CHART COMPONENTS
// ============================================================================

interface BarChartComponentProps {
  data: BarChartData[];
  config: ChartConfig;
  dataKey: string;
  color?: string;
  xAxisAngle?: number;
  xAxisHeight?: number;
  yAxisDomain?: [number, number];
  showLegend?: boolean;
  stackId?: string;
  multiColor?: boolean;
}

export const BarChartComponent: React.FC<BarChartComponentProps> = ({
  data,
  config,
  dataKey,
  color = '#3b82f6',
  xAxisAngle = 0,
  xAxisHeight = 50,
  yAxisDomain,
  showLegend = false,
  stackId,
  multiColor = false
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{config.title}</h3>
      <ResponsiveContainer width="100%" height={config.height || 300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={config.xAxisKey || 'name'} 
            angle={xAxisAngle} 
            textAnchor={xAxisAngle !== 0 ? "end" : "middle"}
            height={xAxisHeight}
            label={config.xAxisLabel ? { value: config.xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
          />
          <YAxis 
            domain={yAxisDomain}
            label={config.yAxisLabel ? { value: config.yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
          <Tooltip />
          {showLegend && <Legend />}
          <Bar dataKey={dataKey} fill={color} stackId={stackId}>
            {multiColor && data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface GroupedBarChartProps {
  data: BarChartData[];
  config: ChartConfig;
  bars: Array<{ dataKey: string; name: string; color: string }>;
  xAxisAngle?: number;
  xAxisHeight?: number;
  yAxisDomain?: [number, number];
  stacked?: boolean;
}

export const GroupedBarChart: React.FC<GroupedBarChartProps> = ({
  data,
  config,
  bars,
  xAxisAngle = 0,
  xAxisHeight = 50,
  yAxisDomain,
  stacked = false
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{config.title}</h3>
      <ResponsiveContainer width="100%" height={config.height || 300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={config.xAxisKey || 'name'} 
            angle={xAxisAngle} 
            textAnchor={xAxisAngle !== 0 ? "end" : "middle"}
            height={xAxisHeight}
          />
          <YAxis domain={yAxisDomain} />
          <Tooltip />
          <Legend />
          {bars.map((bar) => (
            <Bar 
              key={bar.dataKey}
              dataKey={bar.dataKey} 
              fill={bar.color} 
              name={bar.name}
              stackId={stacked ? 'a' : undefined}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

interface PieChartComponentProps {
  data: PieChartData[];
  config: ChartConfig;
  showLabels?: boolean;
  outerRadius?: number;
  innerRadius?: number;
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({
  data,
  config,
  showLabels = true,
  outerRadius = 100,
  innerRadius = 0
}) => {
  const renderLabel = (entry: PieChartData) => `${entry.name}: ${entry.value}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{config.title}</h3>
      <ResponsiveContainer width="100%" height={config.height || 350}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={showLabels}
            label={showLabels ? renderLabel : false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

interface LineChartComponentProps {
  data: LineChartData[];
  config: ChartConfig;
  dataKey: string;
  color?: string;
  strokeWidth?: number;
  showLegend?: boolean;
}

export const LineChartComponent: React.FC<LineChartComponentProps> = ({
  data,
  config,
  dataKey,
  color = '#3b82f6',
  strokeWidth = 2,
  showLegend = false
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{config.title}</h3>
      <ResponsiveContainer width="100%" height={config.height || 300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={config.xAxisKey || 'name'}
            label={config.xAxisLabel ? { value: config.xAxisLabel, position: 'insideBottom', offset: -5 } : undefined}
          />
          <YAxis 
            label={config.yAxisLabel ? { value: config.yAxisLabel, angle: -90, position: 'insideLeft' } : undefined}
          />
          <Tooltip />
          {showLegend && <Legend />}
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={strokeWidth} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

interface AreaChartComponentProps {
  data: LineChartData[];
  config: ChartConfig;
  dataKey: string;
  color?: string;
  fillOpacity?: number;
}

export const AreaChartComponent: React.FC<AreaChartComponentProps> = ({
  data,
  config,
  dataKey,
  color = '#10b981',
  fillOpacity = 0.6
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{config.title}</h3>
      <ResponsiveContainer width="100%" height={config.height || 300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={config.xAxisKey || 'name'} />
          <YAxis />
          <Tooltip />
          <Area 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            fill={color} 
            fillOpacity={fillOpacity} 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

interface ScatterChartComponentProps {
  data: ScatterData[];
  config: ChartConfig;
  color?: string;
  xDomain?: [number, number];
  yDomain?: [number, number];
  xLabel?: string;
  yLabel?: string;
}

export const ScatterChartComponent: React.FC<ScatterChartComponentProps> = ({
  data,
  config,
  color = '#3b82f6',
  xDomain = [0, 5],
  yDomain = [0, 5],
  xLabel = 'X Axis',
  yLabel = 'Y Axis'
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{config.title}</h3>
      <ResponsiveContainer width="100%" height={config.height || 350}>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="x" 
            name={xLabel}
            domain={xDomain}
            label={{ value: xLabel, position: 'bottom' }}
          />
          <YAxis 
            type="number" 
            dataKey="y" 
            name={yLabel}
            domain={yDomain}
            label={{ value: yLabel, angle: -90, position: 'left' }}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Data Points" data={data} fill={color} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

interface RadarChartComponentProps {
  data: RadarData[];
  config: ChartConfig;
  color?: string;
  fillOpacity?: number;
  domain?: [number, number];
}

export const RadarChartComponent: React.FC<RadarChartComponentProps> = ({
  data,
  config,
  color = '#3b82f6',
  fillOpacity = 0.6,
  domain = [0, 5]
}) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">{config.title}</h3>
      <ResponsiveContainer width="100%" height={config.height || 400}>
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={90} domain={domain} />
          <Radar 
            name="Skills" 
            dataKey="value" 
            stroke={color} 
            fill={color} 
            fillOpacity={fillOpacity} 
          />
          <Tooltip />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
