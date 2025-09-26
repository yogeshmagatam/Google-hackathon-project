'use client';

import { motion } from 'framer-motion';

interface AnimatedLoadingProps {
  type?: 'spinner' | 'dots' | 'pulse' | 'wave' | 'typing';
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

export function AnimatedLoading({ 
  type = 'spinner', 
  size = 'md', 
  color = 'blue-500',
  text 
}: AnimatedLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const spinnerVariants = {
    start: {
      rotate: 0
    },
    end: {
      rotate: 360
    }
  };

  const dotVariants = {
    start: {
      y: "0%"
    },
    end: {
      y: "100%"
    }
  };

  const pulseVariants = {
    start: {
      scale: 0.8,
      opacity: 0.5
    },
    end: {
      scale: 1.2,
      opacity: 1
    }
  };

  const waveVariants = {
    start: {
      scaleY: 1
    },
    end: {
      scaleY: 2
    }
  };

  if (type === 'spinner') {
    return (
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className={`${sizeClasses[size]} border-2 border-gray-200 border-t-${color} rounded-full`}
          variants={spinnerVariants}
          initial="start"
          animate="end"
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        {text && (
          <motion.p
            className="text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (type === 'dots') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 bg-${color} rounded-full`}
              variants={dotVariants}
              initial="start"
              animate="end"
              transition={{
                duration: 0.6,
                repeat: Infinity,
                repeatType: "reverse",
                delay: index * 0.2
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            className="text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (type === 'pulse') {
    return (
      <div className="flex flex-col items-center gap-3">
        <motion.div
          className={`${sizeClasses[size]} bg-${color} rounded-full`}
          variants={pulseVariants}
          initial="start"
          animate="end"
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        {text && (
          <motion.p
            className="text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (type === 'wave') {
    return (
      <div className="flex flex-col items-center gap-3">
        <div className="flex gap-1 items-end">
          {[0, 1, 2, 3, 4].map((index) => (
            <motion.div
              key={index}
              className={`w-1 h-4 bg-${color} rounded-full`}
              variants={waveVariants}
              initial="start"
              animate="end"
              transition={{
                duration: 0.8,
                repeat: Infinity,
                repeatType: "reverse",
                delay: index * 0.1
              }}
            />
          ))}
        </div>
        {text && (
          <motion.p
            className="text-sm text-gray-600 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {text}
          </motion.p>
        )}
      </div>
    );
  }

  if (type === 'typing') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className="w-1.5 h-1.5 bg-gray-400 rounded-full"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: index * 0.2
              }}
            />
          ))}
        </div>
        {text && (
          <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
            {text}
          </span>
        )}
      </div>
    );
  }

  return null;
}