import { useState, useCallback } from 'react';
import { DatasetInfo } from '@/types/dataset';
import { uploadDataset, getDataset, deleteDataset } from '@/services/datasets';

interface UseDatasetProps {
  onUploadSuccess?: (dataset: DatasetInfo) => void;
  onUploadError?: (error: Error) => void;
  onDeleteSuccess?: (datasetId: string) => void;
}

interface UseDatasetReturn {
  currentDataset: DatasetInfo | null;
  isLoading: boolean;
  error: Error | null;
  uploadDatasetFile: (file: File, datasetName?: string) => Promise<DatasetInfo>;
  loadDataset: (datasetId: string) => Promise<DatasetInfo>;
  removeDataset: (datasetId: string) => Promise<void>;
  setCurrentDataset: (dataset: DatasetInfo | null) => void;
}

export function useDataset({
  onUploadSuccess,
  onUploadError,
  onDeleteSuccess
}: UseDatasetProps = {}): UseDatasetReturn {
  const [currentDataset, setCurrentDataset] = useState<DatasetInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Function to upload a dataset file
  const uploadDatasetFile = useCallback(async (
    file: File, 
    datasetName?: string
  ): Promise<DatasetInfo> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const dataset = await uploadDataset(file, datasetName);
      
      // Set as current dataset
      setCurrentDataset(dataset);
      
      // Call success callback if provided
      if (onUploadSuccess) {
        onUploadSuccess(dataset);
      }
      
      return dataset;
    } catch (error) {
      console.error('Dataset upload failed:', error);
      const errorObj = error instanceof Error ? error : new Error('Failed to upload dataset');
      setError(errorObj);
      
      // Call error callback if provided
      if (onUploadError) {
        onUploadError(errorObj);
      }
      
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, [onUploadSuccess, onUploadError]);
  
  // Function to load a dataset by ID
  const loadDataset = useCallback(async (datasetId: string): Promise<DatasetInfo> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const dataset = await getDataset(datasetId);
      
      // Set as current dataset
      setCurrentDataset(dataset);
      
      return dataset;
    } catch (error) {
      console.error('Failed to load dataset:', error);
      const errorObj = error instanceof Error ? error : new Error('Failed to load dataset');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Function to delete a dataset
  const removeDataset = useCallback(async (datasetId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await deleteDataset(datasetId);
      
      // Clear current dataset if it's the one being deleted
      if (currentDataset?.dataset_id === datasetId) {
        setCurrentDataset(null);
      }
      
      // Call success callback if provided
      if (onDeleteSuccess) {
        onDeleteSuccess(datasetId);
      }
    } catch (error) {
      console.error('Failed to delete dataset:', error);
      const errorObj = error instanceof Error ? error : new Error('Failed to delete dataset');
      setError(errorObj);
      throw errorObj;
    } finally {
      setIsLoading(false);
    }
  }, [currentDataset, onDeleteSuccess]);
  
  return {
    currentDataset,
    isLoading,
    error,
    uploadDatasetFile,
    loadDataset,
    removeDataset,
    setCurrentDataset
  };
}
