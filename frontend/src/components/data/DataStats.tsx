"use client";

import React, { useState } from 'react';
import { DatasetInfo, ColumnStat } from '@/types/dataset';
import { formatNumber, formatDataType } from '@/utils/formatting';
import { BarChartIcon, PieChartIcon, AlertCircleIcon } from 'lucide-react';

interface DataStatsProps {
  dataset: DatasetInfo;
}

export default function DataStats({ dataset }: DataStatsProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  
  // Toggle column selection
  const toggleColumn = (column: string) => {
    setSelectedColumns(prev => 
      prev.includes(column)
        ? prev.filter(col => col !== column)
        : [...prev, column]
    );
  };
  
  // Select all columns
  const selectAllColumns = () => {
    setSelectedColumns(dataset.columns);
  };
  
  // Clear selection
  const clearSelection = () => {
    setSelectedColumns([]);
  };
  
  // Count data types in the dataset
  const countDataTypes = () => {
    const typeCounts: Record<string, number> = {};
    
    Object.entries(dataset.preview.column_stats).forEach(([_, stats]) => {
      const formattedType = formatDataType(stats.data_type);
      typeCounts[formattedType] = (typeCounts[formattedType] || 0) + 1;
    });
    
    return typeCounts;
  };
  
  // Get null percentage for a column
  const getNullPercentage = (stats: ColumnStat): number => {
    const total = stats.count + stats.null_count;
    return total === 0 ? 0 : (stats.null_count / total) * 100;
  };
  
  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Dataset Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Total Rows</div>
            <div className="text-2xl font-semibold">{dataset.row_count.toLocaleString()}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Total Columns</div>
            <div className="text-2xl font-semibold">{dataset.columns.length}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">File Type</div>
            <div className="text-2xl font-semibold uppercase">{dataset.file_type}</div>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-sm text-gray-500">Data Types</div>
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(countDataTypes()).map(([type, count]) => (
                <span key={type} className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                  {type}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Data Quality Overview */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Data Quality</h3>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
            <AlertCircleIcon size={16} className="mr-1" />
            Missing Values
          </h4>
          
          <div className="space-y-3">
            {Object.entries(dataset.preview.column_stats)
              .filter(([_, stats]) => stats.null_count > 0)
              .sort(([_a, statsA], [_b, statsB]) => 
                getNullPercentage(statsB) - getNullPercentage(statsA)
              )
              .map(([column, stats]) => {
                const nullPercentage = getNullPercentage(stats);
                
                return (
                  <div key={column} className="flex items-center">
                    <div className="w-1/3 text-sm truncate">{column}</div>
                    <div className="w-2/3">
                      <div className="flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              nullPercentage > 20 ? 'bg-red-400' : 
                              nullPercentage > 5 ? 'bg-yellow-400' : 
                              'bg-blue-400'
                            }`}
                            style={{ width: `${nullPercentage}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-xs text-gray-500">
                          {nullPercentage.toFixed(1)}% ({stats.null_count.toLocaleString()})
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
                <span className="inline-block w-4 h-4 bg-green-100 rounded-full mr-2 flex items-center justify-center">
                  <span className="block w-2 h-2 bg-green-500 rounded-full"></span>
                </span>
                No missing values found in this dataset.
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* Column Statistics */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-900">Column Statistics</h3>
          <div className="space-x-2">
            <button
              onClick={selectAllColumns}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
            >
              Select All
            </button>
            <button
              onClick={clearSelection}
              className="text-xs px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700"
              disabled={selectedColumns.length === 0}
            >
              Clear
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dataset.columns.map((column) => {
            const stats = dataset.preview.column_stats[column];
            const isSelected = selectedColumns.includes(column);
            const isNumeric = stats.data_type.includes('int') || stats.data_type.includes('float');
            
            return (
              <div 
                key={column}
                className={`bg-white p-4 rounded-lg shadow-sm border-2 ${
                  isSelected ? 'border-blue-500' : 'border-transparent'
                } cursor-pointer transition-colors hover:border-blue-300`}
                onClick={() => toggleColumn(column)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium text-gray-900 truncate max-w-[70%]" title={column}>
                    {column}
                  </h4>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full">
                    {formatDataType(stats.data_type)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-500">Non-null:</span> {stats.count.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-gray-500">Null:</span> {stats.null_count.toLocaleString()}
                    </div>
                    <div>
                      <span className="text-gray-500">Unique:</span> {stats.unique_count?.toLocaleString() ?? 'N/A'}
                    </div>
                  </div>
                  
                  {/* Numeric stats */}
                  {isNumeric && stats.min_value !== undefined && (
                    <div className="mt-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-500">Min:</span> {formatNumber(stats.min_value)}
                        </div>
                        <div>
                          <span className="text-gray-500">Max:</span> {formatNumber(stats.max_value)}
                        </div>
                        <div>
                          <span className="text-gray-500">Mean:</span> {formatNumber(stats.mean)}
                        </div>
                        <div>
                          <span className="text-gray-500">Std Dev:</span> {formatNumber(stats.std_dev)}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Categorical stats */}
                  {stats.most_common && stats.most_common.length > 0 && (
                    <div className="mt-2">
                      <div className="text-xs text-gray-500 mb-1">Top Values:</div>
                      <div className="space-y-1">
                        {stats.most_common.slice(0, 3).map((item, index) => (
                          <div key={index} className="flex justify-between text-xs bg-gray-50 p-1 rounded">
                            <span className="truncate max-w-[70%]" title={item.value}>{item.value}</span>
                            <span className="text-gray-500">{item.count.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
