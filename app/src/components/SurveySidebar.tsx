// ============================================================================
// SIDEBAR COMPONENT
// ============================================================================

import { ChevronDown, ChevronRight, GitCompare } from "lucide-react";
import type { Question } from "./types";

interface SurveySidebarProps {
  surveyData: any[];
  openHeaders: Set<string>;
  onToggleHeader: (header: string) => void;
  selectedQuestion: Question | null;
  comparisonMode: boolean;
  comparisonQuestions: Question[];
  onQuestionClick: (question: Question) => void;
  onToggleComparisonMode: () => void;
  isQuestionSelected: (questionId: number) => boolean;
}

export default function SurveySidebar({
  surveyData,
  openHeaders,
  onToggleHeader,
  selectedQuestion,
  comparisonMode,
  comparisonQuestions,
  onQuestionClick,
  onToggleComparisonMode,
  isQuestionSelected
}: SurveySidebarProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Survey Analysis</h1>
        <p className="text-xs text-gray-500 mt-1">Select questions to analyze</p>
      </div>

      <div className="p-4">
        <button
          onClick={onToggleComparisonMode}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            comparisonMode
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          <GitCompare className="w-4 h-4" />
          {comparisonMode ? 'Exit Comparison Mode' : 'Compare Questions'}
        </button>
        {comparisonMode && (
          <p className="text-xs text-gray-500 mt-2 text-center">
            Select 2 questions to compare
          </p>
        )}
      </div>

      <div className="px-2">
        {surveyData.map((section, sectionIndex) => (
          <div key={sectionIndex} className="mb-1">
            <button
              onClick={() => onToggleHeader(section.header)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors"
            >
              <span className="font-semibold text-gray-700 text-sm">{section.header}</span>
              {openHeaders.has(section.header) ? 
                <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                <ChevronRight className="w-4 h-4 text-gray-500" />
              }
            </button>
            
            {openHeaders.has(section.header) && (
              <div className="ml-2 mt-1 space-y-1">
                {section.questions.map((question: Question) => (
                  <button
                    key={question.id}
                    onClick={() => onQuestionClick(question)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      comparisonMode
                        ? isQuestionSelected(question.id)
                          ? 'bg-purple-100 text-purple-800 border-2 border-purple-400'
                          : 'hover:bg-gray-100 text-gray-600'
                        : selectedQuestion?.id === question.id
                          ? 'bg-blue-100 text-blue-800 border-2 border-blue-400'
                          : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="flex-1">{question.text}</span>
                      {comparisonMode && isQuestionSelected(question.id) && (
                        <span className="flex-shrink-0 w-5 h-5 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs">
                          {comparisonQuestions.findIndex(q => q.id === question.id) + 1}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}