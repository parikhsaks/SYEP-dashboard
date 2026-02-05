// Type definitions for survey dashboard components and shared visualization
// data structures. These types sit between the raw analytics in
// `dataProcessor.ts` and the various chart/summary components.

export interface ResponseSummary {
  completed: number;
  partial: number;
  skipped: number;
}

export interface SectionCompletion {
  section: string;
  completionRate: number;
}

export interface AverageResponseTime {
  section: string;
  avgTime: number;
}

export interface DemographicDistribution {
  category: string;
  male: number;
  female: number;
  nonBinary: number;
  preferNotToSay: number;
}

export interface CorrelationData {
  row: string;
  col: string;
  value: number;
}

export interface BubbleData {
  jobMatch: number;
  wellbeing: number;
  hoursWorked: number;
  name: string;
}

export interface FrequencyData {
  metric: string;
  Never: number;
  Rarely: number;
  Sometimes: number;
  Often: number;
  Always: number;
}

export interface CorrelationData2 {
  satisfaction: number;
  preparedness: number;
  wellbeing: number;
  label: string;
}

export interface VennData {
  question1Only: number;
  question2Only: number;
  both: number;
  neither: number;
}

export interface DualBarData {
  category: string;
  question1: number;
  question2: number;
}

export type DemographicType = 'gender' | 'race' | 'guardian';

// ============================================================================
// COMPARISON ANALYSIS TYPES
// ============================================================================

export interface PerQuestionSummary {
  questionId: number;
  questionText: string;
  questionType: string;
  overview: {
    totalResponses: number;
    completedResponses: number;
    skippedResponses: number;
    completionRate: number;
  };
  distribution: {
    name: string;
    value: number;
    percentage: number;
  }[];
  mostCommonAnswer: string;
  averageRating?: number;
}

export interface ComparisonDelta {
  totalResponsesDiff: number;
  completionRateDiff: number;
  topOptionPercentageDiff?: number;
}

export interface ComparisonAnalysis {
  question1: PerQuestionSummary;
  question2: PerQuestionSummary;
  deltas: ComparisonDelta;
}

