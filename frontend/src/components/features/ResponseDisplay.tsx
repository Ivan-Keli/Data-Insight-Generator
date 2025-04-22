"use client";

import { useState, useEffect } from 'react';
import { QueryHistoryItem } from '@/types/query';
import ReactMarkdown from 'react-markdown';
import { CopyIcon, CheckIcon } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { nord } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ResponseDisplayProps {
  response: QueryHistoryItem;
}

export default function ResponseDisplay({ response }: ResponseDisplayProps) {
  const [copied, setCopied] = useState<boolean>(false);
  
  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timeout = setTimeout(() => {
        setCopied(false);
      }, 2000);
      
      return () => clearTimeout(timeout);
    }
  }, [copied]);
  
  // Handle copy button click
  const handleCopy = () => {
    navigator.clipboard.writeText(response.response);
    setCopied(true);
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <div className="space-y-4">
      {/* Response metadata */}
      <div className="flex flex-wrap justify-between items-center text-sm text-gray-600 pb-2 border-b">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {response.llm_provider === 'gemini' ? 'Google Gemini' : 'DeepSeek'}
          </span>
          <span>{formatTimestamp(response.timestamp)}</span>
        </div>
        
        <button
          onClick={handleCopy}
          className="flex items-center space-x-1 text-gray-500 hover:text-gray-700"
        >
          {copied ? (
            <>
              <CheckIcon size={16} className="text-green-500" />
              <span className="text-green-500">Copied!</span>
            </>
          ) : (
            <>
              <CopyIcon size={16} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Original query */}
      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-gray-700 font-medium">Query:</p>
        <p className="text-gray-600">{response.query}</p>
      </div>
      
      {/* Response content with Markdown rendering */}
      <div className="prose prose-blue max-w-none">
        <ReactMarkdown
          components={{
            // Custom rendering for code blocks with syntax highlighting
            code({ className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');
              const isCodeBlock = props.node.tagName === 'pre';

              return isCodeBlock ? (
                <SyntaxHighlighter
                  style={nord}
                  language={match[1]}
                  PreTag="div"
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
            // Custom rendering for links
            a: ({ node, ...props }) => (
              <a 
                {...props} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800 hover:underline"
              />
            ),
            // Custom rendering for headings
            h2: ({ node, ...props }) => (
              <h2 
                {...props} 
                className="text-xl font-bold mt-6 mb-4 pb-2 border-b"
              />
            ),
            h3: ({ node, ...props }) => (
              <h3 
                {...props} 
                className="text-lg font-bold mt-4 mb-2"
              />
            ),
          }}
        >
          {response.response}
        </ReactMarkdown>
      </div>
    </div>
  );
}
