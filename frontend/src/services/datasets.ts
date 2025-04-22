import { DatasetInfo } from '@/types/dataset';
import { fetchWithErrorHandling, API_URL } from './api';

/**
 * Upload a dataset file to the backend
 */
export async function uploadDataset(file: File, datasetName?: string): Promise<DatasetInfo> {
  const formData = new FormData();
  formData.append('file', file);
  
  if (datasetName) {
    formData.append('dataset_name', datasetName);
  }
  
  try {
    const response = await fetch(`${API_URL}/api/datasets/upload`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.detail || `Upload failed: ${response.status}`);
    }
    
    return await response.json() as DatasetInfo;
  } catch (error) {
    console.error('Dataset upload failed:', error);
    throw error;
  }
}

/**
 * Get dataset information by ID
 */
export async function getDataset(datasetId: string): Promise<DatasetInfo> {
  return fetchWithErrorHandling<DatasetInfo>(
    `${API_URL}/api/datasets/${datasetId}`
  );
}

/**
 * Delete a dataset
 */
export async function deleteDataset(datasetId: string): Promise<void> {
  await fetchWithErrorHandling(
    `${API_URL}/api/datasets/${datasetId}`,
    { method: 'DELETE' }
  );
}

/**
 * Get list of available datasets
 * Note: This is not implemented in the current API but could be added later
 */
export async function getDatasets(): Promise<DatasetInfo[]> {
  return fetchWithErrorHandling<DatasetInfo[]>(
    `${API_URL}/api/datasets`
  );
}
