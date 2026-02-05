// ============================================================================
// COMPARISON SUMMARY COMPONENT
// ============================================================================
// Text-based summary companion to ComparisonVisualization. Consumes the same
// `ComparisonAnalysis` object to surface totals, completion/skip rates, top
// responses, and simple heuristic “statistical analysis” of the differences.
import type { ComparisonAnalysis } from "./visualizations/types";

interface ComparisonSummaryProps {
  comparisonAnalysis: ComparisonAnalysis;
}

export default function ComparisonSummary({
  comparisonAnalysis,
}: ComparisonSummaryProps) {
  const { question1, question2, deltas } = comparisonAnalysis;
  const top1 = question1.distribution[0];
  const top2 = question2.distribution[0];

  const skipRate1 =
    question1.overview.totalResponses > 0
      ? (question1.overview.skippedResponses /
          question1.overview.totalResponses) *
        100
      : 0;
  const skipRate2 =
    question2.overview.totalResponses > 0
      ? (question2.overview.skippedResponses /
          question2.overview.totalResponses) *
        100
      : 0;

  return (
    <div className="space-y-4">
      {/* Summary Statistics Table */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-4">Summary Statistics</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Metric
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Question 1
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Question 2
                </th>
                <th className="text-center py-3 px-4 font-semibold text-gray-700">
                  Difference
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-600">Total Responses</td>
                <td className="py-3 px-4 text-center font-semibold text-gray-800">
                  {question1.overview.totalResponses.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center font-semibold text-gray-800">
                  {question2.overview.totalResponses.toLocaleString()}
                </td>
                <td className="py-3 px-4 text-center text-green-600 font-semibold">
                  {deltas.totalResponsesDiff >= 0 ? "+" : "-"}
                  {Math.abs(deltas.totalResponsesDiff).toLocaleString()}
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-600">Completion Rate</td>
                <td className="py-3 px-4 text-center font-semibold text-gray-800">
                  {question1.overview.completionRate}%
                </td>
                <td className="py-3 px-4 text-center font-semibold text-gray-800">
                  {question2.overview.completionRate}%
                </td>
                <td className="py-3 px-4 text-center text-green-600 font-semibold">
                  {deltas.completionRateDiff >= 0 ? "+" : "-"}
                  {Math.abs(deltas.completionRateDiff).toFixed(1)}%
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-600">Skip Rate</td>
                <td className="py-3 px-4 text-center font-semibold text-gray-800">
                  {skipRate1.toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-center font-semibold text-gray-800">
                  {skipRate2.toFixed(1)}%
                </td>
                <td className="py-3 px-4 text-center text-red-600 font-semibold">
                  {skipRate2 - skipRate1 >= 0 ? "+" : "-"}
                  {Math.abs(skipRate2 - skipRate1).toFixed(1)}%
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 text-gray-600">Most Common Response</td>
                <td className="py-3 px-4 text-center font-semibold text-gray-800">
                  {top1
                    ? `${question1.mostCommonAnswer ?? top1.name} (${
                        top1.percentage
                      }%)`
                    : "—"}
                </td>
                <td className="py-3 px-4 text-center font-semibold text-gray-800">
                  {top2
                    ? `${question2.mostCommonAnswer ?? top2.name} (${
                        top2.percentage
                      }%)`
                    : "—"}
                </td>
                <td className="py-3 px-4 text-center text-gray-800 font-semibold">
                  {typeof deltas.topOptionPercentageDiff === "number"
                    ? `${deltas.topOptionPercentageDiff >= 0 ? "+" : "-"}${Math.abs(
                        deltas.topOptionPercentageDiff
                      ).toFixed(1)}%`
                    : "—"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Response Distribution Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">
            Question 1 Distribution
          </h3>
          <div className="space-y-2">
            {question1.distribution.slice(0, 3).map((item, idx) => (
              <div
                className="flex justify-between items-center py-2 border-b border-gray-100"
                key={idx}
              >
                <span className="text-gray-600">{item.name}</span>
                <span className="font-semibold text-gray-800">
                  {item.percentage}% ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">
            Question 2 Distribution
          </h3>
          <div className="space-y-2">
            {question2.distribution.slice(0, 3).map((item, idx) => (
              <div
                className="flex justify-between items-center py-2 border-b border-gray-100"
                key={idx}
              >
                <span className="text-gray-600">{item.name}</span>
                <span className="font-semibold text-gray-800">
                  {item.percentage}% ({item.value})
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Statistical Significance (heuristic) */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-3">Statistical Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Completion Difference</p>
            <p className="text-lg font-semibold text-gray-800">
              {deltas.completionRateDiff.toFixed(1)} percentage points
            </p>
            <p className="text-xs text-gray-500">
              {Math.abs(deltas.completionRateDiff) < 5
                ? "Small difference"
                : Math.abs(deltas.completionRateDiff) < 10
                ? "Moderate difference"
                : "Large difference"}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Top Response Difference</p>
            <p className="text-lg font-semibold text-gray-800">
              {typeof deltas.topOptionPercentageDiff === "number"
                ? `${deltas.topOptionPercentageDiff.toFixed(1)} percentage points`
                : "N/A"}
            </p>
            <p className="text-xs text-gray-500">
              Based on the most common answer for each question.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

