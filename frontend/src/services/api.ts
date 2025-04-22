import { APIError } from '@/types/query';

// Base API URL from environment variables
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Generic fetch wrapper with error handling
 */
async function fetchWithErrorHandling<T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    // Handle HTTP errors
    if (!response.ok) {
      const errorData: APIError = await response.json();
      throw new Error(errorData.detail || `API error: ${response.status}`);
    }

    // Parse JSON response
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * Get API health status
 */
export async function getApiHealth(): Promise<{ status: string; version: string }> {
  return fetchWithErrorHandling<{ status: string; version: string }>(
    `${API_URL}/api/health`
  );
}

/**
 * Get API information
 */
export async function getApiInfo(): Promise<any> {
  return fetchWithErrorHandling<any>(
    `${API_URL}/api/info`
  );
}

// Export common functionality and constants
export { fetchWithErrorHandling, API_URL };
