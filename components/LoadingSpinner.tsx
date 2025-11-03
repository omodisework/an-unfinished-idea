
import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center space-x-2">
    <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500"></div>
    <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500 delay-75"></div>
    <div className="w-4 h-4 rounded-full animate-bounce bg-blue-500 delay-150"></div>
  </div>
);

export default LoadingSpinner;
