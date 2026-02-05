// ============================================================================
// CORRELATION HEATMAP COMPONENT (DEMO-ONLY)
// ============================================================================
// This component is designed to work with synthetic correlation matrices from
// `SampleData.tsx`. It is not wired into the main CSV-driven analysis flow.

import type { CorrelationData } from "./types";

const getCorrelationColor = (value: number): string => {
  if (value >= 0.7) return '#dc2626'; // Strong positive - red
  if (value >= 0.4) return '#f97316'; // Moderate positive - orange
  if (value >= 0.1) return '#fbbf24'; // Weak positive - yellow
  if (value >= -0.1) return '#e5e7eb'; // No correlation - gray
  if (value >= -0.4) return '#93c5fd'; // Weak negative - light blue
  if (value >= -0.7) return '#3b82f6'; // Moderate negative - blue
  return '#1e40af'; // Strong negative - dark blue
};


interface CorrelationHeatmapProps {
  data: CorrelationData[];
  metrics: string[];
  cellSize?: number;
  title?: string;
  description?: string;
}

const CorrelationHeatmap: React.FC<CorrelationHeatmapProps> = ({
  data,
  metrics,
  cellSize = 80,
  title = 'Well-being Correlations',
  description = 'Cross-correlation matrix showing relationships between anxiety, depression, motivation, and job preparedness',
}) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">{title}</h2>
      <p className="text-gray-600 mb-6 text-sm">{description}</p>
      <div className="flex justify-center">
        <div className="inline-block">
          {/* Column headers */}
          <div className="flex mb-2">
            <div style={{ width: cellSize }} />
            {metrics.map((col) => (
              <div
                key={col}
                style={{ width: cellSize }}
                className="text-center text-sm font-semibold"
              >
                {col}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          {metrics.map((row) => (
            <div key={row} className="flex">
              {/* Row header */}
              <div
                style={{ width: cellSize }}
                className="flex items-center justify-end pr-3 text-sm font-semibold"
              >
                {row}
              </div>

              {/* Cells */}
              {metrics.map((col) => {
                const dataPoint = data.find(
                  (d) => d.row === row && d.col === col
                );
                const value = dataPoint?.value || 0;
                return (
                  <div
                    key={`${row}-${col}`}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor: getCorrelationColor(value),
                    }}
                    className="flex items-center justify-center border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                    title={`${row} vs ${col}: ${value.toFixed(2)}`}
                  >
                    <span className="text-sm font-semibold text-gray-800">
                      {value.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-900" />
              <span className="text-xs">Strong Negative</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200" />
              <span className="text-xs">No Correlation</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-600" />
              <span className="text-xs">Strong Positive</span>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6 text-sm text-gray-600 max-w-2xl mx-auto">
        <p>
          <strong>Key Insights:</strong> Strong positive correlations indicate metrics
          that tend to move together, while negative correlations show inverse
          relationships. The strongest relationships are between depression and
          motivation (-0.68), and motivation and job preparedness (0.81).
        </p>
      </div>
    </div>
  );
};

export default CorrelationHeatmap;
