/**
 * Request model for submitting a query about data.
 */
export interface QueryRequest {
    query: string;
    dataset_id?: string;
    llm_provider: LLMProvider;
    enable_fallback: boolean;
    fallback_provider: LLMProvider;
    query_type?: QueryType;
    session_id: string;
  }
  
  /**
   * Response model for a processed query.
   */
  export interface QueryResponse {
    query_id: string;
    query: string;
    response: string;
    llm_provider: LLMProvider;
    dataset_id?: string;
    processing_time: number;
  }
  
  /**
   * Model for a query history item.
   */
  export interface QueryHistoryItem {
    query_id: string;
    query: string;
    response: string;
    llm_provider: LLMProvider;
    dataset_id?: string;
    timestamp: number;
  }
  
  /**
   * LLM Provider options.
   */
  export type LLMProvider = 'gemini' | 'deepseek';
  
  /**
   * Query Type options.
   */
  export type QueryType = 
    | 'general'
    | 'correlation'
    | 'data_quality'
    | 'visualization'
    | 'feature_engineering'
    | 'predictive_modeling';
  
  /**
   * Option for query type selection.
   */
  export interface QueryTypeOption {
    value: QueryType;
    label: string;
    description: string;
  }
  
  /**
   * API Error response format.
   */
  export interface APIError {
    detail: string;
  }
  
  /**
   * Query input options for the UI.
   */
  export interface QueryInputOptions {
    promptTemplate?: string;
    suggestedQueries?: string[];
    maxTokens?: number;
    temperature?: number;
  }
