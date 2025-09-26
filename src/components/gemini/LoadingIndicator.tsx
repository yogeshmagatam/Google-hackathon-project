'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingIndicator({ size = 'md', className }: LoadingIndicatorProps) {
  return (
    <motion.div 
      className={cn(
        "flex items-center gap-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl",
        className
      )}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div 
            key={index}
            className={cn(
              "bg-gray-400 rounded-full",
              size === 'sm' && "w-1.5 h-1.5",
              size === 'md' && "w-2 h-2",
              size === 'lg' && "w-3 h-3"
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: index * 0.2,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      <motion.span 
        className="text-sm text-gray-600 dark:text-gray-400"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        AI is thinking...
      </motion.span>
    </motion.div>
  );
}

export function TypingIndicator() {
  return (
    <motion.div 
      className="flex items-center gap-2 text-gray-500 dark:text-gray-400"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex space-x-1">
        {[0, 1, 2].map((index) => (
          <motion.div 
            key={index}
            className="w-1 h-1 bg-current rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.15,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>
      <motion.span 
        className="text-xs"
        animate={{ opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Typing...
      </motion.span>
    </motion.div>
  );
}

export function StreamingIndicator({ progress }: { progress?: number }) {
  return (
    <motion.div 
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div 
        className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <motion.span 
        className="text-sm text-gray-600 dark:text-gray-400"
        key={progress} // Re-animate when progress changes
        initial={{ opacity: 0.7 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {progress ? `Generating... ${Math.round(progress)}%` : 'Generating response...'}
      </motion.span>
      {progress && (
        <motion.div 
          className="w-20 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="h-full bg-blue-600 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </motion.div>
      )}
    </motion.div>
  );
}