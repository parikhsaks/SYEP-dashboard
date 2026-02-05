// ============================================================================
// DATA PROCESSOR UTILITIES
// ============================================================================
// Core analytic functions that take raw CSV rows (keyed by column header) and
// a typed `Question` definition from the UI, and return a `QuestionAnalysis`
// object: high‑level overview stats, response distributions, and human‑readable
// trends/insights. Comparison and visualization components build entirely on
// top of these pure utilities.
import type { Question } from '../components/types';
import type { CSVRow } from './csvLoader';

export interface ResponseOverview {
  totalResponses: number;
  completedResponses: number;
  skippedResponses: number;
  completionRate: number;
}

export interface DistributionItem {
  name: string;
  value: number;
  percentage: number;
}

export interface QuestionAnalysis {
  overview: ResponseOverview;
  distribution: DistributionItem[];
  trends: {
    mostCommonAnswer: string;
    averageRating?: number;
    insights: string[];
  };
}

/**
 * Comprehensive mapping from question text to snake_case column names
 * Used for CSV files that use simplified column names (all except SYEP.csv)
 */
const QUESTION_TO_COLUMN_MAP: { [key: string]: string } = {
  // Summer Job Experience
  "Did you work at the same location/employer last summer?": "same_employer",
  "What category best describes what you did this summer?": "job_format",
  "On average, how many hours did you work each week this summer?": "hours_worked_per_week",
  "What type of daily work did you do this summer?": "daily_work_type",
  "Overall, how well did the job match with your skills and interests?": "job_match_interests",
  "How likely are you to consider a career in the type of work you did this summer?": "consider_career_likelihood",
  "If you had a job supervisor, how supportive were they overall?": "supervisor_support",
  "Did your supervisor - Properly train for your summer job?": "supervisor_properly_train",
  "Did your supervisor - Help you understand your role at your summer job?": "supervisor_understand_role",
  "Did your supervisor - Help you understand what was expected of you for your summer job?": "supervisor_understand_expectations",
  "Did your supervisor - Give you feedback on how you were doing at your summer job?": "supervisor_give_feedback",
  "Did your supervisor - Help you think about how to achieve your educational or career goals?": "supervisor_achieve_goals",
  "Did your supervisor - Make you feel comfortable talking about challenges outside of work?": "supervisor_comfortable",
  "Overall, how would you rate your job experience this summer?": "experience_rating",
  "Now that the summer is over - Do you have someone you can use as a job reference?": "job_reference_person",
  "Now that the summer is over - Do you have an adult you worked with that you consider a mentor?": "mentor_person",
  "Now that the summer is over - Would you recommend this job to a friend?": "recommend_job",
  "Now that the summer is over - Do you feel better prepared to enter a new job?": "new_job_prepared",
  "Which of the following industries are you most interested in pursuing as a career?": "interested_in_pursuing",
  "What do you plan to do after high school?": "post_high_school_plans",
  
  // Job Search Skills
  "Indicate whether you have completed any of the following - I have prepared, edited, and proofread my resume.": "prepared_resume",
  "Indicate whether you have completed any of the following - I have prepared, edited, and proofread my cover letter.": "prepared_cover_letter",
  "Indicate whether you have completed any of the following - I have asked an adult (e.g. family member, teacher, or neighbor) to serve as a reference for me when I apply for jobs.": "asked_adult_reference",
  "Indicate whether you have completed any of the following - I have searched for jobs online using a job board (e.g. Monster, Indeed, Career Builder, Snagajob, Zip Recruiter)": "searched_jobs_online",
  "Indicate whether you have completed any of the following  - I have talked with my family, neighbors, teachers, and friends, about the types of jobs I want -- and have asked for their help finding job opportunities.": "discussed_wanted_jobs",
  "Indicate whether you have completed any of the following  - I have developed some answer to the usual questions asked during an interview (e.g. what are your strength and weaknesses?)": "developed_interview_answers",
  "Indicate whether you have completed any of the following - I have practiced my interviewing skills with an adult (e.g. family member, teacher, or neighbor).": "practiced_interviewing",
  "What skills do you feel that you need to develop and improve to meet your future career goals?": "skills_to_improve",
  "Which of the following best describe how you typically manage your money?": "typically_manage_money",
  "Do you have any items that you regularly help pay for in your household?": "household_items_paid_for",
  
  // Work Habits
  "Indicate how much you agree with each of the following phrases - I am usually on time for school or work.": "usually_on_time_school_work",
  "Indicate how much you agree with each of the following phrases - I am rarely absent from school or call in sick.": "rarely_absent_school",
  "Indicate how much you agree with each of the following phrases - I usually meet my deadlines and hand in assignments on time.": "meet_deadlines",
  "Indicate how much you agree with each of the following phrases - I often keep track of my assignments and rarely forget to hand things in.": "keep_track_assignments",
  "Indicate how much you agree with each of the following phrases - I usually work independently without a lot of supervision.": "work_independently",
  "Indicate how much you agree with each of the following phrases - I often ask for help if directions are not clear.": "ask_for_help",
  "Indicate how much you agree with each of the following phrases - I often work in teams with other people.": "work_in_teams",
  
  // Communication Skills
  "Indicate how much you agree with each of the following phrases - I rarely get upset or lose my temper with other people.": "rarely_get_upset_or_lose_temper",
  "Indicate how much you agree with each of the following phrases - I rarely get upset when supervisors or teachers correct my mistakes.": "rarely_get_upset_when_corrected",
  "Indicate how much you agree with each of the following phrases - I rarely get into arguments with my friends.": "rarely_get_into_arguments_friends",
  "Indicate how much you agree with each of the following phrases - I rarely get into arguments with my parents or teachers.": "rarely_get_into_arguments_parents_teachers",
  "Indicate how much you agree with each of the following phrases - I rarely have difficulty resolving arguments with people.": "rarely_difficulty_resolving_arguments",
  "Indicate how much you agree with each of the following phrases - I often make eye contact when having a conversation.": "often_eye_contact_during_conversation",
  
  // Relationships
  "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Parent": "parent_role_model",
  "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Brother or sister": "sibling_role_model",
  "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Other family member (grandparent, aunt/uncle)": "family_role_model",
  "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Teacher": "teacher_role_model",
  "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Coach": "coach_role_model",
  "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Clergy (Minister/Priest, Imam, Rabbi)": "clergy_role_model",
  "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Job Supervisor": "supervisor_role_model",
  "Over the past 30 days, how often did you feel that you had a lot to contribute to EACH of the following groups? - Family": "contribute_family",
  "Over the past 30 days, how often did you feel that you had a lot to contribute to EACH of the following groups?  Friends": "contribute_friends",
  "Over the past 30 days, how often did you feel that you had a lot to contribute to EACH of the following groups? - Co-workers": "contribute_coworkers",
  "Over the past 30 days, how often did you feel that you had a lot to contribute to EACH of the following groups? - People in your neighborhood": "contribute_neighborhood",
  "Over the past 30 days, how often did you feel that you had a lot to contribute to EACH of the following groups? - People in your school": "contribute_school",
  "Over the past 30 days, how often did you feel that you had a lot to contribute to EACH of the following groups? - People in your place of worship": "contribute_worship",
  
  // Well-being
  "Over the last two weeks, how often have you been bothered by the following problems? - Feeling nervous, anxious, or on edge": "feeling_nervous",
  "Over the last two weeks, how often have you been bothered by the following problems? - Not being able to stop or control worrying": "cannot_stop_worrying",
  "Over the last two weeks, how often have you been bothered by the following problems? - Feeling down, depressed or hopeless": "feeling_down",
  "Over the last two weeks, how often have you been bothered by the following problems? - Little interest or pleasure in doing things": "little_interest_in_things",
  
  // Demographics
  "Gender": "gender",
  "Race": "race",
  "Is there another language other than English that is regularly spoken in your home?": "second_language_spoken_at_home",
  "What best describes the adult guardian that you primarily live with?": "adult_live_with"
};

