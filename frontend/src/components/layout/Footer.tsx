"use client";

import { useEffect, useState } from 'react';

export default function Footer() {
  const [year, setYear] = useState<number>(new Date().getFullYear());
  
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  
  return (
    <footer className="bg-white mt-auto">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm">
            &copy; {year} Data Insight Generator
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <div className="text-sm text-gray-500">
              <span className="font-medium">Backend:</span> FastAPI
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">Frontend:</span> Next.js + TailwindCSS
            </div>
            <div className="text-sm text-gray-500">
              <span className="font-medium">LLM:</span> Gemini & DeepSeek
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
