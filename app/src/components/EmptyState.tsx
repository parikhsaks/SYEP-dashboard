// ============================================================================
// EMPTY STATE COMPONENT
// ============================================================================
import { BarChart3 } from 'lucide-react';

interface EmptyStateProps {
  comparisonMode: boolean;
}

export default function EmptyState({ comparisonMode }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
          <BarChart3 className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">No Question Selected</h2>
        <p className="text-gray-500">
          {comparisonMode 
            ? 'Select 2 questions from the sidebar to compare'
            : 'Select a question from the sidebar to view analytics'}
        </p>
      </div>
    </div>
  );
}