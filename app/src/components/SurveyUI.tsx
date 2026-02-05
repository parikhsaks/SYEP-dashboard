import { useState } from 'react';
import EmptyState from './EmptyState';
import SurveySidebar from './SurveySidebar';
import AnalysisView from './AnalysisView';
import type { FilterState, Question } from './types';
import ComparisonView from './ComparisonView';
import { getAvailableCSVFiles, getCSVFriendlyName } from '../utils/csvLoader';

// Sample survey data structure – mirrors the SYEP instrument by grouping
// questions under logical section headers. The text here is also used by the
// CSV column mapping logic in `dataProcessor.ts`, so changes should be kept
// in sync with that mapping.
const surveyData = [
  {
    header: "Summer Job Experience",
    questions: [
      { id: 1, text: "Did you work at the same location/employer last summer?", type: "yes-no" },
      { id: 2, text: "What category best describes what you did this summer?", type: "multiple-choice" },
      { id: 3, text: "On average, how many hours did you work each week this summer?", type: "multiple-choice" },
      { id: 4, text: "What type of daily work did you do this summer?", type: "multiple-choice" },
      { id: 5, text: "Overall, how well did the job match with your skills and interests?", type: "rating" },
      { id: 6, text: "How likely are you to consider a career in the type of work you did this summer?", type: "rating" },
      { id: 7, text: "If you had a job supervisor, how supportive were they overall?", type: "rating" },
      { id: 8, text: "Did your supervisor - Properly train for your summer job?", type: "yes-no" },
      { id: 9, text: "Did your supervisor - Help you understand your role at your summer job?", type: "yes-no" },
      { id: 10, text: "Did your supervisor - Help you understand what was expected of you for your summer job?", type: "yes-no" },
      { id: 11, text: "Did your supervisor - Give you feedback on how you were doing at your summer job?", type: "yes-no" },
      { id: 12, text: "Did your supervisor - Help you think about how to achieve your educational or career goals?", type: "yes-no" },
      { id: 13, text: "Did your supervisor - Make you feel comfortable talking about challenges outside of work?", type: "yes-no" },
      { id: 14, text: "Overall, how would you rate your job experience this summer?", type: "rating" },
      { id: 15, text: "Now that the summer is over - Do you have someone you can use as a job reference?", type: "yes-no" },
      { id: 16, text: "Now that the summer is over - Do you have an adult you worked with that you consider a mentor?", type: "yes-no" },
      { id: 17, text: "Now that the summer is over - Would you recommend this job to a friend?", type: "yes-no" },
      { id: 18, text: "Now that the summer is over - Do you feel better prepared to enter a new job?", type: "yes-no" },
      { id: 19, text: "Which of the following industries are you most interested in pursuing as a career?", type: "multiple-choice" },
      { id: 20, text: "What do you plan to do after high school?", type: "multiple-choice" },
    ]
  },
  {
    header: "Job Search Skills",
    questions: [
      { id: 21, text: "Indicate whether you have completed any of the following - I have prepared, edited, and proofread my resume.", type: "yes-no" },
      { id: 22, text: "Indicate whether you have completed any of the following - I have prepared, edited, and proofread my cover letter.", type: "yes-no" },
      { id: 23, text: "Indicate whether you have completed any of the following - I have asked an adult (e.g. family member, teacher, or neighbor) to serve as a reference for me when I apply for jobs.", type: "yes-no" },
      { id: 24, text: "Indicate whether you have completed any of the following - I have searched for jobs online using a job board (e.g. Monster, Indeed, Career Builder, Snagajob, Zip Recruiter)", type: "yes-no" },
      { id: 25, text: "Indicate whether you have completed any of the following  - I have talked with my family, neighbors, teachers, and friends, about the types of jobs I want -- and have asked for their help finding job opportunities.", type: "yes-no" },
      { id: 26, text: "Indicate whether you have completed any of the following  - I have developed some answer to the usual questions asked during an interview (e.g. what are your strength and weaknesses?)", type: "yes-no" },
      { id: 27, text: "Indicate whether you have completed any of the following - I have practiced my interviewing skills with an adult (e.g. family member, teacher, or neighbor).", type: "yes-no" },
      { id: 28, text: "What skills do you feel that you need to develop and improve to meet your future career goals?", type: "text" },
      { id: 29, text: "Which of the following best describe how you typically manage your money?", type: "multiple-choice" },
      { id: 30, text: "Do you have any items that you regularly help pay for in your household?", type: "yes-no" }
    ]
  },
  {
    header: "Work Habits",
    questions: [
      { id: 31, text: "Indicate how much you agree with each of the following phrases - I am usually on time for school or work.", type: "rating" },
      { id: 32, text: "Indicate how much you agree with each of the following phrases - I am rarely absent from school or call in sick.", type: "rating" },
      { id: 33, text: "Indicate how much you agree with each of the following phrases - I usually meet my deadlines and hand in assignments on time.", type: "rating" },
      { id: 34, text: "Indicate how much you agree with each of the following phrases - I often keep track of my assignments and rarely forget to hand things in.", type: "rating" },
      { id: 35, text: "Indicate how much you agree with each of the following phrases - I usually work independently without a lot of supervision.", type: "rating" },
      { id: 36, text: "Indicate how much you agree with each of the following phrases - I often ask for help if directions are not clear.", type: "rating" },
      { id: 37, text: "Indicate how much you agree with each of the following phrases - I often work in teams with other people.", type: "rating" }
    ]
  },
  {
    header: "Communication Skills",
    questions: [
      { id: 38, text: "Indicate how much you agree with each of the following phrases - I rarely get upset or lose my temper with other people.", type: "rating" },
      { id: 39, text: "Indicate how much you agree with each of the following phrases - I rarely get upset when supervisors or teachers correct my mistakes.", type: "rating" },
      { id: 40, text: "Indicate how much you agree with each of the following phrases - I rarely get into arguments with my friends.", type: "rating" },
      { id: 41, text: "Indicate how much you agree with each of the following phrases - I rarely get into arguments with my parents or teachers.", type: "rating" },
      { id: 42, text: "Indicate how much you agree with each of the following phrases - I rarely have difficulty resolving arguments with people.", type: "rating" },
      { id: 43, text: "Indicate how much you agree with each of the following phrases - I often make eye contact when having a conversation.", type: "rating" }
    ]
  },
  {
    header: "Relationships",
    questions: [
      { id: 44, text: "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Parent", type: "rating" },
      { id: 45, text: "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Brother or sister", type: "rating" },
      { id: 46, text: "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Other family member (grandparent, aunt/uncle)", type: "rating" },
      { id: 47, text: "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Teacher", type: "rating" },
      { id: 48, text: "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Coach", type: "rating" },
      { id: 49, text: "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Clergy (Minister/Priest, Imam, Rabbi)", type: "rating" },
      { id: 50, text: "Over the past 30 days, how often did you feel that EACH of the following was a positive role model for you?  - Job Supervisor", type: "rating" },
      { id: 51, text: "Over the past 30 days, how often did you feel that you had a lot to contribute to EACH of the following groups? - Family", type: "rating" },
      { id: 52, text: "Over the past 30 days, how often did you feel that you had a lot to contribute to EACH of the following groups?  Friends", type: "rating" },
      { id: 53, text: "Over the past 30 days, how often did you feel that you had a lot to contribute to EACH of the following groups? - Co-workers", type: "rating" },
      { id: 54, text: "Over the past 30 days, how often did you feel that you had a lot to contribute to EACH of the following groups? - People in your neighborhood", type: "rating" },
      { id: 55, text: "Over the past 30 days, how often did you feel that you had a lot to contribute to EACH of the following groups? - People in your school", type: "rating" },
      { id: 56, text: "Over the past 30 days, how often did you feel that you had a lot to contribute to EACH of the following groups? - People in your place of worship", type: "rating" }
    ]
  },
  {
    header: "Well-being",
    questions: [
      { id: 57, text: "Over the last two weeks, how often have you been bothered by the following problems? - Feeling nervous, anxious, or on edge", type: "rating" },
      { id: 58, text: "Over the last two weeks, how often have you been bothered by the following problems? - Not being able to stop or control worrying", type: "rating" },
      { id: 59, text: "Over the last two weeks, how often have you been bothered by the following problems? - Feeling down, depressed or hopeless", type: "rating" },
      { id: 60, text: "Over the last two weeks, how often have you been bothered by the following problems? - Little interest or pleasure in doing things", type: "rating" }
    ]
  },
  {
    header: "Demographics",
    questions: [
      { id: 61, text: "Gender", type: "multiple-choice" },
      { id: 62, text: "Race", type: "multiple-choice" },
      { id: 63, text: "Is there another language other than English that is regularly spoken in your home?", type: "yes-no" },
      { id: 64, text: "What best describes the adult guardian that you primarily live with?", type: "multiple-choice" }
    ]
  }
];

