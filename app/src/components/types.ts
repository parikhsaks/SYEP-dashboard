// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface Question {
  id: number;
  text: string;
  type: string;
}

export interface FilterState {
  dateRange: string;
  ageGroup: string;
  location: string;
  responseStatus: string;
}
