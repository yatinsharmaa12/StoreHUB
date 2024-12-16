import React, { useState, useEffect } from 'react';
import { Code } from 'lucide-react';

const Loading = () => {
  const [loadingStage, setLoadingStage] = useState(0);
  const loadingMessages = [
    "Initializing sandbox...",
    "Loading components...",
    "Preparing environment...",
    "Almost there..."
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLoadingStage((prev) => (prev + 1) % loadingMessages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white/90  flex justify-center items-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <Code 
            className="w-24 h-24 text-black/40 animate-pulse" 
            strokeWidth={1.5}
          />
          <Code 
            className="absolute top-0 left-0 w-24 h-24 text-black/20 opacity-50 animate-spin-slow" 
            strokeWidth={1}
          />
        </div>
        
        <div className="text-center">
          <p className="text-xl text-black/60 font-medium tracking-wide mb-4">
            {loadingMessages[loadingStage]}
          </p>
          
          <div className="w-64 h-2 bg-black/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-black/50 transform transition-all duration-1000 ease-in-out"
              style={{
                width: `${((loadingStage + 1) / loadingMessages.length) * 100}%`
              }}
            ></div>
          </div>
        </div>

        <div className="flex space-x-2">
          {loadingMessages.map((_, index) => (
            <div 
              key={index} 
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index <= loadingStage 
                  ? 'bg-black/60 scale-125' 
                  : 'bg-black/20'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;