// ============================================================================
// MAIN SURVEY UI COMPONENT
// ============================================================================

function SurveyUI() {
  const [openHeaders, setOpenHeaders] = useState(new Set<string>());
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparisonQuestions, setComparisonQuestions] = useState<Question[]>([]);
  const [appliedFilters, setAppliedFilters] = useState<FilterState | null>(null);
  const [analysisViewMode, setAnalysisViewMode] = useState<'visualization' | 'summary'>('visualization');
  const [comparisonViewMode, setComparisonViewMode] = useState<'visualization' | 'summary'>('visualization');
  const [selectedCsvFile, setSelectedCsvFile] = useState<string>('SYEP.csv');

  const toggleHeader = (header: string) => {
    const newOpenHeaders = new Set(openHeaders);
    if (newOpenHeaders.has(header)) {
      newOpenHeaders.delete(header);
    } else {
      newOpenHeaders.add(header);
    }
    setOpenHeaders(newOpenHeaders);
  };

  const handleQuestionClick = (question: Question) => {
    if (comparisonMode) {
      if (comparisonQuestions.find(q => q.id === question.id)) {
        setComparisonQuestions(comparisonQuestions.filter(q => q.id !== question.id));
      } else if (comparisonQuestions.length < 2) {
        setComparisonQuestions([...comparisonQuestions, question]);
      }
    } else {
      setSelectedQuestion(question);
    }
  };

  const toggleComparisonMode = () => {
    setComparisonMode(!comparisonMode);
    setComparisonQuestions([]);
    if (!comparisonMode) {
      setSelectedQuestion(null);
    }
  };

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
  };

  const isQuestionSelected = (questionId: number) => {
    return comparisonQuestions.some(q => q.id === questionId);
  };

  const shouldShowContent = selectedQuestion || comparisonQuestions.length === 2;
  const shouldShowComparison = comparisonMode && comparisonQuestions.length === 2;

  const availableCsvFiles = getAvailableCSVFiles();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <SurveySidebar
        surveyData={surveyData}
        openHeaders={openHeaders}
        onToggleHeader={toggleHeader}
        selectedQuestion={selectedQuestion}
        comparisonMode={comparisonMode}
        comparisonQuestions={comparisonQuestions}
        onQuestionClick={handleQuestionClick}
        onToggleComparisonMode={toggleComparisonMode}
        isQuestionSelected={isQuestionSelected}
      />

      {/* Main Content Area */}
      {shouldShowContent ? (
        <div className="flex-1 overflow-y-auto">
          {/* CSV File Selector */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label htmlFor="csv-selector" className="text-sm font-medium text-gray-700">
                  Data Source:
                </label>
                <select
                  id="csv-selector"
                  value={selectedCsvFile}
                  onChange={(e) => {
                    setSelectedCsvFile(e.target.value);
                    // Clear selected question when switching CSV files to avoid confusion
                    setSelectedQuestion(null);
                    setComparisonQuestions([]);
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableCsvFiles.map((filename) => (
                    <option key={filename} value={filename}>
                      {getCSVFriendlyName(filename)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {shouldShowComparison ? (
            <ComparisonView
              comparisonQuestions={comparisonQuestions as [Question, Question]}
              viewMode={comparisonViewMode}
              onViewModeChange={setComparisonViewMode}
              appliedFilters={appliedFilters}
              onApplyFilters={handleApplyFilters}
              selectedCsvFile={selectedCsvFile}
            />
          ) : selectedQuestion ? (
            <AnalysisView
              selectedQuestion={selectedQuestion}
              viewMode={analysisViewMode}
              onViewModeChange={setAnalysisViewMode}
              appliedFilters={appliedFilters}
              onApplyFilters={handleApplyFilters}
              selectedCsvFile={selectedCsvFile}
            />
          ) : null}
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          {/* CSV File Selector - also show when no content */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <label htmlFor="csv-selector-empty" className="text-sm font-medium text-gray-700">
                  Data Source:
                </label>
                <select
                  id="csv-selector-empty"
                  value={selectedCsvFile}
                  onChange={(e) => setSelectedCsvFile(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {availableCsvFiles.map((filename) => (
                    <option key={filename} value={filename}>
                      {getCSVFriendlyName(filename)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <EmptyState comparisonMode={comparisonMode} />
        </div>
      )}
    </div>
  );
}

export default SurveyUI;