/**
 * Check if CSV uses SYEP format (prefixed column names)
 */
function isSYEPFormat(columns: string[]): boolean {
  return columns.some(col => 
    col.startsWith('Summer Job Experience:') || 
    col.startsWith('Job Search Skills:') || 
    col.startsWith('Work Habits:') ||
    col.startsWith('Communication Skills:') ||
    col.startsWith('Relationships:') ||
    col.startsWith('Well-being:') ||
    col.startsWith('Demographics:')
  );
}

/**
 * Find CSV column name for a question by matching question text
 * Handles both SYEP format (prefixed) and snake_case format
 */
export function findCSVColumn(csvData: CSVRow[], question: Question): string | null {
  if (csvData.length === 0) return null;

  // Get all column names from first row
  const columns = Object.keys(csvData[0]);
  
  // Normalize question text for comparison
  const questionText = question.text.trim();
  
  // Check if CSV uses SYEP format (prefixed columns)
  const usesSYEPFormat = isSYEPFormat(columns);
  
  if (usesSYEPFormat) {
    // SYEP format: Try exact match with prefix first
    const prefixes = [
      'Summer Job Experience:',
      'Job Search Skills:',
      'Work Habits:',
      'Communication Skills:',
      'Relationships:',
      'Well-being:',
      'Demographics:'
    ];
    
    for (const prefix of prefixes) {
      const exactMatch = `${prefix} ${questionText}`;
      if (columns.includes(exactMatch)) {
        return exactMatch;
      }
    }
    
    // Try partial match - remove prefix if present
    for (const column of columns) {
      for (const prefix of prefixes) {
        if (column.startsWith(prefix)) {
          const columnQuestion = column.replace(prefix, '').trim();
          
          // Exact match after normalization
          if (columnQuestion === questionText) {
            return column;
          }
          
          // Check if question text is contained in column or vice versa (for slight variations)
          const normalizedColumn = columnQuestion.toLowerCase().replace(/\s+/g, ' ');
          const normalizedQuestion = questionText.toLowerCase().replace(/\s+/g, ' ');
          
          if (normalizedColumn === normalizedQuestion || 
              normalizedColumn.includes(normalizedQuestion) || 
              normalizedQuestion.includes(normalizedColumn)) {
            return column;
          }
        }
      }
    }
  } else {
    // Snake_case format: Use mapping
    // Try exact match from mapping first
    if (QUESTION_TO_COLUMN_MAP[questionText]) {
      const mappedColumn = QUESTION_TO_COLUMN_MAP[questionText];
      if (columns.includes(mappedColumn)) {
        return mappedColumn;
      }
    }
    
    // Try partial match - check if any mapped column name matches
    for (const [qText, colName] of Object.entries(QUESTION_TO_COLUMN_MAP)) {
      // Check if question text matches (exact or contains)
      const normalizedQText = qText.toLowerCase().replace(/\s+/g, ' ');
      const normalizedQuestion = questionText.toLowerCase().replace(/\s+/g, ' ');
      
      if (normalizedQText === normalizedQuestion || 
          normalizedQText.includes(normalizedQuestion) || 
          normalizedQuestion.includes(normalizedQText)) {
        if (columns.includes(colName)) {
          return colName;
        }
      }
    }
    
    // Last resort: try direct column name match (in case column name is in question text)
    for (const column of columns) {
      const normalizedColumn = column.toLowerCase().replace(/_/g, ' ');
      const normalizedQuestion = questionText.toLowerCase().replace(/\s+/g, ' ');
      
      // Check if key phrases from question match column name
      const questionWords = normalizedQuestion.split(' ').filter(w => w.length > 3);
      const columnWords = normalizedColumn.split(' ');
      
      // If most question words appear in column name, it's likely a match
      const matchingWords = questionWords.filter(word => 
        columnWords.some(cw => cw.includes(word) || word.includes(cw))
      );
      
      if (matchingWords.length >= Math.min(3, questionWords.length * 0.6)) {
        return column;
      }
    }
  }

  return null;
}

