import { QueryRequest, QueryResponse, QueryHistoryItem } from '@/types/query';
import { fetchWithErrorHandling, API_URL } from './api';

/**
 * Submit a query to the backend
 */
export async function submitQuery(
  queryRequest: QueryRequest
): Promise<QueryResponse> {
  return fetchWithErrorHandling<QueryResponse>(
    `${API_URL}/api/queries`,
    {
      method: 'POST',
      body: JSON.stringify(queryRequest),
    }
  );
}

/**
 * Get query history for a session
 */
export async function getQueryHistory(
  sessionId: string
): Promise<QueryHistoryItem[]> {
  return fetchWithErrorHandling<QueryHistoryItem[]>(
    `${API_URL}/api/queries/history/${sessionId}`
  );
}

/**
 * Clear query history for a session
 */
export async function clearQueryHistory(sessionId: string): Promise<void> {
  await fetchWithErrorHandling(
    `${API_URL}/api/queries/history/${sessionId}`,
    { method: 'DELETE' }
  );
}

/**
 * Get a specific query by ID
 * Note: This is not implemented in the current API but could be added later
 */
export async function getQuery(queryId: string): Promise<QueryResponse> {
  return fetchWithErrorHandling<QueryResponse>(
    `${API_URL}/api/queries/${queryId}`
  );
}
