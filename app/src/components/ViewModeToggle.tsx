// ============================================================================
// VIEW MODE TOGGLE COMPONENT
// ============================================================================
import { BarChart3, Table } from 'lucide-react';

interface ViewModeToggleProps {
  viewMode: 'visualization' | 'summary';
  onToggle: (mode: 'visualization' | 'summary') => void;
}

export default function ViewModeToggle({ viewMode, onToggle }: ViewModeToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button
        onClick={() => onToggle('visualization')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'visualization'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <BarChart3 className="w-4 h-4" />
        Visualization
      </button>
      <button
        onClick={() => onToggle('summary')}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
          viewMode === 'summary'
            ? 'bg-white text-gray-900 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Table className="w-4 h-4" />
        Summary
      </button>
    </div>
  );
}
