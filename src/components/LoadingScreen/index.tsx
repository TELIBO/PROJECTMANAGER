// components/LoadingScreen.tsx
import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900 dark:border-gray-100"></div>
    </div>
  );
};

export default LoadingScreen;