// ============================================================================
// COMPARISON VIEW COMPONENT
// ============================================================================
// Given two selected questions and the active CSV dataset, this component
// computes a `ComparisonAnalysis` exactly once (via CSV + dataProcessor) and
// passes it down to visualization and summary components. This keeps the
// comparison charts and numbers in sync with the single-question views.
import { useEffect, useState } from "react";
import ComparisonVisualization from "./ComparisonVisualization";
import ComparisonSummary from "./ComparisonSummary.tsx";

import ActiveFilters from "./ActiveFilters";
import FilterWidget from "./FilterWidget";
import type { FilterState, Question } from "./types";
import ViewModeToggle from "./ViewModeToggle";
import { fetchCSV } from "../utils/csvLoader";
import { processQuestionData, type QuestionAnalysis } from "../utils/dataProcessor";
import type { ComparisonAnalysis, PerQuestionSummary } from "./visualizations/types";

interface ComparisonViewProps {
  comparisonQuestions: [Question, Question];
  viewMode: "visualization" | "summary";
  onViewModeChange: (mode: "visualization" | "summary") => void;
  appliedFilters: FilterState | null;
  onApplyFilters: (filters: FilterState) => void;
  selectedCsvFile: string;
}

function buildPerQuestionSummary(
  question: Question,
  analysis: QuestionAnalysis
): PerQuestionSummary {
  const { overview, distribution, trends } = analysis;

  return {
    questionId: question.id,
    questionText: question.text,
    questionType: question.type,
    overview: {
      totalResponses: overview.totalResponses,
      completedResponses: overview.completedResponses,
      skippedResponses: overview.skippedResponses,
      completionRate: overview.completionRate,
    },
    distribution: distribution.map((item) => ({
      name: item.name,
      value: item.value,
      percentage: item.percentage,
    })),
    mostCommonAnswer: trends.mostCommonAnswer,
    averageRating: trends.averageRating,
  };
}

export default function ComparisonView({
  comparisonQuestions,
  viewMode,
  onViewModeChange,
  appliedFilters,
  onApplyFilters,
  selectedCsvFile,
}: ComparisonViewProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [comparisonAnalysis, setComparisonAnalysis] =
    useState<ComparisonAnalysis | null>(null);

  useEffect(() => {
    // Require exactly two questions for comparison
    if (!comparisonQuestions || comparisonQuestions.length !== 2) {
      setComparisonAnalysis(null);
      return;
    }

    let cancelled = false;

    async function loadComparisonData() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCSV(selectedCsvFile);

        const [analysis1, analysis2] = [
          processQuestionData(data, comparisonQuestions[0]),
          processQuestionData(data, comparisonQuestions[1]),
        ];

        if (!analysis1 || !analysis2) {
          if (!cancelled) {
            setComparisonAnalysis(null);
            setError(
              "Could not find data for one or both selected questions in this dataset."
            );
          }
          return;
        }

        const summary1 = buildPerQuestionSummary(
          comparisonQuestions[0],
          analysis1
        );
        const summary2 = buildPerQuestionSummary(
          comparisonQuestions[1],
          analysis2
        );

        // Basic deltas
        const completionRateDiff =
          summary1.overview.completionRate - summary2.overview.completionRate;
        const totalResponsesDiff =
          summary1.overview.totalResponses - summary2.overview.totalResponses;

        const top1 = summary1.distribution[0];
        const top2 = summary2.distribution[0];
        const topOptionPercentageDiff =
          top1 && top2
            ? top1.percentage - top2.percentage
            : undefined;

        const comparison: ComparisonAnalysis = {
          question1: summary1,
          question2: summary2,
          deltas: {
            completionRateDiff,
            totalResponsesDiff,
            topOptionPercentageDiff,
          },
        };

        if (!cancelled) {
          setComparisonAnalysis(comparison);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error loading comparison data:", err);
          setComparisonAnalysis(null);
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load comparison data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadComparisonData();

    return () => {
      cancelled = true;
    };
  }, [comparisonQuestions, selectedCsvFile]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Question Comparison</h2>
        <div className="flex gap-2">
          <ViewModeToggle viewMode={viewMode} onToggle={onViewModeChange} />
          <FilterWidget onApplyFilters={onApplyFilters} />
        </div>
      </div>

      <ActiveFilters filters={appliedFilters} />

      {/* Question Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-lg p-5 shadow-sm border-2 border-purple-300">
          <div className="flex items-center mb-2">
            <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
              1
            </span>
            <h3 className="font-semibold text-gray-700">Question 1</h3>
          </div>
          <p className="text-gray-800 text-sm mb-2">
            {comparisonQuestions[0].text}
          </p>
          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            {comparisonQuestions[0].type}
          </span>
        </div>
        <div className="bg-white rounded-lg p-5 shadow-sm border-2 border-purple-300">
          <div className="flex items-center mb-2">
            <span className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-2">
              2
            </span>
            <h3 className="font-semibold text-gray-700">Question 2</h3>
          </div>
          <p className="text-gray-800 text-sm mb-2">
            {comparisonQuestions[1].text}
          </p>
          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            {comparisonQuestions[1].type}
          </span>
        </div>
      </div>

      {loading && (
        <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-200 mb-4">
          <p className="text-sm text-gray-600">Loading comparison data...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-5 mb-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {!loading && !error && comparisonAnalysis && (
        <>
          {viewMode === "visualization" ? (
            <ComparisonVisualization comparisonAnalysis={comparisonAnalysis} />
          ) : (
            <ComparisonSummary comparisonAnalysis={comparisonAnalysis} />
          )}
        </>
      )}

      {!loading && !error && !comparisonAnalysis && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-5">
          <p className="text-sm text-yellow-800">
            No comparison data available for the selected questions.
          </p>
        </div>
      )}
    </div>
  );
}

