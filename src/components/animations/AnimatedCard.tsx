'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  animation?: 'hover' | 'float' | 'tilt' | 'glow' | 'bounce' | 'slide';
  clickable?: boolean;
  onClick?: () => void;
  delay?: number;
}

const animations = {
  hover: {
    whileHover: { 
      y: -5,
      boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
    },
    transition: { type: "spring", stiffness: 300, damping: 20 }
  },
  float: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    },
    whileHover: { scale: 1.02 }
  },
  tilt: {
    whileHover: { 
      rotateY: 5,
      rotateX: 5,
      scale: 1.02,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    }
  },
  glow: {
    whileHover: {
      boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)",
      borderColor: "rgba(59, 130, 246, 0.5)",
      scale: 1.02
    }
  },
  bounce: {
    whileHover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    whileTap: { scale: 0.95 }
  },
  slide: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    whileHover: { x: 5 }
  }
};

export function AnimatedCard({
  children,
  className = '',
  animation = 'hover',
  clickable = false,
  onClick,
  delay = 0
}: AnimatedCardProps) {
  const animationProps = animations[animation];
  
  return (
    <motion.div
      className={`
        bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700
        shadow-sm overflow-hidden
        ${clickable ? 'cursor-pointer' : ''}
        ${className}
      `}
      initial={'initial' in animationProps ? animationProps.initial : undefined}
      animate={'animate' in animationProps ? animationProps.animate : undefined}
      whileHover={'whileHover' in animationProps ? animationProps.whileHover : undefined}
      whileTap={'whileTap' in animationProps ? animationProps.whileTap : undefined}
      transition={{ 
        duration: 0.3,
        ease: "easeOut",
        delay 
      }}
      onClick={clickable ? onClick : undefined}
    >
      {children}
    </motion.div>
  );
}