// ============================================================================
// ANALYSIS VIEW COMPONENT
// ============================================================================
// Layout wrapper for the single-question analysis experience. It shows the
// selected question's text and type, exposes filter and view-mode controls,
// and delegates the heavy lifting to `AnalysisVisualization` or
// `AnalysisSummary` depending on the selected tab.
import ActiveFilters from "./ActiveFilters";
import FilterWidget from "./FilterWidget";
import type { FilterState, Question } from "./types";
import ViewModeToggle from "./ViewModeToggle";
import AnalysisVisualization from "./AnalysisVisualization";
import AnalysisSummary from "./AnalysisSummary";


interface AnalysisViewProps {
  selectedQuestion: Question;
  viewMode: 'visualization' | 'summary';
  onViewModeChange: (mode: 'visualization' | 'summary') => void;
  appliedFilters: FilterState | null;
  onApplyFilters: (filters: FilterState) => void;
  selectedCsvFile: string;
}

export default function AnalysisView({ 
  selectedQuestion, 
  viewMode, 
  onViewModeChange,
  appliedFilters,
  onApplyFilters,
  selectedCsvFile
}: AnalysisViewProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Analysis Dashboard</h2>
        <div className="flex gap-2">
          <ViewModeToggle viewMode={viewMode} onToggle={onViewModeChange} />
          <FilterWidget onApplyFilters={onApplyFilters} />
        </div>
      </div>

      <ActiveFilters filters={appliedFilters} />
      
      {/* Question Details */}
      <div className="bg-white rounded-lg p-5 mb-6 shadow-sm border border-gray-200">
        <h3 className="font-semibold text-gray-700 mb-2">Selected Question</h3>
        <p className="text-gray-800 mb-2">{selectedQuestion.text}</p>
        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          {selectedQuestion.type}
        </span>
      </div>

      {viewMode === 'visualization' ? (
        <AnalysisVisualization selectedQuestion={selectedQuestion} selectedCsvFile={selectedCsvFile} />
      ) : (
        <AnalysisSummary selectedQuestion={selectedQuestion} selectedCsvFile={selectedCsvFile} />
      )}
    </div>
  );
}