/**
 * Extract responses for a specific question column
 */
function extractResponses(csvData: CSVRow[], columnName: string): string[] {
  return csvData
    .map(row => row[columnName] || '')
    .filter(value => value.trim() !== '');
}

/**
 * Calculate response overview statistics
 */
export function calculateResponseOverview(responses: string[], totalRows: number): ResponseOverview {
  const completedResponses = responses.length;
  const skippedResponses = totalRows - completedResponses;
  const completionRate = totalRows > 0 ? (completedResponses / totalRows) * 100 : 0;

  return {
    totalResponses: totalRows,
    completedResponses,
    skippedResponses,
    completionRate: Math.round(completionRate * 10) / 10
  };
}

/**
 * Calculate distribution for yes-no questions
 */
function calculateYesNoDistribution(responses: string[]): DistributionItem[] {
  const counts: { [key: string]: number } = {};
  
  responses.forEach(response => {
    const normalized = response.trim();
    if (normalized) {
      counts[normalized] = (counts[normalized] || 0) + 1;
    }
  });

  const total = responses.length;
  return Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100 * 10) / 10 : 0
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Calculate distribution for multiple-choice questions
 * Handles comma-separated values for multi-select
 */
function calculateMultipleChoiceDistribution(responses: string[]): DistributionItem[] {
  const counts: { [key: string]: number } = {};
  
  responses.forEach(response => {
    // Handle comma-separated values (multi-select)
    const options = response.split(',').map(opt => opt.trim()).filter(opt => opt);
    
    if (options.length === 0) {
      // Single value
      const normalized = response.trim();
      if (normalized) {
        counts[normalized] = (counts[normalized] || 0) + 1;
      }
    } else {
      // Multiple values
      options.forEach(option => {
        if (option) {
          counts[option] = (counts[option] || 0) + 1;
        }
      });
    }
  });

  const total = responses.length;
  return Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100 * 10) / 10 : 0
    }))
    .sort((a, b) => b.value - a.value);
}

/**
 * Map rating text to numeric value
 */
