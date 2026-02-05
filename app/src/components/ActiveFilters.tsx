// ============================================================================
// ACTIVE FILTERS DISPLAY COMPONENT
// ============================================================================

import type { FilterState } from "./types";

interface ActiveFiltersProps {
  filters: FilterState | null;
}

export default function ActiveFilters({ filters }: ActiveFiltersProps) {
  if (!filters || !Object.values(filters).some(v => v !== 'all')) {
    return null;
  }

  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <p className="text-xs font-semibold text-blue-800 mb-1">Active Filters:</p>
      <div className="flex flex-wrap gap-2">
        {Object.entries(filters).map(([key, value]) => {
          if (value !== 'all') {
            return (
              <span key={key} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {key}: {value}
              </span>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
