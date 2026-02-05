// ============================================================================
// useQuestionAnalysis HOOK
// ============================================================================
// Shared hook for loading CSV data for a single question and running it through
// the core analytics pipeline in `dataProcessor.ts`. This keeps the logic for
// fetching + processing in one place so AnalysisVisualization and
// AnalysisSummary stay in sync.

import { useEffect, useState } from "react";
import { fetchCSV } from "../utils/csvLoader";
import {
  processQuestionData,
  type QuestionAnalysis,
} from "../utils/dataProcessor";
import type { Question } from "../components/types";

export interface UseQuestionAnalysisResult {
  loading: boolean;
  error: string | null;
  analysis: QuestionAnalysis | null;
}

export function useQuestionAnalysis(
  selectedQuestion: Question,
  selectedCsvFile: string
): UseQuestionAnalysisResult {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<QuestionAnalysis | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchCSV(selectedCsvFile);
        const questionAnalysis = processQuestionData(data, selectedQuestion);

        if (!questionAnalysis) {
          if (!cancelled) {
            setError(
              `Could not find data for question: ${selectedQuestion.text}`
            );
            setAnalysis(null);
          }
        } else if (!cancelled) {
          setAnalysis(questionAnalysis);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Error loading question analysis:", err);
          setError(
            err instanceof Error ? err.message : "Failed to load data"
          );
          setAnalysis(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [selectedQuestion, selectedCsvFile]);

  return { loading, error, analysis };
}

