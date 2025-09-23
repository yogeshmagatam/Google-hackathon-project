'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingIndicator({ size = 'md', className }: LoadingIndicatorProps) {
  return (
    <div className={cn(
      "flex items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl",
      className
    )}>
      <div className="flex space-x-1">
        <div 
          className={cn(
            "bg-gray-400 rounded-full animate-bounce",
            size === 'sm' && "w-1.5 h-1.5",
            size === 'md' && "w-2 h-2",
            size === 'lg' && "w-3 h-3"
          )}
          style={{ animationDelay: '0ms' }}
        />
        <div 
          className={cn(
            "bg-gray-400 rounded-full animate-bounce",
            size === 'sm' && "w-1.5 h-1.5",
            size === 'md' && "w-2 h-2",
            size === 'lg' && "w-3 h-3"
          )}
          style={{ animationDelay: '150ms' }}
        />
        <div 
          className={cn(
            "bg-gray-400 rounded-full animate-bounce",
            size === 'sm' && "w-1.5 h-1.5",
            size === 'md' && "w-2 h-2",
            size === 'lg' && "w-3 h-3"
          )}
          style={{ animationDelay: '300ms' }}
        />
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        AI is thinking...
      </span>
    </div>
  );
}

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-current rounded-full animate-pulse" />
        <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
        <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
      </div>
      <span className="text-xs">Typing...</span>
    </div>
  );
}

export function StreamingIndicator({ progress }: { progress?: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {progress ? `Generating... ${Math.round(progress)}%` : 'Generating response...'}
      </span>
    </div>
  );
}