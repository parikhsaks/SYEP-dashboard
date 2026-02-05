// ============================================================================
// ANALYSIS SUMMARY COMPONENT
// ============================================================================
// Textual/summary counterpart to AnalysisVisualization. Uses the same
// `useQuestionAnalysis` hook so numbers and trends are always consistent with
// the charts and with any other consumers of QuestionAnalysis.
import { useQuestionAnalysis } from "../hooks/useQuestionAnalysis";
import { Loader2, AlertCircle } from "lucide-react";
import type { Question } from "./types";
import { fetchCSV } from "../utils/csvLoader";
import { processQuestionData, type QuestionAnalysis } from "../utils/dataProcessor";

interface AnalysisSummaryProps {
  selectedQuestion: Question;
  selectedCsvFile: string;
}

export default function AnalysisSummary({ selectedQuestion, selectedCsvFile }: AnalysisSummaryProps) {
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
  return (
    <div className="space-y-4">
      {/* Key Statistics */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-4">Key Statistics</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Total Responses</p>
            <p className="text-2xl font-bold text-gray-800">{overview.totalResponses.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Total survey responses</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
            <p className="text-2xl font-bold text-gray-800">{overview.completionRate}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {overview.completedResponses} of {overview.totalResponses} responded
            </p>
          </div>
          <div className="p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Completed Responses</p>
            <p className="text-2xl font-bold text-gray-800">{overview.completedResponses.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">Valid responses</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Skipped Responses</p>
            <p className="text-2xl font-bold text-gray-800">{overview.skippedResponses.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-1">
              {overview.totalResponses > 0 
                ? Math.round((overview.skippedResponses / overview.totalResponses) * 100) 
                : 0}% skip rate
            </p>
          </div>
        </div>
      </div>

      {/* Response Breakdown */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-4">Response Breakdown</h3>
        {distribution.length > 0 ? (
          <div className="space-y-3">
            {distribution.map((item, index) => (
              <div 
                key={index} 
                className={`flex justify-between items-center py-3 ${
                  index < distribution.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800 truncate" title={item.name}>
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {index === 0 && 'Most popular choice'}
                    {index === 1 && distribution.length > 1 && 'Second choice'}
                    {index === distribution.length - 1 && index > 1 && 'Least popular'}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-gray-800">{item.value.toLocaleString()} responses</p>
                  <p className="text-sm text-gray-600">{item.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No response data available</p>
        )}
      </div>

      {/* Trends & Insights */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-4">Trends & Insights</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Most Common Answer</span>
            <span className="font-semibold text-gray-800">{trends.mostCommonAnswer}</span>
          </div>
          {trends.averageRating !== undefined && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Average Rating</span>
              <span className="font-semibold text-gray-800">{trends.averageRating.toFixed(1)} / 5.0</span>
            </div>
          )}
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Unique Responses</span>
            <span className="font-semibold text-gray-800">{distribution.length}</span>
          </div>
          {trends.insights.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Key Insights:</p>
              <ul className="space-y-2">
                {trends.insights.map((insight, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start">
                    <span className="text-blue-600 mr-2">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Distribution Summary */}
      {distribution.length > 0 && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-4">Distribution Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Top 3 Responses</span>
              <span className="font-semibold text-gray-800">
                {distribution.slice(0, 3).reduce((sum, item) => sum + item.percentage, 0).toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-600">Response Diversity</span>
              <span className="font-semibold text-gray-800">
                {distribution.length} {distribution.length === 1 ? 'option' : 'options'}
              </span>
            </div>
            {distribution.length > 1 && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Concentration</span>
                <span className="font-semibold text-gray-800">
                  {distribution[0].percentage >= 50 ? 'High' : 
                   distribution[0].percentage >= 30 ? 'Moderate' : 'Low'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
