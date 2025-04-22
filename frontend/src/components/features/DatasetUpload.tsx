// C:\Projects\data-insight-generator\frontend\src\components\features\DatasetUpload.tsx

"use client";

import { useState, useRef } from 'react';
import { uploadDataset } from '@/services/datasets';
import { DatasetInfo } from '@/types/dataset';

interface DatasetUploadProps {
  onDatasetSelected: (dataset: DatasetInfo) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export default function DatasetUpload({ 
  onDatasetSelected,
  setIsLoading
}: DatasetUploadProps) {
  // States
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // References
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Constants
  const MAX_FILE_SIZE = Number(process.env.NEXT_PUBLIC_MAX_FILE_SIZE_MB || 10) * 1024 * 1024; // Convert MB to bytes
  const ACCEPTED_FILE_TYPES = [
    'text/csv',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/json'
  ];
  
  // Handler for the file input change event
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      validateAndUploadFile(files[0]);
    }
  };
  
  // Drag handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      validateAndUploadFile(files[0]);
    }
  };
  
  // Validate and upload the file
  const validateAndUploadFile = async (file: File) => {
    setFileError(null);
    
    // Validate file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setFileError('Invalid file type. Please upload a CSV, Excel, or JSON file.');
      return;
    }
    
    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File is too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024} MB.`);
      return;
    }
    
    // Upload the file
    try {
      setIsLoading(true);
      setUploadProgress(0);
      
      // Simulate upload progress (in a real app, you'd use an upload API that supports progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 95) {
            clearInterval(progressInterval);
            return 95;
          }
          return prev + 5;
        });
      }, 100);
      
      const dataset = await uploadDataset(file);
      
      // Clear the interval and set progress to 100%
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Notify the parent component
      onDatasetSelected(dataset);
      
      // Reset the form
      if (inputRef.current) {
        inputRef.current.value = '';
      }
      
      // Reset progress after a delay
      setTimeout(() => {
        setUploadProgress(0);
        setIsLoading(false);
      }, 1000);
      
    } catch (error) {
      setFileError((error as Error).message || 'Failed to upload file. Please try again.');
      setUploadProgress(0);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-4">
      {/* File dropzone */}
      <div 
        className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".csv,.xlsx,.xls,.json"
        />
        
        <div className="py-4">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" 
            />
          </svg>
          <p className="mt-2 text-sm text-gray-600">
            Drag & drop your file here, or{' '}
            <span className="text-blue-600">browse</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported: CSV, Excel, JSON (Max {MAX_FILE_SIZE / 1024 / 1024} MB)
          </p>
        </div>
      </div>
      
      {/* Upload progress */}
      {uploadProgress > 0 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}
      
      {/* Error message */}
      {fileError && (
        <div className="text-red-500 text-sm mt-2">
          {fileError}
        </div>
      )}
    </div>
  );
}
