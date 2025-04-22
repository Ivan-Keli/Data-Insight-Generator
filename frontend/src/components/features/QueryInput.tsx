"use client";

import { useState } from 'react';
import { submitQuery } from '@/services/queries';
import { QueryHistoryItem, LLMProvider, QueryType } from '@/types/query';

interface QueryTypeOption {
  value: QueryType;
  label: string;
  description: string;
}

interface QueryInputProps {
  datasetId?: string;
  onQuerySubmitted: (response: QueryHistoryItem) => void;
  setIsLoading: (isLoading: boolean) => void;
  isLoading: boolean;
  sessionId: string;
}

// LLM provider options
const LLM_PROVIDERS: { value: LLMProvider; label: string }[] = [
  { value: 'gemini', label: 'Google Gemini' },
  { value: 'deepseek', label: 'DeepSeek' }
];

// Query type options
const QUERY_TYPES: QueryTypeOption[] = [
  { 
    value: 'general', 
    label: 'General Analysis', 
    description: 'Ask any question about your data' 
  },
  { 
    value: 'correlation', 
    label: 'Correlation Analysis', 
    description: 'Explore relationships between variables' 
  },
  { 
    value: 'data_quality', 
    label: 'Data Quality', 
    description: 'Assess and improve data quality' 
  },
  { 
    value: 'visualization', 
    label: 'Visualization', 
    description: 'Get visualization recommendations' 
  },
  { 
    value: 'feature_engineering', 
    label: 'Feature Engineering', 
    description: 'Suggestions for creating new features' 
  },
  { 
    value: 'predictive_modeling', 
    label: 'Predictive Modeling', 
    description: 'Get modeling approach recommendations' 
  }
];

export default function QueryInput({ 
  datasetId, 
  onQuerySubmitted, 
  setIsLoading,
  isLoading,
  sessionId
}: QueryInputProps) {
  // Query input state
  const [query, setQuery] = useState<string>('');
  
  // LLM provider state
  const [llmProvider, setLlmProvider] = useState<LLMProvider>('gemini');
  
  // Enable fallback state
  const [enableFallback, setEnableFallback] = useState<boolean>(true);
  
  // Query type state
  const [queryType, setQueryType] = useState<QueryType>('general');
  
  // Error state
  const [error, setError] = useState<string | null>(null);
  
  // Example queries based on context
  const exampleQueries = datasetId 
    ? [
        'What correlations exist between variables in this dataset?',
        'How can I visualize the distribution of values in each column?',
        'What data quality issues should I address before analysis?',
        'What insights can be derived from this dataset?'
      ]
    : [
        'What is a correlation matrix and when should I use it?',
        'How do I identify outliers in my dataset?',
        'What are best practices for data cleaning?',
        'How can I visualize time series data effectively?'
      ];
  
  // Handle query submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate input
    if (!query.trim()) {
      setError('Please enter a question');
      return;
    }
    
    setError(null);
    setIsLoading(true);
    
    try {
      // Call the API
      const response = await submitQuery({
        query: query.trim(),
        dataset_id: datasetId,
        llm_provider: llmProvider,
        enable_fallback: enableFallback,
        fallback_provider: llmProvider === 'gemini' ? 'deepseek' : 'gemini',
        query_type: queryType === 'general' ? undefined : queryType,
        session_id: sessionId
      });
      
      // Format as a history item
      const historyItem: QueryHistoryItem = {
        query_id: response.query_id,
        query: response.query,
        response: response.response,
        llm_provider: response.llm_provider,
        dataset_id: response.dataset_id,
        timestamp: Date.now()
      };
      
      // Notify parent
      onQuerySubmitted(historyItem);
      
      // Clear the input
      setQuery('');
      
    } catch (error) {
      setError((error as Error).message || 'Failed to process query. Please try again.');
      setIsLoading(false);
    }
  };
  
  // Handle example query click
  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery);
  };
  
  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Query text area */}
        <div>
          <label 
            htmlFor="query" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Your Question
          </label>
          <textarea
            id="query"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder={datasetId 
              ? "Ask a question about your dataset..." 
              : "Ask a general data analysis question..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* LLM provider selection */}
          <div>
            <label 
              htmlFor="llm-provider" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              AI Model
            </label>
            <select
              id="llm-provider"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={llmProvider}
              onChange={(e) => setLlmProvider(e.target.value as LLMProvider)}
              disabled={isLoading}
            >
              {LLM_PROVIDERS.map((provider) => (
                <option key={provider.value} value={provider.value}>
                  {provider.label}
                </option>
              ))}
            </select>
          </div>
          
          {/* Query type selection */}
          <div>
            <label 
              htmlFor="query-type" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Query Type
            </label>
            <select
              id="query-type"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={queryType}
              onChange={(e) => setQueryType(e.target.value as QueryType)}
              disabled={isLoading}
            >
              {QUERY_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Fallback option */}
        <div className="flex items-center">
          <input
            id="enable-fallback"
            type="checkbox"
            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            checked={enableFallback}
            onChange={() => setEnableFallback(!enableFallback)}
            disabled={isLoading}
          />
          <label 
            htmlFor="enable-fallback" 
            className="ml-2 block text-sm text-gray-700"
          >
            Enable fallback to alternative model if primary fails
          </label>
        </div>
        
        {/* Submit button */}
        <div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
              isLoading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500'
            }`}
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Ask Question'}
          </button>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
      </form>
      
      {/* Example queries */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">
          Example Questions
        </h3>
        <div className="flex flex-wrap gap-2">
          {exampleQueries.map((eq, index) => (
            <button
              key={index}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-2 rounded-full transition-colors"
              onClick={() => handleExampleClick(eq)}
              disabled={isLoading}
            >
              {eq}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
