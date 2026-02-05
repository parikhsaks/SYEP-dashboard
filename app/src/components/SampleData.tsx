// ============================================================================
// SAMPLE DATA MODULE (DEMO ONLY)
// ============================================================================
// This file provides hard-coded example datasets used by exploratory/demo
// visualizations. It is *not* used by the main CSV-driven analysis or
// comparison flows, and can be safely ignored if you only care about the live
// SYEP dashboard.
import type { BubbleData, CorrelationData, CorrelationData2, DualBarData, FrequencyData, VennData } from "./visualizations/types";

export const sampleData = {
  totalResponses: { completed: 245, partial: 32, skipped: 18 },
  
  completionRates: [
    { section: 'Summer Job Experience', rate: 94 },
    { section: 'Work Habits', rate: 89 },
    { section: 'Communication Skills', rate: 91 },
    { section: 'Career Preparedness', rate: 87 },
    { section: 'Well-Being', rate: 85 }
  ],
  
  avgResponseTime: [
    { section: 'Section 1', time: 4.2 },
    { section: 'Section 2', time: 5.1 },
    { section: 'Section 3', time: 3.8 },
    { section: 'Section 4', time: 4.5 },
    { section: 'Section 5', time: 6.2 }
  ],
  
  demographicDistribution: [
    { name: 'Male', value: 118 },
    { name: 'Female', value: 122 },
    { name: 'Non-binary', value: 5 }
  ],
  
  mentorResponse: [
    { answer: 'Yes', count: 178 },
    { answer: 'No', count: 67 }
  ],
  
  industryInterest: [
    { name: 'Healthcare', value: 45 },
    { name: 'Technology', value: 62 },
    { name: 'Education', value: 38 },
    { name: 'Retail', value: 41 },
    { name: 'Food Service', value: 34 },
    { name: 'Other', value: 25 }
  ],
  
  jobRecommendByGender: [
    { group: 'Male', yes: 85, no: 33 },
    { group: 'Female', yes: 92, no: 30 },
    { group: 'Non-binary', yes: 3, no: 2 }
  ],
  
  skillMatch: [
    { category: 'Healthcare', avg: 4.2 },
    { category: 'Technology', avg: 4.5 },
    { category: 'Education', avg: 4.1 },
    { category: 'Retail', avg: 3.8 },
    { category: 'Food Service', avg: 3.6 }
  ],
  
  wellBeingScores: [
    { metric: 'Anxiety', never: 15, rarely: 45, sometimes: 98, often: 65, always: 22 },
    { metric: 'Depression', never: 28, rarely: 67, sometimes: 85, often: 48, always: 17 },
    { metric: 'Motivation', never: 8, rarely: 22, sometimes: 75, often: 102, always: 38 }
  ],
  
  correlationData: [
    { x: 3.2, y: 3.8, label: 'Student 1' },
    { x: 4.1, y: 4.3, label: 'Student 2' },
    { x: 2.8, y: 2.5, label: 'Student 3' },
    { x: 4.5, y: 4.7, label: 'Student 4' },
    { x: 3.7, y: 4.0, label: 'Student 5' },
    { x: 4.8, y: 4.9, label: 'Student 6' },
    { x: 3.3, y: 3.5, label: 'Student 7' },
    { x: 2.5, y: 2.8, label: 'Student 8' }
  ],
  
  radarData: [
    { subject: 'Work Habits', value: 4.2 },
    { subject: 'Communication', value: 4.5 },
    { subject: 'Problem Solving', value: 3.9 },
    { subject: 'Time Management', value: 4.1 },
    { subject: 'Teamwork', value: 4.4 }
  ],
  
  timeSeriesData: [
    { week: 'Week 1', responses: 12 },
    { week: 'Week 2', responses: 28 },
    { week: 'Week 3', responses: 45 },
    { week: 'Week 4', responses: 67 },
    { week: 'Week 5', responses: 89 },
    { week: 'Week 6', responses: 102 },
    { week: 'Week 7', responses: 115 },
    { week: 'Week 8', responses: 125 }
  ],
  
  summaryStats: [
    { title: 'Avg Supportiveness', value: '4.3', color: 'green' as const, subtitle: 'SD: 0.8' },
    { title: 'Avg Preparedness', value: '4.1', color: 'purple' as const, subtitle: 'SD: 0.9' },
    { title: 'Avg Work Habits', value: '4.2', color: 'blue' as const, subtitle: 'SD: 0.7' }
  ],
  
  trendCards: [
    { title: 'Weekly Growth', value: '+12%', trend: 'up' as const, color: 'green' },
    { title: 'Completion Rate', value: '+5%', trend: 'up' as const, color: 'blue' },
    { title: 'Avg Response Time', value: '-8%', trend: 'down' as const, color: 'yellow' }
  ],
  
  comparisonData: [
    { category: 'Healthcare', satisfaction: 4.2, preparedness: 4.0, skills: 4.1 },
    { category: 'Technology', satisfaction: 4.5, preparedness: 4.3, skills: 4.4 },
    { category: 'Education', satisfaction: 4.1, preparedness: 3.9, skills: 4.0 },
    { category: 'Retail', satisfaction: 3.8, preparedness: 3.6, skills: 3.7 },
    { category: 'Food Service', satisfaction: 3.6, preparedness: 3.4, skills: 3.5 }
  ],
  
  insights: [
    'Students reporting high motivation show 35% better job preparedness scores',
    'Lower anxiety levels correlate with better supervisor relationships (r=0.67)',
    'Technology sector positions show highest well-being satisfaction ratings'
  ]
};

