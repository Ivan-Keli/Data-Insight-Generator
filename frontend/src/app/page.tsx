"use client";

import { useState } from 'react';
import DatasetUpload from '@/components/features/DatasetUpload';
import QueryInput from '@/components/features/QueryInput';
import ResponseDisplay from '@/components/features/ResponseDisplay';
import QueryHistory from '@/components/features/QueryHistory';
import DataPreview from '@/components/data/DataPreview';
import { QueryHistoryItem } from '@/types/query';
import { DatasetInfo } from '@/types/dataset';

export default function Home() {
  // State for the current dataset
  const [currentDataset, setCurrentDataset] = useState<DatasetInfo | null>(null);
  
  // State for query history
  const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>([]);
  
  // State for current query response
  const [currentResponse, setCurrentResponse] = useState<QueryHistoryItem | null>(null);
  
  // State for loading status
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Generate a session ID if not already created
  const [sessionId] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const existingId = localStorage.getItem('session_id');
      if (existingId) return existingId;
      
      const newId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('session_id', newId);
      return newId;
    }
    return `session_${Date.now()}`;
  });
  
  // Handler for dataset selection
  const handleDatasetSelected = (dataset: DatasetInfo) => {
    setCurrentDataset(dataset);
    setCurrentResponse(null); // Clear any previous response
  };
  
  // Handler for query submission
  const handleQuerySubmitted = (queryResponse: QueryHistoryItem) => {
    // Add to history
    setQueryHistory(prev => [queryResponse, ...prev]);
    
    // Set as current response
    setCurrentResponse(queryResponse);
    
    // Clear loading state
    setIsLoading(false);
  };
  
  // Handler for history item selection
  const handleHistoryItemSelected = (item: QueryHistoryItem) => {
    setCurrentResponse(item);
  };
  
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Data Insight Generator</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Dataset Upload and History */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Upload Dataset</h2>
              <DatasetUpload 
                onDatasetSelected={handleDatasetSelected} 
                setIsLoading={setIsLoading}
              />
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Query History</h2>
              <QueryHistory 
                history={queryHistory} 
                onSelect={handleHistoryItemSelected}
                currentResponse={currentResponse}
              />
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Dataset Preview (if dataset is selected) */}
            {currentDataset && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                  Dataset: {currentDataset.name}
                </h2>
                <DataPreview dataset={currentDataset} />
              </div>
            )}
            
            {/* Query Input */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Ask a Question</h2>
              <QueryInput 
                datasetId={currentDataset?.dataset_id} 
                onQuerySubmitted={handleQuerySubmitted}
                setIsLoading={setIsLoading}
                isLoading={isLoading}
                sessionId={sessionId}
              />
            </div>
            
            {/* Response Display */}
            {currentResponse && (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Response</h2>
                <ResponseDisplay response={currentResponse} />
              </div>
            )}
            
            {/* Loading State */}
            {isLoading && !currentResponse && (
              <div className="bg-white p-6 rounded-lg shadow-sm flex justify-center items-center min-h-64">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
                  <p className="text-gray-600">Generating insights...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
