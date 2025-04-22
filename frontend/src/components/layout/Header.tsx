"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MenuIcon, XIcon, BarChartIcon, GithubIcon } from 'lucide-react';
import { getApiHealth } from '@/services/api';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState<'healthy' | 'unhealthy' | 'checking'>('checking');
  
  // Check API health on component mount
  useEffect(() => {
    const checkApiHealth = async () => {
      try {
        const health = await getApiHealth();
        setApiStatus(health.status === 'healthy' ? 'healthy' : 'unhealthy');
      } catch (error) {
        setApiStatus('unhealthy');
      }
    };
    
    checkApiHealth();
  }, []);
  
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center">
                <BarChartIcon className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">Data Insight Generator</span>
              </Link>
            </div>
            
            <nav className="hidden md:ml-6 md:flex md:space-x-8">
              <Link 
                href="/"
                className="inline-flex items-center px-1 pt-1 border-b-2 border-blue-500 text-sm font-medium text-gray-900"
              >
                Dashboard
              </Link>
              
              <div className="flex items-center space-x-1">
                <div className={`h-2 w-2 rounded-full ${
                  apiStatus === 'healthy' ? 'bg-green-500' : 
                  apiStatus === 'unhealthy' ? 'bg-red-500' : 
                  'bg-yellow-500'
                }`}></div>
                <span className="text-sm text-gray-500">
                  API: {apiStatus === 'checking' ? 'Checking...' : apiStatus}
                </span>
              </div>
            </nav>
          </div>
          
          {/* Github link and mobile menu button */}
          <div className="flex items-center">
            <a 
              href="https://github.com/your-username/data-insight-generator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden md:flex items-center px-3 py-2 text-sm text-gray-500 hover:text-gray-700"
            >
              <GithubIcon className="h-5 w-5 mr-1" />
              <span>GitHub</span>
            </a>
            
            {/* Mobile menu button */}
            <div className="md:hidden -mr-2 flex items-center">
              <button
                type="button"
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                aria-expanded="false"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <XIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className="block pl-3 pr-4 py-2 border-l-4 border-blue-500 text-base font-medium text-blue-700 bg-blue-50"
            >
              Dashboard
            </Link>
            
            <a 
              href="https://github.com/your-username/data-insight-generator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            >
              GitHub
            </a>
            
            <div className="flex items-center pl-3 pr-4 py-2">
              <div className={`h-2 w-2 rounded-full ${
                apiStatus === 'healthy' ? 'bg-green-500' : 
                apiStatus === 'unhealthy' ? 'bg-red-500' : 
                'bg-yellow-500'
              }`}></div>
              <span className="ml-2 text-sm text-gray-500">
                API: {apiStatus === 'checking' ? 'Checking...' : apiStatus}
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