export const sampleFrequencyData: FrequencyData[] = [
  { metric: 'Anxiety', Never: -5, Rarely: -15, Sometimes: 25, Often: 30, Always: 15 },
  { metric: 'Depression', Never: -10, Rarely: -20, Sometimes: 30, Often: 25, Always: 15 },
  { metric: 'Motivation', Never: -3, Rarely: -8, Sometimes: 15, Often: 40, Always: 36 },
  { metric: 'Stress', Never: -2, Rarely: -10, Sometimes: 20, Often: 38, Always: 14 },
  { metric: 'Focus', Never: -7, Rarely: -13, Sometimes: 25, Often: 35, Always: 20 },
];

export const sampleCorrelationData: CorrelationData[] = [
  { row: 'Anxiety', col: 'Depression', value: 0.72 },
  { row: 'Anxiety', col: 'Job Prep', value: -0.45 },
  { row: 'Anxiety', col: 'Motivation', value: -0.58 },
  { row: 'Depression', col: 'Anxiety', value: 0.72 },
  { row: 'Depression', col: 'Job Prep', value: -0.62 },
  { row: 'Depression', col: 'Motivation', value: -0.68 },
  { row: 'Job Prep', col: 'Anxiety', value: -0.45 },
  { row: 'Job Prep', col: 'Depression', value: -0.62 },
  { row: 'Job Prep', col: 'Motivation', value: 0.81 },
  { row: 'Motivation', col: 'Anxiety', value: -0.58 },
  { row: 'Motivation', col: 'Depression', value: -0.68 },
  { row: 'Motivation', col: 'Job Prep', value: 0.81 },
];

const questionData = {
  question1: {
    id: 'q1',
    text: 'How satisfied are you with our product?',
    responses: [
      { category: 'Very Satisfied', count: 45, percentage: 45 },
      { category: 'Satisfied', count: 30, percentage: 30 },
      { category: 'Neutral', count: 15, percentage: 15 },
      { category: 'Dissatisfied', count: 7, percentage: 7 },
      { category: 'Very Dissatisfied', count: 3, percentage: 3 }
    ]
  },
  question2: {
    id: 'q2',
    text: 'Would you recommend our product to others?',
    responses: [
      { category: 'Very Satisfied', count: 50, percentage: 50 },
      { category: 'Satisfied', count: 25, percentage: 25 },
      { category: 'Neutral', count: 12, percentage: 12 },
      { category: 'Dissatisfied', count: 8, percentage: 8 },
      { category: 'Very Dissatisfied', count: 5, percentage: 5 }
    ]
  },
}

export const dualBarData: DualBarData[] = questionData.question1.responses.map((resp, idx) => ({
    category: resp.category,
    question1: resp.percentage,
    question2: questionData.question2.responses[idx]?.percentage || 0
  }));

export const correlationDataSample2: CorrelationData2[] = Array.from({ length: 50 }, (_, i) => {
  const preparedness = 1 + Math.random() * 4;
  return {
    satisfaction: preparedness * 0.8 + Math.random() * 1.2,
    preparedness: preparedness,
    wellbeing: preparedness * 0.7 + Math.random() * 1.5,
    label: `Participant ${i + 1}`,
  };
});

export const sampleBubbleData: BubbleData[] = [
  { jobMatch: 85, wellbeing: 78, hoursWorked: 40, name: 'Participant 1' },
  { jobMatch: 72, wellbeing: 65, hoursWorked: 45, name: 'Participant 2' },
  { jobMatch: 90, wellbeing: 88, hoursWorked: 35, name: 'Participant 3' },
  { jobMatch: 65, wellbeing: 58, hoursWorked: 50, name: 'Participant 4' },
  { jobMatch: 78, wellbeing: 72, hoursWorked: 42, name: 'Participant 5' },
  { jobMatch: 82, wellbeing: 80, hoursWorked: 38, name: 'Participant 6' },
  { jobMatch: 70, wellbeing: 62, hoursWorked: 48, name: 'Participant 7' },
  { jobMatch: 88, wellbeing: 85, hoursWorked: 36, name: 'Participant 8' },
  { jobMatch: 76, wellbeing: 70, hoursWorked: 44, name: 'Participant 9' },
  { jobMatch: 92, wellbeing: 90, hoursWorked: 32, name: 'Participant 10' },
  { jobMatch: 68, wellbeing: 60, hoursWorked: 52, name: 'Participant 11' },
  { jobMatch: 80, wellbeing: 75, hoursWorked: 40, name: 'Participant 12' },
];

export const vennData: VennData = {
    question1Only: 25,
    question2Only: 30,
    both: 60,
    neither: 15
}
