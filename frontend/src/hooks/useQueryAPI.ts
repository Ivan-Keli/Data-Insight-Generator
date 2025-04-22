import { useState, useCallback } from 'react';
import { 
  QueryRequest, 
  QueryResponse, 
  QueryHistoryItem,
  LLMProvider 
} from '@/types/query';
import { submitQuery, getQueryHistory } from '@/services/queries';

interface UseQueryAPIProps {
  sessionId: string;
  onSuccess?: (response: QueryHistoryItem) => void;
  onError?: (error: Error) => void;
}

interface UseQueryAPIReturn {
  isLoading: boolean;
  error: Error | null;
  queryHistory: QueryHistoryItem[];
  submitUserQuery: (
    query: string, 
    datasetId?: string, 
    llmProvider?: LLMProvider,
    queryType?: string
  ) => Promise<QueryHistoryItem>;
  loadQueryHistory: () => Promise<void>;
  historyIsLoading: boolean;
}

export function useQueryAPI({
  sessionId,
  onSuccess,
  onError
}: UseQueryAPIProps): UseQueryAPIReturn {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  const [historyIsLoading, setHistoryIsLoading] = useState<boolean>(false);
  
  // Function to submit a query to the API
  const submitUserQuery = useCallback(async (
    query: string,
    datasetId?: string,
    llmProvider: LLMProvider = 'gemini',
    queryType?: string
  ) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Create query request
      const queryRequest: QueryRequest = {
        query,
        dataset_id: datasetId,
        llm_provider: llmProvider,
        enable_fallback: true,
        fallback_provider: llmProvider === 'gemini' ? 'deepseek' : 'gemini',
        query_type: queryType as any,
        session_id: sessionId
      };
      
      // Submit the query
      const response = await submitQuery(queryRequest);
      
      // Format as a history item
      const historyItem: QueryHistoryItem = {
        query_id: response.query_id,
        query: response.query,
        response: response.response,
        llm_provider: response.llm_provider,
        dataset_id: response.dataset_id,
        timestamp: Date.now()
      };
      
      // Add to history
      setQueryHistory(prev => [historyItem, ...prev]);
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(historyItem);
      }
      
      return historyItem;
    } catch (error) {
      console.error('Query submission failed:', error);
      const errorObj = error instanceof Error ? error : new Error('Failed to submit query');
      setError(errorObj);
      
      // Call error callback if provided
      if (onError) {
        onError(errorObj);
      }
      
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, onSuccess, onError]);
  
  // Function to load query history from the API
  const loadQueryHistory = useCallback(async () => {
    setHistoryIsLoading(true);
    
    try {
      const history = await getQueryHistory(sessionId);
      setQueryHistory(history);
    } catch (error) {
      console.error('Failed to load query history:', error);
      // Don't set error state here to avoid disrupting the main UI
    } finally {
      setHistoryIsLoading(false);
    }
  }, [sessionId]);
  
  return {
    isLoading,
    error,
    queryHistory,
    submitUserQuery,
    loadQueryHistory,
    historyIsLoading
  };
}
