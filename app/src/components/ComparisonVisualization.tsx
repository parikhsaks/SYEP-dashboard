// ============================================================================
// COMPARISON VISUALIZATION COMPONENT
// ============================================================================
// Purely presentational charts built from a precomputed `ComparisonAnalysis`.
// Shows high-level distributions, key metrics, and a dual bar chart that
// aligns categories across both questions for side‑by‑side comparison.
import { BarChart3, PieChart } from "lucide-react";
import type { ComparisonAnalysis, DualBarData } from "./visualizations/types";
import DualBarChartComponent from "./visualizations/DualBarChartComponent";

interface ComparisonVisualizationProps {
  comparisonAnalysis: ComparisonAnalysis;
}

export default function ComparisonVisualization({
  comparisonAnalysis,
}: ComparisonVisualizationProps) {
  const { question1, question2, deltas } = comparisonAnalysis;

  const top1 = question1.distribution[0];
  const top2 = question2.distribution[0];

  // Build a unified category list for a side‑by‑side bar chart
  const categoryMap = new Map<string, { q1: number; q2: number }>();

  question1.distribution.forEach((item) => {
    categoryMap.set(item.name, { q1: item.percentage, q2: 0 });
  });

  question2.distribution.forEach((item) => {
    const existing = categoryMap.get(item.name);
    if (existing) {
      existing.q2 = item.percentage;
    } else {
      categoryMap.set(item.name, { q1: 0, q2: item.percentage });
    }
  });

  const dualBarData: DualBarData[] = Array.from(categoryMap.entries()).map(
    ([category, values]) => ({
      category,
      question1: values.q1,
      question2: values.q2,
    })
  );

  return (
    <div className="space-y-4">
      {/* Side-by-Side Distribution Charts */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <PieChart className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="font-semibold text-gray-700">Response Distribution Comparison</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              Question 1
            </h4>
            <p className="text-xs text-gray-500 mb-2 truncate">
              {question1.questionText}
            </p>
            <div className="space-y-2">
              {question1.distribution.slice(0, 3).map((item, idx) => (
                <div className="flex items-center" key={idx}>
                  <div
                    className="w-32 text-sm text-gray-600 truncate"
                    title={item.name}
                  >
                    {item.name}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">
              Question 2
            </h4>
            <p className="text-xs text-gray-500 mb-2 truncate">
              {question2.questionText}
            </p>
            <div className="space-y-2">
              {question2.distribution.slice(0, 3).map((item, idx) => (
                <div className="flex items-center" key={idx}>
                  <div
                    className="w-32 text-sm text-gray-600 truncate"
                    title={item.name}
                  >
                    {item.name}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                    <div
                      className="bg-purple-400 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">
                    {item.percentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Comparison Chart */}
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <div className="flex items-center mb-4">
          <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
          <h3 className="font-semibold text-gray-700">Key Metrics Comparison</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Total Responses</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-purple-100 rounded px-3 py-2 text-center">
                <span className="font-semibold text-purple-800">
                  {question1.overview.totalResponses.toLocaleString()}
                </span>
              </div>
              <div className="flex-1 bg-purple-100 rounded px-3 py-2 text-center">
                <span className="font-semibold text-purple-800">
                  {question2.overview.totalResponses.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Completion Rate</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-purple-100 rounded px-3 py-2 text-center">
                <span className="font-semibold text-purple-800">
                  {question1.overview.completionRate}%
                </span>
              </div>
              <div className="flex-1 bg-purple-100 rounded px-3 py-2 text-center">
                <span className="font-semibold text-purple-800">
                  {question2.overview.completionRate}%
                </span>
              </div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Top Option Share</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-purple-100 rounded px-3 py-2 text-center">
                <span className="font-semibold text-purple-800">
                  {top1 ? `${top1.percentage}%` : "—"}
                </span>
              </div>
              <div className="flex-1 bg-purple-100 rounded px-3 py-2 text-center">
                <span className="font-semibold text-purple-800">
                  {top2 ? `${top2.percentage}%` : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-3">Key Insights</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="text-purple-600 mr-2">•</span>
            <span>
              Question 1 has{" "}
              {deltas.completionRateDiff.toFixed(1)} percentage points{" "}
              {deltas.completionRateDiff >= 0 ? "higher" : "lower"} completion
              rate than Question 2.
            </span>
          </li>
          {typeof deltas.topOptionPercentageDiff === "number" &&
            top1 &&
            top2 && (
            <li className="flex items-start">
              <span className="text-purple-600 mr-2">•</span>
              <span>
                The most common answer "{top1.name}" in Question 1 differs by{" "}
                {Math.abs(deltas.topOptionPercentageDiff).toFixed(1)} percentage
                points compared to "{top2.name}" in Question 2.
              </span>
            </li>
          )}
        </ul>
      </div>

      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200">
        <DualBarChartComponent data={dualBarData} />
      </div>
    </div>
  );
}