function mapRatingToNumber(rating: string): number {
  const normalized = rating.trim().toLowerCase();
  
  // Rating scales
  const ratingMap: { [key: string]: number } = {
    // Supportiveness/Quality ratings
    'very supportive': 5,
    'mostly supportive': 4,
    'somewhat supportive': 3,
    'not very supportive': 2,
    'not at all supportive': 1,
    
    // Match ratings
    'very well': 5,
    'somewhat well': 3,
    'not very well': 2,
    'not at all well': 1,
    
    // Likelihood ratings
    'very likely': 5,
    'likely': 4,
    'not sure / maybe': 3,
    'unlikely': 2,
    'very unlikely': 1,
    
    // Overall experience ratings
    'very good': 5,
    'somewhat good': 4,
    'not very good': 2,
    'not at all good': 1,
    
    // Agreement ratings (from other sections, but might appear)
    'strongly agree': 5,
    'agree': 4,
    'neutral': 3,
    'disagree': 2,
    'strongly disagree': 1
  };

  return ratingMap[normalized] || 0;
}

/**
 * Calculate distribution for rating questions
 */
function calculateRatingDistribution(responses: string[]): DistributionItem[] {
  const counts: { [key: string]: number } = {};
  
  responses.forEach(response => {
    const normalized = response.trim();
    if (normalized) {
      counts[normalized] = (counts[normalized] || 0) + 1;
    }
  });

  const total = responses.length;
  return Object.entries(counts)
    .map(([name, value]) => ({
      name,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100 * 10) / 10 : 0
    }))
    .sort((a, b) => {
      // Sort by rating value (highest first)
      const aValue = mapRatingToNumber(a.name);
      const bValue = mapRatingToNumber(b.name);
      if (aValue !== bValue) {
        return bValue - aValue;
      }
      return b.value - a.value;
    });
}

/**
 * Calculate distribution based on question type
 */
export function calculateDistribution(responses: string[], questionType: string): DistributionItem[] {
  switch (questionType) {
    case 'yes-no':
      return calculateYesNoDistribution(responses);
    case 'multiple-choice':
      return calculateMultipleChoiceDistribution(responses);
    case 'rating':
      return calculateRatingDistribution(responses);
    default:
      // Default to multiple-choice handling
      return calculateMultipleChoiceDistribution(responses);
  }
}

/**
 * Calculate trends and insights
 */
export function calculateTrends(responses: string[], questionType: string, distribution: DistributionItem[]): {
  mostCommonAnswer: string;
  averageRating?: number;
  insights: string[];
} {
  const insights: string[] = [];
  let mostCommonAnswer = 'N/A';
  let averageRating: number | undefined;

  if (distribution.length > 0) {
    mostCommonAnswer = distribution[0].name;
    
    // Add insights based on distribution
    if (distribution[0].percentage >= 50) {
      insights.push(`${distribution[0].name} is the dominant response (${distribution[0].percentage}%)`);
    } else if (distribution.length === 2 && distribution[0].percentage >= 40) {
      insights.push(`Responses are split between ${distribution[0].name} (${distribution[0].percentage}%) and ${distribution[1].name} (${distribution[1].percentage}%)`);
    } else {
      insights.push(`Most common response: ${distribution[0].name} (${distribution[0].percentage}%)`);
    }

    // Calculate average rating for rating questions
    if (questionType === 'rating') {
      let totalRating = 0;
      let count = 0;
      distribution.forEach(item => {
        const ratingValue = mapRatingToNumber(item.name);
        if (ratingValue > 0) {
          totalRating += ratingValue * item.value;
          count += item.value;
        }
      });
      if (count > 0) {
        averageRating = Math.round((totalRating / count) * 10) / 10;
        insights.push(`Average rating: ${averageRating.toFixed(1)} out of 5`);
      }
    }

    // Add distribution insights
    if (distribution.length > 5) {
      insights.push(`High variety: ${distribution.length} different responses`);
    }
  }

  return {
    mostCommonAnswer,
    averageRating,
    insights
  };
}

/**
 * Process question data from CSV
 */
export function processQuestionData(csvData: CSVRow[], question: Question): QuestionAnalysis | null {
  if (csvData.length === 0) {
    return null;
  }

  // Find the CSV column for this question
  const columnName = findCSVColumn(csvData, question);
  if (!columnName) {
    console.warn(`Could not find CSV column for question: ${question.text}`);
    return null;
  }

  // Extract responses
  const responses = extractResponses(csvData, columnName);
  const totalRows = csvData.length;

  // Calculate overview
  const overview = calculateResponseOverview(responses, totalRows);

  // Calculate distribution
  const distribution = calculateDistribution(responses, question.type);

  // Calculate trends
  const trends = calculateTrends(responses, question.type, distribution);

  return {
    overview,
    distribution,
    trends
  };
}
