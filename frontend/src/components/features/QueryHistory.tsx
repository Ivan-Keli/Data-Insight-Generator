"use client";

import { QueryHistoryItem } from '@/types/query';
import { HistoryIcon, SearchIcon } from 'lucide-react';
import { useState } from 'react';

interface QueryHistoryProps {
  history: QueryHistoryItem[];
  onSelect: (item: QueryHistoryItem) => void;
  currentResponse: QueryHistoryItem | null;
}

export default function QueryHistory({ 
  history, 
  onSelect,
  currentResponse
}: QueryHistoryProps) {
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Filter history items based on search term
  const filteredHistory = searchTerm.trim() === ''
    ? history
    : history.filter(item => 
        item.query.toLowerCase().includes(searchTerm.toLowerCase())
      );
  
  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get a truncated preview of the query
  const getQueryPreview = (query: string, maxLength: number = 60) => {
    if (query.length <= maxLength) return query;
    return query.substring(0, maxLength) + '...';
  };
  
  return (
    <div className="space-y-4">
      {/* Search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={16} className="text-gray-400" />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          placeholder="Search queries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {/* History list */}
      <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-4 text-gray-500 flex flex-col items-center">
            <HistoryIcon size={24} className="mb-2" />
            <p className="text-sm">
              {history.length === 0
                ? 'No queries yet'
                : 'No matching queries found'
              }
            </p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <button
              key={item.query_id}
              className={`w-full text-left p-3 rounded-md transition-colors ${
                currentResponse?.query_id === item.query_id
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-white border border-gray-200 hover:bg-gray-50'
              }`}
              onClick={() => onSelect(item)}
            >
              <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                {getQueryPreview(item.query)}
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className={`px-2 py-0.5 rounded-full ${
                  item.llm_provider === 'gemini'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  {item.llm_provider === 'gemini' ? 'Gemini' : 'DeepSeek'}
                </span>
                <span className="text-gray-500">
                  {formatTimestamp(item.timestamp)}
                </span>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
