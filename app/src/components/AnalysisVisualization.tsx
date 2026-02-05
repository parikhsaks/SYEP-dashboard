// ============================================================================
// ANALYSIS VISUALIZATION COMPONENT
// ============================================================================
// Renders the main charts for a single survey question. It relies on the shared
// `useQuestionAnalysis` hook to load the selected CSV file and run the core
// analytics (overview, distribution, trends) so this view always stays in sync
// with other consumers such as the summary and comparison views.
import { useQuestionAnalysis } from "../hooks/useQuestionAnalysis";
import { BarChart3, PieChart, TrendingUp, Loader2, AlertCircle } from "lucide-react";
import type { Question } from "./types";
import { fetchCSV } from "../utils/csvLoader";
import { processQuestionData, type QuestionAnalysis } from "../utils/dataProcessor";
import { BarChartComponent, PieChartComponent } from "./visualizations/Charts";

interface AnalysisVisualizationProps {
  selectedQuestion: Question;
  selectedCsvFile: string;
}

export default function AnalysisVisualization({ selectedQuestion, selectedCsvFile }: AnalysisVisualizationProps) {
  const { loading, error, analysis } = useQuestionAnalysis(
    selectedQuestion,
    selectedCsvFile
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-800">Error Loading Data</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <p className="text-yellow-800">No data available for this question.</p>
        </div>
      </div>
    );
  }

  const { overview, distribution, trends } = analysis;
  // Prepare chart data
  const chartData = distribution.map(item => ({
    name: item.name,
    value: item.value,
    percentage: item.percentage
  }));

  // Determine chart type based on question type
  const usePieChart = selectedQuestion.type === 'yes-no' && distribution.length <= 2;

  return (
    <div className="space-y-4">
      {/* Response Overview */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <div className="flex items-center mb-3">
          <BarChart3 className="w-5 h-5 text-blue-600 mr-2" />
          <h3 className="font-semibold text-gray-700">Response Overview</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Responses:</span>
            <span className="font-semibold text-gray-800">{overview.totalResponses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completed Responses:</span>
            <span className="font-semibold text-gray-800">{overview.completedResponses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Skipped Responses:</span>
            <span className="font-semibold text-gray-800">{overview.skippedResponses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Completion Rate:</span>
            <span className="font-semibold text-gray-800">{overview.completionRate}%</span>
          </div>
        </div>
      </div>

      {/* Response Distribution */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <div className="flex items-center mb-3">
          <PieChart className="w-5 h-5 text-green-600 mr-2" />
          <h3 className="font-semibold text-gray-700">Response Distribution</h3>
        </div>
        
        {distribution.length > 0 ? (
          <>
            {usePieChart ? (
              <PieChartComponent
                data={chartData}
                config={{ title: 'Response Distribution' }}
                showLabels={true}
                outerRadius={120}
              />
            ) : (
              <BarChartComponent
                data={chartData}
                config={{ 
                  title: 'Response Distribution',
                  xAxisKey: 'name',
                  yAxisLabel: 'Count'
                }}
                dataKey="value"
                color="#3b82f6"
                xAxisAngle={distribution.length > 5 ? -45 : 0}
                xAxisHeight={distribution.length > 5 ? 100 : 50}
              />
            )}
            
            {/* Distribution breakdown */}
            <div className="mt-4 space-y-2">
              {distribution.slice(0, 10).map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-48 text-sm text-gray-600 truncate" title={item.name}>
                    {item.name}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-semibold text-gray-800">{item.value}</span>
                    <span className="text-xs text-gray-500 ml-1">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
              {distribution.length > 10 && (
                <p className="text-xs text-gray-500 mt-2">
                  ... and {distribution.length - 10} more options
                </p>
              )}
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">No distribution data available</p>
        )}
      </div>

      {/* Trends */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <div className="flex items-center mb-3">
          <TrendingUp className="w-5 h-5 text-orange-600 mr-2" />
          <h3 className="font-semibold text-gray-700">Trends & Insights</h3>
        </div>
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-gray-600">Most Common Answer: </span>
            <span className="font-semibold text-gray-800">{trends.mostCommonAnswer}</span>
          </div>
          {trends.averageRating !== undefined && (
            <div className="text-sm">
              <span className="text-gray-600">Average Rating: </span>
              <span className="font-semibold text-gray-800">{trends.averageRating.toFixed(1)} / 5.0</span>
            </div>
          )}
          {trends.insights.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium text-gray-600 mb-2">Key Insights:</p>
              <ul className="space-y-1">
                {trends.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
