"use client";

import { useState } from 'react';
import { DatasetInfo, ColumnStat } from '@/types/dataset';
import { formatNumber, formatDataType } from '@/utils/formatting';

interface DataPreviewProps {
  dataset: DatasetInfo;
}

export default function DataPreview({ dataset }: DataPreviewProps) {
  // State for active tab
  const [activeTab, setActiveTab] = useState<'data' | 'overview'>('data');
  
  return (
    <div className="space-y-4">
      {/* Dataset info summary */}
      <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 pb-2 border-b">
        <div>
          <span className="font-medium">{dataset.name}</span>
          <span className="mx-2">•</span>
          <span>{dataset.row_count.toLocaleString()} rows</span>
          <span className="mx-2">•</span>
          <span>{dataset.columns.length} columns</span>
        </div>
        <div className="px-2 py-1 bg-gray-100 rounded-md text-xs uppercase">
          {dataset.file_type}
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="flex border-b">
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === 'data'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('data')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
          </svg>
          Data Preview
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium flex items-center ${
            activeTab === 'overview'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Overview
        </button>
      </div>
      
      {/* Data Preview Tab */}
      {activeTab === 'data' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {dataset.preview.columns.map((column) => (
                  <th
                    key={column}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {dataset.preview.preview_rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {dataset.preview.columns.map((column) => (
                    <td
                      key={`${rowIndex}-${column}`}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {row[column] === null ? (
                        <span className="text-gray-400 italic">null</span>
                      ) : (
                        String(row[column])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Note about preview rows */}
          <div className="mt-2 text-xs text-gray-500 text-center">
            Showing {dataset.preview.preview_rows.length} of {dataset.row_count.toLocaleString()} rows
          </div>
        </div>
      )}
      
      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Basic dataset information */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Dataset Information</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                <div className="col-span-1">
                  <dt className="text-xs text-gray-500">Filename</dt>
                  <dd className="font-medium">{dataset.name}</dd>
                </div>
                <div className="col-span-1">
                  <dt className="text-xs text-gray-500">File Type</dt>
                  <dd className="font-medium uppercase">{dataset.file_type}</dd>
                </div>
                <div className="col-span-1">
                  <dt className="text-xs text-gray-500">Total Rows</dt>
                  <dd className="font-medium">{dataset.row_count.toLocaleString()}</dd>
                </div>
                <div className="col-span-1">
                  <dt className="text-xs text-gray-500">Total Columns</dt>
                  <dd className="font-medium">{dataset.columns.length}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Data quality overview */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-2">Data Quality Overview</h3>
            <div className="bg-gray-50 p-4 rounded-md">
              {/* Missing values summary */}
              <div className="mb-4">
                <h4 className="text-xs font-medium text-gray-700 mb-1">Missing Values</h4>
                <div className="space-y-2">
                  {Object.entries(dataset.preview.column_stats)
                    .filter(([_, stats]) => stats.null_count > 0)
                    .sort(([_a, statsA], [_b, statsB]) => {
                      const percentA = statsA.null_count / (statsA.count + statsA.null_count) * 100;
                      const percentB = statsB.null_count / (statsB.count + statsB.null_count) * 100;
                      return percentB - percentA;
                    })
                    .map(([column, stats]) => {
                      const total = stats.count + stats.null_count;
                      const percentage = (stats.null_count / total) * 100;
                      
                      return (
                        <div key={column} className="flex items-center">
                          <div className="w-1/3 text-sm truncate">{column}</div>
                          <div className="w-2/3">
                            <div className="flex items-center">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    percentage > 20 ? 'bg-red-400' : 
                                    percentage > 5 ? 'bg-yellow-400' : 
                                    'bg-blue-400'
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="ml-2 text-xs text-gray-500">
                                {percentage.toFixed(1)}% ({stats.null_count.toLocaleString()})
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  
                  {/* If no missing values */}
                  {Object.values(dataset.preview.column_stats).every(
                    stats => stats.null_count === 0
                  ) && (
                    <p className="text-sm text-green-600 flex items-center">
                      <span className="flex w-4 h-4 bg-green-100 rounded-full mr-2 items-center justify-center">
                        <span className="block w-2 h-2 bg-green-500 rounded-full"></span>
                      </span>
                      No missing values found in this dataset.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Column type summary */}
              <div>
                <h4 className="text-xs font-medium text-gray-700 mb-1">Column Types</h4>
                <div className="flex flex-wrap gap-2">
                  {(() => {
                    const typeCounts: Record<string, number> = {};
                    
                    Object.values(dataset.preview.column_stats).forEach(stats => {
                      const type = formatDataType(stats.data_type);
                      typeCounts[type] = (typeCounts[type] || 0) + 1;
                    });
                    
                    return Object.entries(typeCounts).map(([type, count]) => (
                      <div key={type} className="bg-blue-50 px-2 py-1 rounded text-xs">
                        {type}: {count}
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
